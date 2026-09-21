package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"backend-auth/internal/config"
)

// SupabaseService handles interactions with Supabase Storage.
type SupabaseService struct {
	config *config.Config
}

// NewSupabaseService creates a new SupabaseService.
func NewSupabaseService(cfg *config.Config) *SupabaseService {
	return &SupabaseService{
		config: cfg,
	}
}

// UploadBase64Image uploads a base64 encoded image to a Supabase Storage bucket.
// It returns the path to the uploaded image.
func (s *SupabaseService) UploadBase64Image(bucketName, path, base64Data string) (string, error) {
	if s.config.SupabaseURL == "" || s.config.SupabaseServiceKey == "" {
		return "", fmt.Errorf("Supabase credentials not configured")
	}

	// Remove base64 header if present (e.g., "data:image/jpeg;base64,")
	parts := strings.SplitN(base64Data, ",", 2)
	var rawBase64 string
	if len(parts) == 2 {
		rawBase64 = parts[1]
	} else {
		rawBase64 = base64Data
	}

	imgBytes, err := base64.StdEncoding.DecodeString(rawBase64)
	if err != nil {
		return "", fmt.Errorf("invalid base64 image data: %v", err)
	}

	url := fmt.Sprintf("%s/storage/v1/object/%s/%s", s.config.SupabaseURL, bucketName, path)

	req, err := http.NewRequest("POST", url, bytes.NewReader(imgBytes))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "image/jpeg")
	req.Header.Set("Authorization", "Bearer "+s.config.SupabaseServiceKey)
	req.Header.Set("apikey", s.config.SupabaseServiceKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("supabase upload failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	return path, nil
}

// GetSignedURL generates a signed URL for a private file in a Supabase Storage bucket.
func (s *SupabaseService) GetSignedURL(bucketName, path string, expiresInSeconds int) (string, error) {
	if s.config.SupabaseURL == "" || s.config.SupabaseServiceKey == "" {
		return "", fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/storage/v1/object/sign/%s/%s", s.config.SupabaseURL, bucketName, path)

	payload := map[string]interface{}{
		"expiresIn": expiresInSeconds,
	}
	payloadBytes, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", url, bytes.NewReader(payloadBytes))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.config.SupabaseServiceKey)
	req.Header.Set("apikey", s.config.SupabaseServiceKey)

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("supabase sign URL failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	if signedURL, ok := result["signedURL"].(string); ok {
		// Construct full URL since signedURL from Supabase Storage API typically returns relative path
		if strings.HasPrefix(signedURL, "/") {
			// Some Supabase versions return /object/sign/... instead of /storage/v1/object/sign/...
			if !strings.HasPrefix(signedURL, "/storage/v1") {
				return s.config.SupabaseURL + "/storage/v1" + signedURL, nil
			}
			return s.config.SupabaseURL + signedURL, nil
		}
		return signedURL, nil
	}

	return "", fmt.Errorf("signedURL not found in response")
}
