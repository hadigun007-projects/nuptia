package handler

import (
	"net/http"

	"nuptia-backend/internal/domain"
	"nuptia-backend/internal/middleware"
	"nuptia-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) RegisterRoutes(publicRg *gin.RouterGroup, protectedRg *gin.RouterGroup) {
	auth := publicRg.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.POST("/google", h.LoginWithGoogle)
		auth.POST("/forgot-password", h.ForgotPassword)
		auth.POST("/reset-password", h.ResetPassword)
	}

	protectedAuth := protectedRg.Group("/auth")
	{
		protectedAuth.GET("/me", h.GetMe)
	}
}

// Register godoc
// POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req domain.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Data pendaftaran tidak valid: periksa nama, email, dan kata sandi (min 6 karakter)")
		return
	}

	res, err := h.authService.Register(req)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusCreated, res, nil)
}

// Login godoc
// POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Format email atau kata sandi tidak valid")
		return
	}

	res, err := h.authService.Login(req)
	if err != nil {
		ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, res, nil)
}

// LoginWithGoogle godoc
// POST /api/v1/auth/google
func (h *AuthHandler) LoginWithGoogle(c *gin.Context) {
	var req domain.GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Payload Google Sign-In tidak valid")
		return
	}

	res, err := h.authService.LoginWithGoogle(req)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, res, nil)
}

// GetMe godoc
// GET /api/v1/auth/me
func (h *AuthHandler) GetMe(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Pengguna tidak terautentikasi")
		return
	}

	user, err := h.authService.GetMe(userID)
	if err != nil {
		ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, user, nil)
}

// ForgotPassword godoc
// POST /api/v1/auth/forgot-password
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req domain.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Format email tidak valid")
		return
	}

	// Selalu response 200 meski email tidak terdaftar (keamanan)
	_ = h.authService.RequestPasswordReset(req)
	SuccessResponse(c, http.StatusOK, nil, strPtr("Jika email terdaftar, link reset akan dikirim ke inbox Anda"))
}

// ResetPassword godoc
// POST /api/v1/auth/reset-password
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req domain.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Data tidak valid: token dan kata sandi wajib diisi (min 6 karakter)")
		return
	}

	if err := h.authService.ResetPassword(req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, nil, strPtr("Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru Anda"))
}

func strPtr(s string) *string { return &s }
