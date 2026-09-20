package service

import (
	"fmt"
	"log"
	"net/smtp"
	"strings"

	"nuptia-backend/internal/config"
)

// EmailService handles sending transactional emails
type EmailService interface {
	SendPasswordResetEmail(to, name, resetURL string) error
}

type emailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) EmailService {
	return &emailService{cfg: cfg}
}

func (s *emailService) SendPasswordResetEmail(to, name, resetURL string) error {
	if s.cfg.SMTPHost == "" {
		log.Printf("[Email] SMTP_HOST tidak dikonfigurasi. Email reset ke %s dilewati.", to)
		return nil
	}

	from := s.cfg.SMTPUser
	if from == "" {
		from = "noreply@nuptia.id"
	}

	subject := "Reset Kata Sandi — Nuptia Admin Console"
	body := buildResetEmailHTML(name, resetURL)

	msg := buildMIMEMessage(from, to, subject, body)

	addr := fmt.Sprintf("%s:%s", s.cfg.SMTPHost, s.cfg.SMTPPort)

	var auth smtp.Auth
	if s.cfg.SMTPUser != "" && s.cfg.SMTPPass != "" {
		auth = smtp.PlainAuth("", s.cfg.SMTPUser, s.cfg.SMTPPass, s.cfg.SMTPHost)
	}

	if err := smtp.SendMail(addr, auth, from, []string{to}, []byte(msg)); err != nil {
		return fmt.Errorf("gagal mengirim email reset: %w", err)
	}

	log.Printf("[Email] Email reset kata sandi berhasil dikirim ke %s", to)
	return nil
}

func buildMIMEMessage(from, to, subject, htmlBody string) string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("From: Nuptia Admin <%s>\r\n", from))
	sb.WriteString(fmt.Sprintf("To: %s\r\n", to))
	sb.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	sb.WriteString("MIME-Version: 1.0\r\n")
	sb.WriteString("Content-Type: text/html; charset=\"UTF-8\"\r\n")
	sb.WriteString("\r\n")
	sb.WriteString(htmlBody)
	return sb.String()
}

func buildResetEmailHTML(name, resetURL string) string {
	if name == "" {
		name = "Admin"
	}
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Reset Kata Sandi</title></head>
<body style="margin:0;padding:0;background:#f8f5f2;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f8f5f2;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#b5338a;padding:32px;text-align:center;">
            <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
              💍 Nuptia <span style="font-size:11px;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:4px;margin-left:6px;">ADMIN</span>
            </span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#1a1a1a;">Reset Kata Sandi</h2>
            <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.6;">
              Halo <strong>%s</strong>,<br><br>
              Kami menerima permintaan reset kata sandi untuk akun admin Anda.
              Klik tombol di bawah untuk membuat kata sandi baru. Link ini berlaku selama <strong>1 jam</strong>.
            </p>
            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:28px auto;">
              <tr>
                <td style="background:#b5338a;border-radius:12px;">
                  <a href="%s" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                    Reset Kata Sandi →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;color:#888;font-size:12px;line-height:1.6;">
              Jika Anda tidak meminta reset ini, abaikan email ini — kata sandi Anda tidak akan berubah.<br><br>
              Atau salin link ini ke browser:<br>
              <span style="color:#b5338a;word-break:break-all;">%s</span>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f5f2;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#aaa;font-size:11px;">
              © 2026 Nuptia · Platform Undangan Digital · Email ini dikirim otomatis, tidak perlu dibalas.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`, name, resetURL, resetURL)
}
