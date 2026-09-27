package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// PersonProfile for bride / groom bio details
type PersonProfile struct {
	Nick      string `json:"nick"`
	Full      string `json:"full"`
	Parents   string `json:"parents"`
	PhotoURL  string `json:"photoUrl,omitempty"`
	Instagram string `json:"instagram,omitempty"`
	Bio       string `json:"bio,omitempty"`
}

// EventSession represents each wedding event sub-schedule (Akad, Resepsi, etc.)
type EventSession struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Time     string `json:"time"`
	EndTime  string `json:"endTime,omitempty"`
	Timezone string `json:"timezone"`
	Venue    string `json:"venue"`
	Address  string `json:"address"`
	MapsURL  string `json:"mapsUrl"`
}

// EventData contains wedding ceremony & reception details
type EventData struct {
	GroomNick      string         `json:"groomNick"`
	BrideNick      string         `json:"brideNick"`
	GroomFull      string         `json:"groomFull"`
	BrideFull      string         `json:"brideFull"`
	GroomParents   string         `json:"groomParents"`
	BrideParents   string         `json:"brideParents"`
	GroomPhoto     string         `json:"groomPhoto,omitempty"`
	BridePhoto     string         `json:"bridePhoto,omitempty"`
	GroomInstagram string         `json:"groomInstagram,omitempty"`
	BrideInstagram string         `json:"brideInstagram,omitempty"`
	GroomBio       string         `json:"groomBio,omitempty"`
	BrideBio       string         `json:"brideBio,omitempty"`
	AkadDate       string         `json:"akadDate"`
	AkadTime       string         `json:"akadTime"`
	ResepsiDate    string         `json:"resepsiDate"`
	ResepsiTime    string         `json:"resepsiTime"`
	Venue          string         `json:"venue"`
	Address        string         `json:"address"`
	MapsURL        string         `json:"mapsUrl"`
	Quote          string         `json:"quote"`
	Blessing       string         `json:"blessing"`
	Sessions       []EventSession `json:"sessions,omitempty"`
}

// GalleryItem for wedding photo gallery
type GalleryItem struct {
	ID      string `json:"id"`
	URL     string `json:"url"`
	Caption string `json:"caption"`
	Loading bool   `json:"loading"`
}

// MediaData contains photos, background music & video
type MediaData struct {
	HeroURL      string        `json:"heroUrl"`
	Gallery      []GalleryItem `json:"gallery"`
	VideoURL     string        `json:"videoUrl"`
	MusicTitle   string        `json:"musicTitle"`
	MusicPlaying bool          `json:"musicPlaying"`
	MusicURL     string        `json:"musicUrl,omitempty"`
	Autoplay     bool          `json:"autoplay,omitempty"`
}

// PhysicalGiftAddress shipping address for physical wedding gifts
type PhysicalGiftAddress struct {
	RecipientName string `json:"recipientName"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	City          string `json:"city"`
	PostalCode    string `json:"postalCode"`
}

// GuestData contains RSVP configuration and digital angpao/gift registry
type GuestData struct {
	RSVPEnabled         bool                 `json:"rsvpEnabled"`
	GreetingsEnabled    bool                 `json:"greetingsEnabled"`
	BankName            string               `json:"bankName"`
	AccountNo           string               `json:"accountNo"`
	AccountHolder       string               `json:"accountHolder"`
	EwalletType         string               `json:"ewalletType"`
	EwalletNo           string               `json:"ewalletNo"`
	EwalletName         string               `json:"ewalletName"`
	QRISURL             string               `json:"qrisUrl,omitempty"`
	PhysicalGiftEnabled bool                 `json:"physicalGiftEnabled,omitempty"`
	PhysicalGiftAddress *PhysicalGiftAddress `json:"physicalGiftAddress,omitempty"`
}

// LoveStoryMilestone for relationship timeline
type LoveStoryMilestone struct {
	ID       string `json:"id"`
	Year     string `json:"year"`
	Date     string `json:"date"`
	Title    string `json:"title"`
	Story    string `json:"story"`
	ImageURL string `json:"imageUrl,omitempty"`
}

// StreamingConfig for live stream integration
type StreamingConfig struct {
	Enabled      bool   `json:"enabled"`
	Platform     string `json:"platform"`
	URL          string `json:"url"`
	ScheduleDate string `json:"scheduleDate"`
	ScheduleTime string `json:"scheduleTime"`
	Notes        string `json:"notes,omitempty"`
}

// SocialConfig for AR filter and wedding hashtags
type SocialConfig struct {
	IGFilterURL string `json:"igFilterUrl"`
	Hashtag     string `json:"hashtag"`
	IGGroom     string `json:"igGroom"`
	IGBride     string `json:"igBride"`
}

// GuestBookEntry for guest attendance & QR check-in
type GuestBookEntry struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Category  string `json:"category"`
	Pax       int    `json:"pax"`
	Status    string `json:"status"`
	CheckedIn bool   `json:"checkedIn"`
	Notes     string `json:"notes,omitempty"`
}

// GreetingItem for guest wishes and greetings
type GreetingItem struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Relationship string `json:"relationship"`
	Message      string `json:"message"`
	CreatedAt    string `json:"createdAt"`
	IsPinned     bool   `json:"isPinned"`
}

// InvitationSettings for custom slug, privacy and search engine indexing
type InvitationSettings struct {
	CustomSlug        string `json:"customSlug"`
	IsPrivate         bool   `json:"isPrivate"`
	Password          string `json:"password,omitempty"`
	SearchEngineIndex bool   `json:"searchEngineIndex"`
	MusicAutoplay     bool   `json:"musicAutoplay"`
}

// ThemeConfig for template selection & primary color palette
type ThemeConfig struct {
	TemplateID   string `json:"templateId"`
	TemplateName string `json:"templateName"`
	PrimaryColor string `json:"primaryColor"`
	FontStyle    string `json:"fontStyle"`
}

// InvitationStats aggregated metrics for dashboard display
type InvitationStats struct {
	Views          int `json:"views"`
	RSVPAttending  int `json:"rsvpAttending"`
	RSVPTotal      int `json:"rsvpTotal"`
	GreetingsCount int `json:"greetingsCount"`
}

// Invitation represents the core wedding invitation entity stored in PostgreSQL
type Invitation struct {
	ID           string    `gorm:"primaryKey;size:64" json:"id"`
	UserID       uuid.UUID `gorm:"type:uuid;index;not null" json:"userId"`
	Slug         string    `gorm:"uniqueIndex;size:128;not null" json:"slug"`
	Title        string    `gorm:"size:255;not null" json:"title"`
	TemplateID   string    `gorm:"size:64;not null" json:"templateId"`
	TemplateName string    `gorm:"size:128" json:"templateName"`
	Status       string    `gorm:"size:32;not null;default:'Draft'" json:"status"` // 'Draft' | 'Published' | 'Live'

	// Aggregated metrics
	Stats InvitationStats `gorm:"serializer:json;type:jsonb" json:"stats"`

	// 15 Modular Tabs stored as PostgreSQL JSONB
	Event         EventData            `gorm:"serializer:json;type:jsonb" json:"event"`
	Media         MediaData            `gorm:"serializer:json;type:jsonb" json:"media"`
	Guests        GuestData            `gorm:"serializer:json;type:jsonb" json:"guests"`
	LoveStory     []LoveStoryMilestone `gorm:"serializer:json;type:jsonb" json:"loveStory"`
	Streaming     StreamingConfig      `gorm:"serializer:json;type:jsonb" json:"streaming"`
	Social        SocialConfig         `gorm:"serializer:json;type:jsonb" json:"social"`
	GuestBook     []GuestBookEntry     `gorm:"serializer:json;type:jsonb" json:"guestBook"`
	GreetingsList []GreetingItem       `gorm:"serializer:json;type:jsonb" json:"greetingsList"`
	Settings      InvitationSettings   `gorm:"serializer:json;type:jsonb" json:"settings"`
	Theme         ThemeConfig          `gorm:"serializer:json;type:jsonb" json:"theme"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Belongs to User
	User *User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"-"`
}

// CreateInvitationRequest payload for creating a new invitation
type CreateInvitationRequest struct {
	GroomNick    string `json:"groomNick" binding:"required"`
	BrideNick    string `json:"brideNick" binding:"required"`
	WeddingDate  string `json:"weddingDate"`
	TemplateID   string `json:"templateId"`
	TemplateName string `json:"templateName"`
}

// UpdateInvitationRequest payload for partial or full updates
type UpdateInvitationRequest struct {
	Title         *string               `json:"title"`
	Slug          *string               `json:"slug"`
	Status        *string               `json:"status"`
	TemplateID    *string               `json:"templateId"`
	TemplateName  *string               `json:"templateName"`
	Stats         *InvitationStats      `json:"stats"`
	Event         *EventData            `json:"event"`
	Media         *MediaData            `json:"media"`
	Guests        *GuestData            `json:"guests"`
	LoveStory     *[]LoveStoryMilestone `json:"loveStory"`
	Streaming     *StreamingConfig      `json:"streaming"`
	Social        *SocialConfig         `json:"social"`
	GuestBook     *[]GuestBookEntry     `json:"guestBook"`
	GreetingsList *[]GreetingItem       `json:"greetingsList"`
	Settings      *InvitationSettings   `json:"settings"`
	Theme         *ThemeConfig          `json:"theme"`
}

// UpdateInvitationStatusRequest payload for updating status
type UpdateInvitationStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=Draft Published Live"`
}

// InvitationRepository defines database operations for invitations
type InvitationRepository interface {
	FindByUserID(userID uuid.UUID) ([]Invitation, error)
	FindByIDAndUserID(id string, userID uuid.UUID) (*Invitation, error)
	FindBySlug(slug string) (*Invitation, error)
	FindByID(id string) (*Invitation, error)
	Create(invitation *Invitation) error
	Update(invitation *Invitation) error
	Delete(id string, userID uuid.UUID) error
	CountByUserID(userID uuid.UUID) (int64, error)
	TotalCount() (int64, error)
}
