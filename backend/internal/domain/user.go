package domain

import (
	"time"

	"github.com/google/uuid"
)

// User represents a registered customer or admin in PostgreSQL
type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Email        string    `gorm:"uniqueIndex;size:255;not null" json:"email"`
	PasswordHash string    `gorm:"size:255" json:"-"` // Hidden from JSON
	Name         string    `gorm:"size:128;not null" json:"name"`
	AvatarURL    string    `gorm:"type:text" json:"avatarUrl"`
	AuthProvider string    `gorm:"size:32;not null;default:'email'" json:"authProvider"` // 'email' | 'google'
	GoogleID     string    `gorm:"index;size:128" json:"googleId,omitempty"`
	Role         string    `gorm:"size:32;not null;default:'customer'" json:"role"` // 'customer' | 'admin'
	IsActive     bool      `gorm:"default:true" json:"isActive"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// RegisterRequest payload for email/password registration
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=128"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest payload for email/password login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// GoogleLoginRequest payload for Google OAuth ID Token
type GoogleLoginRequest struct {
	Credential string `json:"credential"` // Google ID Token string (from GIS)
	Email      string `json:"email"`      // Optional direct payload
	Name       string `json:"name"`
	Picture    string `json:"picture"`
	Sub        string `json:"sub"` // Google Subject ID
}

// UserResponse public view of user
type UserResponse struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	AvatarURL    string    `json:"avatarUrl"`
	AuthProvider string    `json:"authProvider"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}

// AuthResponse returned upon successful login or registration
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// UserRepository interface defines data operations on users
type UserRepository interface {
	FindByEmail(email string) (*User, error)
	FindByGoogleID(googleID string) (*User, error)
	FindByID(id uuid.UUID) (*User, error)
	FindAll(search string, role string, limit int, offset int) ([]User, int64, error)
	Count() (int64, error)
	CountActive() (int64, error)
	UpdateRole(id uuid.UUID, role string) error
	UpdateStatus(id uuid.UUID, isActive bool) error
	Create(user *User) error
	Update(user *User) error
}

