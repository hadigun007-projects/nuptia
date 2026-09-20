package handler

import (
	"net/http"

	"nuptia-backend/internal/domain"
	"nuptia-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type TemplateHandler struct {
	svc service.TemplateService
}

func NewTemplateHandler(svc service.TemplateService) *TemplateHandler {
	return &TemplateHandler{svc: svc}
}

func (h *TemplateHandler) RegisterRoutes(rg *gin.RouterGroup) {
	templates := rg.Group("/templates")
	{
		templates.GET("", h.GetTemplates)
		templates.GET("/categories", h.GetCategories)
		templates.GET("/:id", h.GetTemplateByID)
	}
}

// GetTemplates godoc
// GET /api/v1/templates
func (h *TemplateHandler) GetTemplates(c *gin.Context) {
	var filter domain.TemplateFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid query parameters")
		return
	}

	templates, err := h.svc.GetTemplates(filter)
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	meta := gin.H{
		"total": len(templates),
	}

	SuccessResponse(c, http.StatusOK, templates, meta)
}

// GetTemplateByID godoc
// GET /api/v1/templates/:id
func (h *TemplateHandler) GetTemplateByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		ErrorResponse(c, http.StatusBadRequest, "ID parameter is required")
		return
	}

	template, err := h.svc.GetTemplateByIDOrSlug(id)
	if err != nil {
		ErrorResponse(c, http.StatusNotFound, "Template tidak ditemukan")
		return
	}

	SuccessResponse(c, http.StatusOK, template, nil)
}

// GetCategories godoc
// GET /api/v1/templates/categories
func (h *TemplateHandler) GetCategories(c *gin.Context) {
	categories, err := h.svc.GetCategories()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	SuccessResponse(c, http.StatusOK, categories, gin.H{"total": len(categories)})
}
