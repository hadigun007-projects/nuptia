package service

import (
	"errors"

	"nuptia-backend/internal/domain"
)

type TemplateService interface {
	GetTemplates(filter domain.TemplateFilter) ([]domain.Template, error)
	GetTemplateByIDOrSlug(identifier string) (*domain.Template, error)
	GetCategories() ([]string, error)
}

type templateService struct {
	repo domain.TemplateRepository
}

func NewTemplateService(repo domain.TemplateRepository) TemplateService {
	return &templateService{repo: repo}
}

func (s *templateService) GetTemplates(filter domain.TemplateFilter) ([]domain.Template, error) {
	return s.repo.FindAll(filter)
}

func (s *templateService) GetTemplateByIDOrSlug(identifier string) (*domain.Template, error) {
	if identifier == "" {
		return nil, errors.New("identifier cannot be empty")
	}
	template, err := s.repo.FindByIDOrSlug(identifier)
	if err != nil {
		return nil, err
	}
	if template == nil {
		return nil, errors.New("template not found")
	}
	return template, nil
}

func (s *templateService) GetCategories() ([]string, error) {
	return s.repo.GetCategories()
}
