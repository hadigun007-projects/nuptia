package service

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"nuptia-backend/internal/config"
	"nuptia-backend/internal/domain"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(req domain.RegisterRequest) (*domain.AuthResponse, error)
	Login(req domain.LoginRequest) (*domain.AuthResponse, error)
	LoginWithGoogle(req domain.GoogleLoginRequest) (*domain.AuthResponse, error)
	GetMe(userID uuid.UUID) (*domain.UserResponse, error)
	RequestPasswordReset(req domain.ForgotPasswordRequest) error
	ResetPassword(req domain.ResetPasswordRequest) error
}

type authService struct {
	userRepo      domain.UserRepository
	resetRepo     domain.PasswordResetRepository
	emailService  EmailService
	cfg           *config.Config
}

func NewAuthService(userRepo domain.UserRepository, resetRepo domain.PasswordResetRepository, emailSvc EmailService, cfg *config.Config) AuthService {
	return &authService{
		userRepo:     userRepo,
		resetRepo:    resetRepo,
		emailService: emailSvc,
		cfg:          cfg,
	}
}

type JWTClaims struct {
	UserID uuid.UUID `json:"userId"`
	Email  string    `json:"email"`
	Role   string    `json:"role"`
	jwt.RegisteredClaims
}

func (s *authService) Register(req domain.RegisterRequest) (*domain.AuthResponse, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))

	// 1. Check if email already registered
	existingUser, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("email sudah terdaftar, silakan gunakan email lain atau masuk")
	}

	// 2. Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("gagal mengenkripsi kata sandi: %w", err)
	}

	// 3. Create user
	newUser := &domain.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: string(hash),
		Name:         strings.TrimSpace(req.Name),
		AuthProvider: "email",
		Role:         "customer",
		IsActive:     true,
	}

	if err := s.userRepo.Create(newUser); err != nil {
		return nil, fmt.Errorf("gagal membuat akun pengguna: %w", err)
	}

	// 4. Generate JWT
	token, err := s.generateToken(newUser)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{
		Token: token,
		User:  s.toUserResponse(newUser),
	}, nil
}

func (s *authService) Login(req domain.LoginRequest) (*domain.AuthResponse, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("email atau kata sandi tidak sesuai")
	}

	if !user.IsActive {
		return nil, errors.New("akun Anda sedang dinonaktifkan")
	}

	if user.PasswordHash == "" {
		return nil, errors.New("akun ini terdaftar menggunakan Google. Silakan masuk dengan tombol Google")
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("email atau kata sandi tidak sesuai")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{
		Token: token,
		User:  s.toUserResponse(user),
	}, nil
}

type GoogleTokenInfo struct {
	Sub     string `json:"sub"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	Aud     string `json:"aud"`
}

func (s *authService) LoginWithGoogle(req domain.GoogleLoginRequest) (*domain.AuthResponse, error) {
	var googleID string
	var email string
	var name string
	var picture string

	// Verify Google ID Token if credential string is provided
	if req.Credential != "" {
		resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.Credential)
		if err != nil {
			return nil, fmt.Errorf("gagal menghubungi server Google: %w", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return nil, errors.New("kredensial token Google tidak valid atau sudah kedaluwarsa")
		}

		var info GoogleTokenInfo
		if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
			return nil, errors.New("gagal memproses response Google OAuth")
		}

		googleID = info.Sub
		email = strings.ToLower(strings.TrimSpace(info.Email))
		name = info.Name
		picture = info.Picture
	} else if req.Email != "" && req.Sub != "" {
		// Fallback for direct development / testing payloads
		googleID = req.Sub
		email = strings.ToLower(strings.TrimSpace(req.Email))
		name = req.Name
		picture = req.Picture
	} else {
		return nil, errors.New("kredensial Google OAuth wajib diisi")
	}

	// 1. Try to find user by GoogleID
	user, err := s.userRepo.FindByGoogleID(googleID)
	if err != nil {
		return nil, err
	}

	// 2. If not found by GoogleID, check by email
	if user == nil {
		user, err = s.userRepo.FindByEmail(email)
		if err != nil {
			return nil, err
		}

		if user != nil {
			// Link existing email user with Google
			user.GoogleID = googleID
			if user.AvatarURL == "" {
				user.AvatarURL = picture
			}
			if err := s.userRepo.Update(user); err != nil {
				return nil, err
			}
		} else {
			// Create new user via Google
			if name == "" {
				name = strings.Split(email, "@")[0]
			}
			user = &domain.User{
				ID:           uuid.New(),
				Email:        email,
				Name:         name,
				AvatarURL:    picture,
				AuthProvider: "google",
				GoogleID:     googleID,
				Role:         "customer",
				IsActive:     true,
			}
			if err := s.userRepo.Create(user); err != nil {
				return nil, fmt.Errorf("gagal mendaftarkan akun Google: %w", err)
			}
		}
	} else {
		// Update profile photo if available and changed
		if picture != "" && user.AvatarURL != picture {
			user.AvatarURL = picture
			_ = s.userRepo.Update(user)
		}
	}

	if !user.IsActive {
		return nil, errors.New("akun Anda sedang dinonaktifkan")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{
		Token: token,
		User:  s.toUserResponse(user),
	}, nil
}

func (s *authService) GetMe(userID uuid.UUID) (*domain.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("pengguna tidak ditemukan")
	}
	res := s.toUserResponse(user)
	return &res, nil
}

func (s *authService) generateToken(user *domain.User) (string, error) {
	claims := JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "nuptia-auth",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return "", fmt.Errorf("gagal menandatangani token JWT: %w", err)
	}

	return signedToken, nil
}

func (s *authService) toUserResponse(user *domain.User) domain.UserResponse {
	return domain.UserResponse{
		ID:           user.ID,
		Name:         user.Name,
		Email:        user.Email,
		AvatarURL:    user.AvatarURL,
		AuthProvider: user.AuthProvider,
		Role:         user.Role,
		CreatedAt:    user.CreatedAt,
	}
}

// RequestPasswordReset membuat token reset dan mengirim email ke user
func (s *authService) RequestPasswordReset(req domain.ForgotPasswordRequest) error {
	email := strings.ToLower(strings.TrimSpace(req.Email))

	// Cari user — selalu response sukses agar tidak bocorkan info email
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil // silent fail
	}
	if user == nil {
		return nil // user tidak ada, tapi tetap 200
	}

	// Hapus token lama milik user
	_ = s.resetRepo.DeleteByUserID(user.ID)

	// Generate 32-byte crypto-random token
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return fmt.Errorf("gagal menghasilkan token reset: %w", err)
	}
	tokenStr := hex.EncodeToString(b)

	resetToken := &domain.PasswordResetToken{
		ID:        uuid.New(),
		UserID:    user.ID,
		Token:     tokenStr,
		ExpiresAt: time.Now().UTC().Add(1 * time.Hour),
	}

	if err := s.resetRepo.Create(resetToken); err != nil {
		return fmt.Errorf("gagal menyimpan token reset: %w", err)
	}

	resetURL := fmt.Sprintf("%s/#/reset-password?token=%s", s.cfg.AppBaseURL, tokenStr)
	return s.emailService.SendPasswordResetEmail(user.Email, user.Name, resetURL)
}

// ResetPassword memvalidasi token dan memperbarui kata sandi user
func (s *authService) ResetPassword(req domain.ResetPasswordRequest) error {
	tokenRecord, err := s.resetRepo.FindValid(req.Token)
	if err != nil {
		return fmt.Errorf("gagal memeriksa token: %w", err)
	}
	if tokenRecord == nil {
		return errors.New("link reset tidak valid atau sudah kedaluwarsa")
	}

	user, err := s.userRepo.FindByID(tokenRecord.UserID)
	if err != nil || user == nil {
		return errors.New("akun tidak ditemukan")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("gagal mengenkripsi kata sandi baru: %w", err)
	}

	user.PasswordHash = string(hash)
	if err := s.userRepo.Update(user); err != nil {
		return fmt.Errorf("gagal menyimpan kata sandi baru: %w", err)
	}

	return s.resetRepo.MarkUsed(req.Token)
}
