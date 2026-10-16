package services

import (
	"fmt"
	"html"
	"log"
	"strings"
	"time"

	"backend-auth/internal/config"
	"backend-auth/internal/models"
	"backend-auth/internal/repositories"

	"github.com/resend/resend-go/v2"
)

// EmailService handles sending malpractice alert emails via Resend HTTP API.
type EmailService struct {
	cfg       *config.Config
	adminRepo *repositories.AdminRepo
	userRepo  *repositories.UserRepo
	supabase  *SupabaseService
}

// NewEmailService creates a new EmailService.
func NewEmailService(cfg *config.Config, adminRepo *repositories.AdminRepo, userRepo *repositories.UserRepo, supabase *SupabaseService) *EmailService {
	return &EmailService{
		cfg:       cfg,
		adminRepo: adminRepo,
		userRepo:  userRepo,
		supabase:  supabase,
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

	// 1. Check if Resend API Key is configured
	if s.cfg.ResendAPIKey == "" {
		log.Printf("[EMAIL] malpractice email skipped reason=Resend API key not configured malpractice_id=%d", logEntry.ID)
		return
	}

	// 1.5. Skip sending emails for routine browser focus/tab switch events to avoid spam
	if logEntry.EventType == "BROWSER_WINDOW_LOST_FOCUS" || logEntry.EventType == "TAB_SWITCH_/_BROWSER_MINIMIZED" {
		log.Printf("[EMAIL] malpractice email skipped reason=routine_browser_event malpractice_id=%d event_type=%s", logEntry.ID, logEntry.EventType)
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
	
	// Check for snapshot evidence and generate a signed URL (e.g., valid for 24 hours)
	var signedURL string
	if logEntry.SnapshotPath != "" && s.supabase != nil {
		if url, err := s.supabase.GetSignedURL("malpractice-evidence", logEntry.SnapshotPath, 86400); err == nil {
			signedURL = url
		} else {
			log.Printf("[EMAIL] failed to generate signed URL for snapshot %s: %v", logEntry.SnapshotPath, err)
		}
	}

	htmlBody := s.buildHTMLBody(logEntry, signedURL)

	// 4. Send email to each admin individually using Resend API
	for _, admin := range admins {
		if admin.Email == "" {
			continue
		}

		err := s.sendViaResend(admin.Email, subject, htmlBody)
		if err != nil {
			log.Printf("[EMAIL] malpractice email failed to send malpractice_id=%d admin_email=%s error=%v", logEntry.ID, admin.Email, err)
		} else {
			log.Printf("[EMAIL] malpractice email sent successfully malpractice_id=%d admin_email=%s", logEntry.ID, admin.Email)
		}
	}
}

// sendViaResend sends an HTML email via the Resend HTTP API with automatic fallback
func (s *EmailService) sendViaResend(to string, subject string, htmlBody string) error {
	primaryKey := s.cfg.ResendAPIKey
	if primaryKey == "" {
		primaryKey = s.cfg.FallbackResendAPIKey
	}

	from := s.cfg.MailFrom
	if from == "" {
		from = "onboarding@resend.dev"
	}

	client := resend.NewClient(primaryKey)
	params := &resend.SendEmailRequest{
		From:    from,
		To:      []string{to},
		Subject: subject,
		Html:    htmlBody,
	}

	_, err := client.Emails.Send(params)
	if err != nil {
		log.Printf("[EMAIL] Primary Resend send failed (%v). Attempting fallback Resend account...", err)
		if s.cfg.FallbackResendAPIKey != "" && s.cfg.FallbackResendAPIKey != primaryKey {
			fallbackClient := resend.NewClient(s.cfg.FallbackResendAPIKey)
			fallbackTo := to
			// If sending to unverified recipient failed on free tier, try fallback verified admin email
			if s.cfg.FallbackEmail != "" && s.cfg.FallbackEmail != to {
				fallbackTo = s.cfg.FallbackEmail
			}

			fallbackParams := &resend.SendEmailRequest{
				From:    from,
				To:      []string{fallbackTo},
				Subject: subject,
				Html:    htmlBody,
			}
			_, fbErr := fallbackClient.Emails.Send(fallbackParams)
			if fbErr == nil {
				log.Printf("[EMAIL] Successfully sent email via fallback Resend account to %s", fallbackTo)
				return nil
			}
			log.Printf("[EMAIL] Fallback Resend also failed: %v", fbErr)
		}
		return fmt.Errorf("resend_send_error: %w", err)
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
func (s *EmailService) buildHTMLBody(logEntry *models.MalpracticeLog, signedURL string) string {
	esc := html.EscapeString

	var detailRows strings.Builder

	if logEntry.CandidateName != "" {
		detailRows.WriteString(s.buildDetailRow("Candidate Name", esc(logEntry.CandidateName)))
	}
	if logEntry.CandidateEmail != "" {
		detailRows.WriteString(s.buildDetailRow("Candidate Email", esc(logEntry.CandidateEmail)))
	}
	if logEntry.CandidateRegNo != "" {
		detailRows.WriteString(s.buildDetailRow("Reg. No", esc(logEntry.CandidateRegNo)))
	} else {
		detailRows.WriteString(s.buildDetailRow("Reg. No", "N/A"))
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
		// Convert to IST (Indian Standard Time)
		if loc, err := time.LoadLocation("Asia/Kolkata"); err == nil {
			ts = ts.In(loc)
		}
		detailRows.WriteString(s.buildDetailRow("Detected At", ts.Format("02 January 2006, 03:04:05 PM (IST)")))
	}

	evidenceCTA := ""
	isImpersonation := strings.Contains(strings.ToUpper(logEntry.EventType), "IMPERSONATION") || strings.Contains(strings.ToLower(logEntry.Details), "master photo")

	if isImpersonation && logEntry.UserID > 0 {
		var masterPhotoURL string
		if s.userRepo != nil {
			if user, err := s.userRepo.FindByID(logEntry.UserID); err == nil && user != nil && user.AvatarUrl != "" {
				masterPhotoURL = user.AvatarUrl
			}
		}

		if masterPhotoURL != "" && !strings.HasPrefix(masterPhotoURL, "http") && !strings.HasPrefix(masterPhotoURL, "data:") && s.supabase != nil {
			if url, err := s.supabase.GetSignedURL("master-photos", masterPhotoURL, 86400); err == nil {
				masterPhotoURL = url
			}
		}

		if masterPhotoURL != "" || signedURL != "" {
			evidenceCTA = fmt.Sprintf(`
<!-- Dual Impersonation Evidence Comparison -->
<tr><td style="padding:0 30px 24px;text-align:center;">
<div style="background-color:#0f172a;border-radius:10px;padding:16px;border:1px solid #334155;margin-bottom:16px;">
  <p style="margin:0 0 14px;color:#ef4444;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🚨 Impersonation Facial Mismatch Evidence</p>
  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="table-layout:fixed;">
    <tr>
      <td width="48%%" style="vertical-align:top;text-align:center;padding:8px;background:#1e293b;border-radius:8px;border:2px solid #22c55e;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:0.5px;">✓ 1st: Registered Master Photo</p>
        <img src="%s" alt="Official Master Photo" style="width:100%%;max-height:180px;object-fit:cover;border-radius:6px;display:block;margin:0 auto;" />
        <p style="margin:6px 0 0;font-size:10px;color:#94a3b8;">Captured upon Registration</p>
      </td>
      <td width="4%%"></td>
      <td width="48%%" style="vertical-align:top;text-align:center;padding:8px;background:#1e293b;border-radius:8px;border:2px solid #ef4444;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:0.5px;">⚠️ 2nd: Live Attendee Flagged</p>
        <img src="%s" alt="Live Flagged Snapshot" style="width:100%%;max-height:180px;object-fit:cover;border-radius:6px;display:block;margin:0 auto;" />
        <p style="margin:6px 0 0;font-size:10px;color:#fca5a5;font-weight:600;">Mismatch Detected Live</p>
      </td>
    </tr>
  </table>
</div>
%s
</td></tr>
`, esc(masterPhotoURL), esc(signedURL), func() string {
				if signedURL != "" {
					return fmt.Sprintf(`<a href="%s" style="background-color:#ef4444;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:700;font-size:13px;display:inline-block;">View Full-Resolution Attendee Evidence</a>`, esc(signedURL))
				}
				return ""
			}())
		}
	} else if signedURL != "" {
		evidenceCTA = fmt.Sprintf(`
<!-- Evidence -->
<tr><td style="padding:0 40px 24px;text-align:center;">
<img src="%s" alt="Webcam Evidence Snapshot" style="max-width:100%%; border-radius:8px; border: 2px solid #ef4444; margin-bottom:16px;" />
<br/>
<a href="%s" style="background-color:#ef4444;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:700;font-size:14px;display:inline-block;">View High-Res Webcam Evidence</a>
</td></tr>
`, esc(signedURL), esc(signedURL))
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

%s

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
</html>`, detailRows.String(), evidenceCTA)
}

func (s *EmailService) buildDetailRow(label, value string) string {
	return fmt.Sprintf(`<tr><td style="padding:12px 16px;font-weight:600;color:#94a3b8;width:160px;border-bottom:1px solid #1e293b;">%s</td><td style="padding:12px 16px;color:#f1f5f9;border-bottom:1px solid #1e293b;">%s</td></tr>`, label, value)
}
