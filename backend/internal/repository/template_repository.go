package repository

import (
	"errors"
	"strings"

	"nuptia-backend/internal/domain"

	"gorm.io/gorm"
)

type templateRepository struct {
	db *gorm.DB
}

func NewTemplateRepository(db *gorm.DB) domain.TemplateRepository {
	return &templateRepository{db: db}
}

func (r *templateRepository) FindAll(filter domain.TemplateFilter) ([]domain.Template, error) {
	var templates []domain.Template
	query := r.db.Model(&domain.Template{})

	// Default only show active templates unless specified
	if filter.ActiveOnly == nil || *filter.ActiveOnly {
		query = query.Where("is_active = ?", true)
	}

	if filter.Category != "" && filter.Category != "all" {
		query = query.Where("LOWER(category) = ?", strings.ToLower(filter.Category))
	}

	if filter.Tier != "" && filter.Tier != "all" {
		query = query.Where("LOWER(tier) = ?", strings.ToLower(filter.Tier))
	}

	if filter.Search != "" {
		searchTerm := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(tagline) LIKE ? OR LOWER(description) LIKE ?", searchTerm, searchTerm, searchTerm)
	}

	// Order by sort_order ASC, then rating DESC
	err := query.Order("sort_order ASC, rating DESC, created_at DESC").Find(&templates).Error
	return templates, err
}

func (r *templateRepository) FindByIDOrSlug(identifier string) (*domain.Template, error) {
	var template domain.Template
	err := r.db.Where("id = ? OR slug = ?", identifier, identifier).First(&template).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &template, nil
}

func (r *templateRepository) GetCategories() ([]string, error) {
	var categories []string
	err := r.db.Model(&domain.Template{}).
		Where("is_active = ?", true).
		Distinct("category").
		Pluck("category", &categories).Error
	return categories, err
}

func (r *templateRepository) Create(t *domain.Template) error {
	return r.db.Create(t).Error
}

func (r *templateRepository) Update(t *domain.Template) error {
	return r.db.Save(t).Error
}

func (r *templateRepository) Delete(id string) error {
	// Soft deactivate or hard delete
	return r.db.Model(&domain.Template{}).Where("id = ?", id).Update("is_active", false).Error
}

func (r *templateRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&domain.Template{}).Count(&count).Error
	return count, err
}
