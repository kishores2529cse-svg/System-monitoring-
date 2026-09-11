package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html"
	"log"
	"net/http"
	"strings"
	"time"

	"backend-auth/internal/config"
	"backend-auth/internal/models"
	"backend-auth/internal/repositories"
)

// EmailService handles sending malpractice alert emails via Resend HTTP API.
type EmailService struct {
	cfg       *config.Config
	adminRepo *repositories.AdminRepo
}

// NewEmailService creates a new EmailService.
func NewEmailService(cfg *config.Config, adminRepo *repositories.AdminRepo) *EmailService {
	return &EmailService{
		cfg:       cfg,
		adminRepo: adminRepo,
	}
}

// SendMalpracticeAlert sends a professional HTML email to all registered admins
// after a malpractice record has been successfully persisted.
// This method is safe to call in a goroutine — it never panics or affects the caller.
func (s *EmailService) SendMalpracticeAlert(logEntry *models.MalpracticeLog) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("[EMAIL] panic recovered in SendMalpracticeAlert: %v", r)
		}
	}()

	// 1. Check if Resend API key is configured
	if s.cfg.ResendAPIKey == "" {
		log.Printf("[EMAIL] malpractice email skipped reason=RESEND_API_KEY missing malpractice_id=%d", logEntry.ID)
		return
	}

	// 2. Fetch all admins
	admins, err := s.adminRepo.GetAllAdmins()
	if err != nil || len(admins) == 0 {
		log.Printf("[EMAIL] malpractice email skipped reason=no admins found malpractice_id=%d", logEntry.ID)
		return
	}

	// 3. Build email subject and body
	subject := s.buildSubject(logEntry)
	htmlBody := s.buildHTMLBody(logEntry)
	from := s.cfg.MailFrom
	if from == "" {
		from = "onboarding@resend.dev"
	}

	// 4. Send email to each admin using Resend API
	for _, admin := range admins {
		if admin.Email == "" {
			continue
		}

		err := s.sendViaResend(admin.Email, from, subject, htmlBody)
		if err != nil {
			log.Printf("[EMAIL] malpractice email failed to send malpractice_id=%d admin_email=%s error=%s", logEntry.ID, admin.Email, err.Error())
		} else {
			log.Printf("[EMAIL] malpractice email sent successfully malpractice_id=%d admin_email=%s", logEntry.ID, admin.Email)
		}
	}
}

// sendViaResend sends an HTML email using the Resend HTTP API.
func (s *EmailService) sendViaResend(to, from, subject, htmlBody string) error {
	url := "https://api.resend.com/emails"

	payload := map[string]interface{}{
		"from":    from,
		"to":      []string{to},
		"subject": subject,
		"html":    htmlBody,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+s.cfg.ResendAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("resend API returned status code %d", resp.StatusCode)
	}

	return nil
}

// buildSubject generates a dynamic email subject from the malpractice record.
func (s *EmailService) buildSubject(logEntry *models.MalpracticeLog) string {
	eventType := strings.TrimSpace(logEntry.EventType)
	candidateName := strings.TrimSpace(logEntry.CandidateName)

	if eventType != "" && candidateName != "" {
		return fmt.Sprintf("[Malpractice Alert] %s — %s", eventType, candidateName)
	}
	if eventType != "" {
		return fmt.Sprintf("[Malpractice Alert] %s — Candidate", eventType)
	}
	if candidateName != "" {
		return fmt.Sprintf("[Malpractice Alert] Candidate %s", candidateName)
	}
	return "[Malpractice Alert] Malpractice Detected"
}

// buildHTMLBody generates a professional HTML email from the malpractice record.
// All dynamic values are HTML-escaped to prevent injection.
func (s *EmailService) buildHTMLBody(logEntry *models.MalpracticeLog) string {
	esc := html.EscapeString

	var detailRows strings.Builder

	if logEntry.CandidateName != "" {
		detailRows.WriteString(s.buildDetailRow("Candidate Name", esc(logEntry.CandidateName)))
	}
	if logEntry.CandidateEmail != "" {
		detailRows.WriteString(s.buildDetailRow("Candidate Email", esc(logEntry.CandidateEmail)))
	}
	if logEntry.UserID > 0 {
		detailRows.WriteString(s.buildDetailRow("Candidate ID", fmt.Sprintf("%d", logEntry.UserID)))
	}
	if logEntry.EventType != "" {
		detailRows.WriteString(s.buildDetailRow("Malpractice Type", esc(logEntry.EventType)))
	}
	if logEntry.Severity != "" {
		severityColor := "#f59e0b"
		switch strings.ToUpper(logEntry.Severity) {
		case "CRITICAL":
			severityColor = "#ef4444"
		case "WARNING":
			severityColor = "#f59e0b"
		case "INFO":
			severityColor = "#3b82f6"
		}
		detailRows.WriteString(fmt.Sprintf(`<tr><td style="padding:12px 16px;font-weight:600;color:#94a3b8;width:160px;border-bottom:1px solid #1e293b;">Severity</td><td style="padding:12px 16px;color:#f1f5f9;border-bottom:1px solid #1e293b;"><span style="background:%s;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:0.5px;">%s</span></td></tr>`, severityColor, esc(strings.ToUpper(logEntry.Severity))))
	}
	if logEntry.Details != "" {
		detailRows.WriteString(s.buildDetailRow("Details", esc(logEntry.Details)))
	}
	if logEntry.DetectedItem != "" {
		detailRows.WriteString(s.buildDetailRow("Detected Item", esc(logEntry.DetectedItem)))
	}
	if logEntry.Confidence > 0 {
		detailRows.WriteString(s.buildDetailRow("Confidence", fmt.Sprintf("%.0f%%", logEntry.Confidence*100)))
	}

	ts := logEntry.Timestamp
	if ts.IsZero() {
		ts = logEntry.CreatedAt
	}
	if !ts.IsZero() {
		detailRows.WriteString(s.buildDetailRow("Detected At", ts.Format("02 January 2006, 03:04:05 PM")))
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:40px 20px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:12px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.5);">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#0f172a 0%%,#1e293b 100%%);padding:32px 40px;text-align:center;border-bottom:2px solid #ef4444;">
<h1 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#f1f5f9;letter-spacing:1.5px;">SYSTEM MONITORING</h1>
<p style="margin:0;font-size:13px;color:#ef4444;font-weight:700;letter-spacing:2px;">🚨 MALPRACTICE ALERT</p>
</td></tr>

<!-- Intro -->
<tr><td style="padding:28px 40px 16px;">
<p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.6;">A malpractice event has been detected during an active assessment. Please review the details below.</p>
</td></tr>

<!-- Details Table -->
<tr><td style="padding:0 40px 28px;">
<table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;border-radius:8px;overflow:hidden;border:1px solid #334155;">
%s
</table>
</td></tr>

<!-- CTA -->
<tr><td style="padding:0 40px 32px;text-align:center;">
<p style="margin:0 0 16px;font-size:13px;color:#94a3b8;">Please review the assessment monitoring dashboard for further details.</p>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#0f172a;padding:20px 40px;text-align:center;border-top:1px solid #334155;">
<p style="margin:0;font-size:12px;color:#64748b;">System Monitoring &bull; Code. Compile. Conquer.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`, detailRows.String())
}

func (s *EmailService) buildDetailRow(label, value string) string {
	return fmt.Sprintf(`<tr><td style="padding:12px 16px;font-weight:600;color:#94a3b8;width:160px;border-bottom:1px solid #1e293b;">%s</td><td style="padding:12px 16px;color:#f1f5f9;border-bottom:1px solid #1e293b;">%s</td></tr>`, label, value)
}
