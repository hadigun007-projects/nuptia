package repository

import (
	"errors"
	"strings"

	"nuptia-backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	normalizedEmail := strings.ToLower(strings.TrimSpace(email))
	err := r.db.Where("LOWER(email) = ?", normalizedEmail).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByGoogleID(googleID string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("google_id = ?", googleID).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindAll(search string, role string, limit int, offset int) ([]domain.User, int64, error) {
	var users []domain.User
	var total int64

	query := r.db.Model(&domain.User{})

	if strings.TrimSpace(search) != "" {
		s := "%" + strings.ToLower(strings.TrimSpace(search)) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ?", s, s)
	}

	if strings.TrimSpace(role) != "" && role != "all" {
		query = query.Where("role = ?", strings.TrimSpace(role))
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if limit <= 0 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}

	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&users).Error
	return users, total, err
}

func (r *userRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&domain.User{}).Count(&count).Error
	return count, err
}

func (r *userRepository) CountActive() (int64, error) {
	var count int64
	err := r.db.Model(&domain.User{}).Where("is_active = ?", true).Count(&count).Error
	return count, err
}

func (r *userRepository) UpdateRole(id uuid.UUID, role string) error {
	return r.db.Model(&domain.User{}).Where("id = ?", id).Update("role", role).Error
}

func (r *userRepository) UpdateStatus(id uuid.UUID, isActive bool) error {
	return r.db.Model(&domain.User{}).Where("id = ?", id).Update("is_active", isActive).Error
}

func (r *userRepository) Create(user *domain.User) error {
	user.Email = strings.ToLower(strings.TrimSpace(user.Email))
	return r.db.Create(user).Error
}

func (r *userRepository) Update(user *domain.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.User{}, id).Error
}


