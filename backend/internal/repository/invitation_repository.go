package repository

import (
	"errors"

	"nuptia-backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type invitationRepository struct {
	db *gorm.DB
}

// NewInvitationRepository creates a new PostgreSQL implementation of domain.InvitationRepository
func NewInvitationRepository(db *gorm.DB) domain.InvitationRepository {
	return &invitationRepository{db: db}
}

// FindByUserID retrieves all invitations belonging to a specific customer ordered by latest updated
func (r *invitationRepository) FindByUserID(userID uuid.UUID) ([]domain.Invitation, error) {
	var invitations []domain.Invitation
	err := r.db.Where("user_id = ?", userID).
		Order("updated_at DESC").
		Find(&invitations).Error
	return invitations, err
}

// FindByIDAndUserID retrieves an invitation by ID ensuring ownership by the customer
func (r *invitationRepository) FindByIDAndUserID(id string, userID uuid.UUID) (*domain.Invitation, error) {
	var inv domain.Invitation
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&inv).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &inv, nil
}

// FindByID retrieves an invitation by ID (for public view or admin inspection)
func (r *invitationRepository) FindByID(id string) (*domain.Invitation, error) {
	var inv domain.Invitation
	err := r.db.Where("id = ?", id).First(&inv).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &inv, nil
}

// FindBySlug retrieves an invitation by its unique URL slug
func (r *invitationRepository) FindBySlug(slug string) (*domain.Invitation, error) {
	var inv domain.Invitation
	err := r.db.Where("slug = ?", slug).First(&inv).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &inv, nil
}

// Create inserts a new invitation into PostgreSQL
func (r *invitationRepository) Create(invitation *domain.Invitation) error {
	return r.db.Create(invitation).Error
}

// Update updates an existing invitation entity in PostgreSQL
func (r *invitationRepository) Update(invitation *domain.Invitation) error {
	return r.db.Save(invitation).Error
}

// Delete performs soft-delete on an invitation for a specific user
func (r *invitationRepository) Delete(id string, userID uuid.UUID) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Invitation{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("undangan tidak ditemukan atau Anda tidak memiliki akses untuk menghapusnya")
	}
	return nil
}

// CountByUserID counts invitations owned by a user
func (r *invitationRepository) CountByUserID(userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Invitation{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}

// TotalCount counts all active invitations in the system
func (r *invitationRepository) TotalCount() (int64, error) {
	var count int64
	err := r.db.Model(&domain.Invitation{}).Count(&count).Error
	return count, err
}
