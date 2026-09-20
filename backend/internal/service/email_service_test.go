package service_test

import (
	"testing"

	"nuptia-backend/internal/config"
	"nuptia-backend/internal/service"
)

func TestSendPasswordResetEmail(t *testing.T) {
	cfg := &config.Config{
		SMTPHost: "localhost",
		SMTPPort: "1025",
		SMTPUser: "noreply@nuptia.id",
	}

	emailSvc := service.NewEmailService(cfg)
	err := emailSvc.SendPasswordResetEmail("admin@nuptia.id", "Admin Nuptia", "http://localhost:5174/#/reset-password?token=testtoken123")
	if err != nil {
		t.Fatalf("expected no error sending email, got: %v", err)
	}
}
