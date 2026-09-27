package handler

import (
	"net/http"

	"nuptia-backend/internal/domain"
	"nuptia-backend/internal/middleware"
	"nuptia-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type InvitationHandler struct {
	invService service.InvitationService
}

func NewInvitationHandler(invService service.InvitationService) *InvitationHandler {
	return &InvitationHandler{invService: invService}
}

// RegisterRoutes registers invitation routes
func (h *InvitationHandler) RegisterRoutes(publicRg *gin.RouterGroup, protectedRg *gin.RouterGroup) {
	// Public routes
	publicRg.GET("/invitations/public/:slug", h.GetPublicBySlug)

	// Protected routes (Customer only accesses their own invitations)
	invitations := protectedRg.Group("/invitations")
	{
		invitations.GET("", h.GetMyInvitations)
		invitations.POST("", h.CreateInvitation)
		invitations.POST("/blank", h.CreateBlankInvitation)
		invitations.GET("/:id", h.GetByID)
		invitations.PUT("/:id", h.UpdateInvitation)
		invitations.DELETE("/:id", h.DeleteInvitation)
		invitations.POST("/:id/duplicate", h.DuplicateInvitation)
		invitations.PATCH("/:id/status", h.UpdateStatus)
	}
}

// GetMyInvitations lists all invitations belonging to the logged-in customer
// GET /api/v1/invitations
func (h *InvitationHandler) GetMyInvitations(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	invitations, err := h.invService.GetMyInvitations(userID)
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Gagal mengambil data undangan: "+err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, invitations, gin.H{
		"count": len(invitations),
	})
}

// GetByID returns detail of a specific invitation owned by customer
// GET /api/v1/invitations/:id
func (h *InvitationHandler) GetByID(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	id := c.Param("id")
	inv, err := h.invService.GetInvitationByID(id, userID)
	if err != nil {
		ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, inv, nil)
}

// GetPublicBySlug returns invitation data for guest preview/website
// GET /api/v1/invitations/public/:slug
func (h *InvitationHandler) GetPublicBySlug(c *gin.Context) {
	slug := c.Param("slug")
	inv, err := h.invService.GetPublicInvitationBySlug(slug)
	if err != nil {
		ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, inv, nil)
}

// CreateInvitation creates a new invitation from input
// POST /api/v1/invitations
func (h *InvitationHandler) CreateInvitation(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	var req domain.CreateInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Data pembuatan undangan tidak valid: nama mempelai wajib diisi")
		return
	}

	inv, err := h.invService.CreateInvitation(userID, req)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusCreated, inv, nil)
}

// CreateBlankInvitation creates an initial blank invitation for scratch building
// POST /api/v1/invitations/blank
func (h *InvitationHandler) CreateBlankInvitation(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	inv, err := h.invService.CreateBlankInvitation(userID)
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	SuccessResponse(c, http.StatusCreated, inv, nil)
}

// UpdateInvitation saves full or partial form updates
// PUT /api/v1/invitations/:id
func (h *InvitationHandler) UpdateInvitation(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	id := c.Param("id")
	var req domain.UpdateInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Format payload pembaruan tidak valid: "+err.Error())
		return
	}

	inv, err := h.invService.UpdateInvitation(id, userID, req)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, inv, nil)
}

// DeleteInvitation removes an invitation
// DELETE /api/v1/invitations/:id
func (h *InvitationHandler) DeleteInvitation(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	id := c.Param("id")
	if err := h.invService.DeleteInvitation(id, userID); err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, gin.H{"id": id, "deleted": true}, nil)
}

// DuplicateInvitation clones an existing invitation
// POST /api/v1/invitations/:id/duplicate
func (h *InvitationHandler) DuplicateInvitation(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	id := c.Param("id")
	cloned, err := h.invService.DuplicateInvitation(id, userID)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusCreated, cloned, nil)
}

// UpdateStatus changes status between Draft, Published, and Live
// PATCH /api/v1/invitations/:id/status
func (h *InvitationHandler) UpdateStatus(c *gin.Context) {
	userID, ok := middleware.GetCurrentUserID(c)
	if !ok {
		ErrorResponse(c, http.StatusUnauthorized, "Sesi login tidak valid")
		return
	}

	id := c.Param("id")
	var req domain.UpdateInvitationStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Status harus salah satu dari: Draft, Published, atau Live")
		return
	}

	inv, err := h.invService.UpdateStatus(id, userID, req.Status)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, inv, nil)
}
