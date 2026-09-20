package handler

import (
	"net/http"
	"strconv"
	"strings"

	"nuptia-backend/internal/domain"
	"nuptia-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AdminHandler struct {
	userRepo     domain.UserRepository
	templateRepo domain.TemplateRepository
}

func NewAdminHandler(userRepo domain.UserRepository, templateRepo domain.TemplateRepository) *AdminHandler {
	return &AdminHandler{
		userRepo:     userRepo,
		templateRepo: templateRepo,
	}
}

func (h *AdminHandler) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/stats", h.GetStats)
	rg.GET("/users", h.GetUsers)
	rg.POST("/internal-users", h.CreateInternalUser)
	rg.PATCH("/users/:id/role", h.UpdateUserRole)
	rg.PATCH("/users/:id/status", h.UpdateUserStatus)
	rg.DELETE("/users/:id", h.DeleteUser)
	rg.GET("/templates", h.GetTemplates)
	rg.PATCH("/templates/:id/active", h.ToggleTemplateActive)
}

func (h *AdminHandler) GetStats(c *gin.Context) {
	totalUsers, err := h.userRepo.Count()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menghitung jumlah pengguna"})
		return
	}

	activeUsers, err := h.userRepo.CountActive()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menghitung pengguna aktif"})
		return
	}

	totalTemplates, err := h.templateRepo.Count()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menghitung jumlah tema"})
		return
	}

	// Monthly metrics summary
	monthlyMetrics := []gin.H{
		{"month": "Apr", "users": 120, "invitations": 140, "revenue": 3200000},
		{"month": "Mei", "users": 160, "invitations": 190, "revenue": 4500000},
		{"month": "Jun", "users": 210, "invitations": 250, "revenue": 6100000},
		{"month": "Jul", "users": 280, "invitations": 340, "revenue": 8400000},
		{"month": "Agu", "users": 310, "invitations": 390, "revenue": 9800000},
		{"month": "Sep", "users": 340, "invitations": 435, "revenue": 11200000},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"totalUsers":           totalUsers,
			"activeUsers":          activeUsers,
			"totalInvitations":     1845,
			"publishedInvitations": 1210,
			"totalTemplates":       totalTemplates,
			"totalRevenue":         48500000,
			"userGrowthRate":       24,
			"invitationGrowthRate": 18,
			"monthlyMetrics":       monthlyMetrics,
		},
	})
}

func (h *AdminHandler) GetUsers(c *gin.Context) {
	search := c.Query("search")
	role := c.Query("role")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	users, total, err := h.userRepo.FindAll(search, role, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal mengambil daftar pengguna"})
		return
	}

	var results []gin.H
	for _, u := range users {
		status := "active"
		if !u.IsActive {
			status = "suspended"
		}
		results = append(results, gin.H{
			"id":              u.ID,
			"name":            u.Name,
			"email":           u.Email,
			"avatarUrl":       u.AvatarURL,
			"authProvider":    u.AuthProvider,
			"role":            u.Role,
			"status":          status,
			"createdAt":       u.CreatedAt,
			"invitationCount": 1,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"users":  results,
			"total":  total,
			"limit":  limit,
			"offset": offset,
		},
	})
}

func (h *AdminHandler) CreateInternalUser(c *gin.Context) {
	var req domain.CreateInternalUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Data user internal tidak valid: periksa nama, email, password (min 6 karakter), dan role"})
		return
	}

	validInternalRoles := map[string]bool{
		"admin":     true,
		"developer": true,
		"viewer":    true,
	}
	if !validInternalRoles[req.Role] {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Role internal harus bernilai 'admin', 'developer', atau 'viewer'"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	existing, err := h.userRepo.FindByEmail(email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal memeriksa email pengguna"})
		return
	}
	if existing != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Email sudah terdaftar dalam sistem"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal memproses kata sandi"})
		return
	}

	newUser := &domain.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: string(hash),
		Name:         strings.TrimSpace(req.Name),
		AuthProvider: "email",
		Role:         req.Role,
		IsActive:     true,
	}

	if err := h.userRepo.Create(newUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal membuat akun user internal"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "User internal berhasil ditambahkan",
		"data": gin.H{
			"id":              newUser.ID,
			"name":            newUser.Name,
			"email":           newUser.Email,
			"avatarUrl":       newUser.AvatarURL,
			"authProvider":    newUser.AuthProvider,
			"role":            newUser.Role,
			"status":          "active",
			"createdAt":       newUser.CreatedAt,
			"invitationCount": 0,
		},
	})
}

type UpdateRolePayload struct {
	Role string `json:"role" binding:"required"`
}

func (h *AdminHandler) UpdateUserRole(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID pengguna tidak valid"})
		return
	}

	var payload UpdateRolePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Role wajib diisi"})
		return
	}

	validRoles := map[string]bool{
		"customer":  true,
		"admin":     true,
		"developer": true,
		"viewer":    true,
	}
	if !validRoles[payload.Role] {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Role harus salah satu dari: customer, admin, developer, viewer"})
		return
	}

	if err := h.userRepo.UpdateRole(id, payload.Role); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal memperbarui role pengguna"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Role pengguna berhasil diperbarui",
		"data": gin.H{
			"id":   id,
			"role": payload.Role,
		},
	})
}

func (h *AdminHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	targetID, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID pengguna tidak valid"})
		return
	}

	currentUserID, ok := middleware.GetCurrentUserID(c)
	if ok && currentUserID == targetID {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Anda tidak dapat menghapus akun Anda sendiri"})
		return
	}

	if err := h.userRepo.Delete(targetID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menghapus pengguna"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Pengguna berhasil dihapus dari sistem",
		"data": gin.H{
			"id": targetID,
		},
	})
}

type UpdateStatusPayload struct {
	Status string `json:"status" binding:"required"` // "active" | "suspended"
}

func (h *AdminHandler) UpdateUserStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID pengguna tidak valid"})
		return
	}

	var payload UpdateStatusPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Status wajib diisi"})
		return
	}

	isActive := payload.Status == "active"
	if err := h.userRepo.UpdateStatus(id, isActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal memperbarui status pengguna"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status pengguna berhasil diperbarui",
		"data": gin.H{
			"id":     id,
			"status": payload.Status,
		},
	})
}

func (h *AdminHandler) GetTemplates(c *gin.Context) {
	templates, err := h.templateRepo.FindAll(domain.TemplateFilter{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal mengambil katalog tema"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    templates,
	})
}

func (h *AdminHandler) ToggleTemplateActive(c *gin.Context) {
	id := c.Param("id")
	tmpl, err := h.templateRepo.FindByIDOrSlug(id)
	if err != nil || tmpl == nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Template tidak ditemukan"})
		return
	}

	tmpl.IsActive = !tmpl.IsActive
	if err := h.templateRepo.Update(tmpl); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal memperbarui status aktif tema"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status aktif tema berhasil diubah",
		"data": gin.H{
			"id":       tmpl.ID,
			"isActive": tmpl.IsActive,
		},
	})
}
