package repository

import (
	"errors"
	"time"

	"nuptia-backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type passwordResetRepository struct {
	db *gorm.DB
}

func NewPasswordResetRepository(db *gorm.DB) domain.PasswordResetRepository {
	return &passwordResetRepository{db: db}
}

// Create menyimpan token reset baru ke database
func (r *passwordResetRepository) Create(token *domain.PasswordResetToken) error {
	return r.db.Create(token).Error
}

// FindValid mencari token yang valid: belum digunakan dan belum expired
func (r *passwordResetRepository) FindValid(tokenStr string) (*domain.PasswordResetToken, error) {
	var token domain.PasswordResetToken
	err := r.db.
		Where("token = ? AND used = false AND expires_at > ?", tokenStr, time.Now().UTC()).
		First(&token).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &token, nil
}

// MarkUsed menandai token sebagai sudah digunakan
func (r *passwordResetRepository) MarkUsed(tokenStr string) error {
	return r.db.Model(&domain.PasswordResetToken{}).
		Where("token = ?", tokenStr).
		Update("used", true).Error
}

// DeleteByUserID menghapus semua token lama milik user (cleanup sebelum buat token baru)
func (r *passwordResetRepository) DeleteByUserID(userID uuid.UUID) error {
	return r.db.Where("user_id = ?", userID).Delete(&domain.PasswordResetToken{}).Error
}
