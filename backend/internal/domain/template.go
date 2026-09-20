package domain

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// JSONRaw represents a JSONB object in PostgreSQL
type JSONRaw []byte

func (j JSONRaw) Value() (driver.Value, error) {
	if len(j) == 0 {
		return "{}", nil
	}
	return string(j), nil
}

func (j *JSONRaw) Scan(value interface{}) error {
	if value == nil {
		*j = []byte("{}")
		return nil
	}
	switch v := value.(type) {
	case []byte:
		*j = append((*j)[0:0], v...)
	case string:
		*j = append((*j)[0:0], []byte(v)...)
	default:
		return errors.New("unsupported data type for JSONRaw")
	}
	return nil
}

func (j JSONRaw) MarshalJSON() ([]byte, error) {
	if len(j) == 0 {
		return []byte("{}"), nil
	}
	return j, nil
}

func (j *JSONRaw) UnmarshalJSON(data []byte) error {
	if j == nil {
		return errors.New("domain.JSONRaw: UnmarshalJSON on nil pointer")
	}
	*j = append((*j)[0:0], data...)
	return nil
}

// JSONStringList represents a JSONB array of strings in PostgreSQL
type JSONStringList []string

func (j JSONStringList) Value() (driver.Value, error) {
	if j == nil {
		return "[]", nil
	}
	bytes, err := json.Marshal(j)
	if err != nil {
		return "[]", err
	}
	return string(bytes), nil
}

func (j *JSONStringList) Scan(value interface{}) error {
	if value == nil {
		*j = []string{}
		return nil
	}
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("unsupported data type for JSONStringList")
	}
	return json.Unmarshal(bytes, j)
}

// Template represents the template entity stored in PostgreSQL
type Template struct {
	ID                string         `gorm:"primaryKey;size:64" json:"id"`
	Slug              string         `gorm:"uniqueIndex;size:64;not null" json:"slug"`
	Name              string         `gorm:"size:128;not null" json:"name"`
	Tagline           string         `gorm:"size:255" json:"tagline"`
	Description       string         `gorm:"type:text" json:"description"`
	Category          string         `gorm:"index;size:32;not null" json:"category"`
	Tier              string         `gorm:"index;size:16;not null;default:'free'" json:"tier"`
	ThumbnailURL      string         `gorm:"type:text;not null" json:"thumbnailUrl"`
	PreviewURL        string         `gorm:"type:text;not null" json:"previewUrl"`
	Rating            float64        `gorm:"type:numeric(3,1);default:5.0" json:"rating"`
	IsActive          bool           `gorm:"index;default:true" json:"isActive"`
	IsPopular         bool           `gorm:"default:false" json:"isPopular"`
	IsNew             bool           `gorm:"default:false" json:"isNew"`
	SortOrder         int            `gorm:"default:0" json:"sortOrder"`
	SupportedFeatures JSONStringList `gorm:"type:jsonb;default:'[]'" json:"supportedFeatures"`
	DefaultConfig     JSONRaw        `gorm:"type:jsonb;default:'{}'" json:"defaultConfig"`
	CreatedAt         time.Time      `json:"createdAt"`
	UpdatedAt         time.Time      `json:"updatedAt"`
}

// TemplateFilter represents query parameters for listing templates
type TemplateFilter struct {
	Category string `form:"category"`
	Tier     string `form:"tier"`
	Search   string `form:"search"`
	ActiveOnly *bool `form:"activeOnly"`
}

// TemplateRepository interface defines data access operations
type TemplateRepository interface {
	FindAll(filter TemplateFilter) ([]Template, error)
	FindByIDOrSlug(identifier string) (*Template, error)
	GetCategories() ([]string, error)
	Create(t *Template) error
	Update(t *Template) error
	Delete(id string) error
	Count() (int64, error)
}
