package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"nuptia-backend/internal/domain"

	"github.com/google/uuid"
)

type InvitationService interface {
	GetMyInvitations(userID uuid.UUID) ([]domain.Invitation, error)
	GetInvitationByID(id string, userID uuid.UUID) (*domain.Invitation, error)
	GetPublicInvitationBySlug(slug string) (*domain.Invitation, error)
	CreateInvitation(userID uuid.UUID, req domain.CreateInvitationRequest) (*domain.Invitation, error)
	CreateBlankInvitation(userID uuid.UUID) (*domain.Invitation, error)
	UpdateInvitation(id string, userID uuid.UUID, req domain.UpdateInvitationRequest) (*domain.Invitation, error)
	DeleteInvitation(id string, userID uuid.UUID) error
	DuplicateInvitation(id string, userID uuid.UUID) (*domain.Invitation, error)
	UpdateStatus(id string, userID uuid.UUID, status string) (*domain.Invitation, error)
}

type invitationService struct {
	invRepo      domain.InvitationRepository
	templateRepo domain.TemplateRepository
}

// NewInvitationService creates an implementation of InvitationService
func NewInvitationService(
	invRepo domain.InvitationRepository,
	templateRepo domain.TemplateRepository,
) InvitationService {
	return &invitationService{
		invRepo:      invRepo,
		templateRepo: templateRepo,
	}
}

func (s *invitationService) GetMyInvitations(userID uuid.UUID) ([]domain.Invitation, error) {
	return s.invRepo.FindByUserID(userID)
}

func (s *invitationService) GetInvitationByID(id string, userID uuid.UUID) (*domain.Invitation, error) {
	inv, err := s.invRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, err
	}
	if inv == nil {
		return nil, errors.New("undangan tidak ditemukan atau Anda tidak memiliki akses")
	}
	return inv, nil
}

func (s *invitationService) GetPublicInvitationBySlug(slug string) (*domain.Invitation, error) {
	inv, err := s.invRepo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}
	if inv == nil {
		return nil, errors.New("undangan tidak ditemukan")
	}
	return inv, nil
}

func (s *invitationService) CreateInvitation(userID uuid.UUID, req domain.CreateInvitationRequest) (*domain.Invitation, error) {
	groomNick := strings.TrimSpace(req.GroomNick)
	brideNick := strings.TrimSpace(req.BrideNick)
	if groomNick == "" || brideNick == "" {
		return nil, errors.New("nama panggilan mempelai pria dan wanita wajib diisi")
	}

	baseSlug := slugify(fmt.Sprintf("%s-dan-%s", groomNick, brideNick))
	uniqueSlug := s.generateUniqueSlug(baseSlug)

	// Resolve template
	templateID := "peach-blossom"
	templateName := "Blush & Peach Blossom"
	primaryColor := "#FF7E67"
	fontStyle := "Nunito & Inter"
	thumbnailURL := "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format"

	if req.TemplateID != "" {
		t, err := s.templateRepo.FindByIDOrSlug(req.TemplateID)
		if err == nil && t != nil {
			templateID = t.ID
			templateName = t.Name
			thumbnailURL = t.ThumbnailURL
		} else if req.TemplateName != "" {
			templateID = req.TemplateID
			templateName = req.TemplateName
		}
	}

	weddingDate := req.WeddingDate
	if weddingDate == "" {
		weddingDate = time.Now().AddDate(0, 2, 0).Format("2006-01-02")
	}

	id := generateRandomID("inv")
	now := time.Now().UTC()

	invitation := &domain.Invitation{
		ID:           id,
		UserID:       userID,
		Slug:         uniqueSlug,
		Title:        fmt.Sprintf("%s & %s", groomNick, brideNick),
		TemplateID:   templateID,
		TemplateName: templateName,
		Status:       "Draft",
		Stats: domain.InvitationStats{
			Views:          0,
			RSVPAttending:  0,
			RSVPTotal:      0,
			GreetingsCount: 0,
		},
		Event: domain.EventData{
			GroomNick:    groomNick,
			BrideNick:    brideNick,
			GroomFull:    fmt.Sprintf("%s Pratama", groomNick),
			BrideFull:    fmt.Sprintf("%s Putri", brideNick),
			GroomParents: "Bpk. & Ibu Mempelai Pria",
			BrideParents: "Bpk. & Ibu Mempelai Wanita",
			AkadDate:     weddingDate,
			AkadTime:     "08:00",
			ResepsiDate:  weddingDate,
			ResepsiTime:  "11:00",
			Venue:        "Nama Gedung / Tempat Acara",
			Address:      "Alamat lengkap tempat pelaksanaan pernikahan",
			MapsURL:      "https://maps.google.com",
			Quote:        "\"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...\" (QS. Ar-Rum: 21)",
			Blessing:     "Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.",
		},
		Media: domain.MediaData{
			HeroURL:      thumbnailURL,
			Gallery:      []domain.GalleryItem{},
			VideoURL:     "",
			MusicTitle:   "A Thousand Years – Christina Perri",
			MusicPlaying: false,
			Autoplay:     true,
		},
		Guests: domain.GuestData{
			RSVPEnabled:      true,
			GreetingsEnabled: true,
			BankName:         "Bank Central Asia (BCA)",
			AccountNo:        "",
			AccountHolder:    groomNick,
			EwalletType:      "GoPay",
			EwalletNo:        "",
			EwalletName:      groomNick,
		},
		LoveStory:     []domain.LoveStoryMilestone{},
		Streaming:     domain.StreamingConfig{Enabled: false, Platform: "youtube"},
		Social:        domain.SocialConfig{Hashtag: fmt.Sprintf("#%s%sMenikah", groomNick, brideNick)},
		GuestBook:     []domain.GuestBookEntry{},
		GreetingsList: []domain.GreetingItem{},
		Settings: domain.InvitationSettings{
			CustomSlug:        uniqueSlug,
			IsPrivate:         false,
			SearchEngineIndex: true,
			MusicAutoplay:     true,
		},
		Theme: domain.ThemeConfig{
			TemplateID:   templateID,
			TemplateName: templateName,
			PrimaryColor: primaryColor,
			FontStyle:    fontStyle,
		},
		CreatedAt: now,
		UpdatedAt: now,
	}

	if err := s.invRepo.Create(invitation); err != nil {
		return nil, fmt.Errorf("gagal menyimpan undangan ke database: %w", err)
	}

	return invitation, nil
}

func (s *invitationService) CreateBlankInvitation(userID uuid.UUID) (*domain.Invitation, error) {
	req := domain.CreateInvitationRequest{
		GroomNick:    "Pria",
		BrideNick:    "Wanita",
		WeddingDate:  time.Now().AddDate(0, 3, 0).Format("2006-01-02"),
		TemplateID:   "wedding-rustic",
		TemplateName: "Rustic Warm Taupe",
	}
	return s.CreateInvitation(userID, req)
}

func (s *invitationService) UpdateInvitation(id string, userID uuid.UUID, req domain.UpdateInvitationRequest) (*domain.Invitation, error) {
	inv, err := s.invRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, err
	}
	if inv == nil {
		return nil, errors.New("undangan tidak ditemukan atau Anda tidak memiliki akses")
	}

	if req.Title != nil && *req.Title != "" {
		inv.Title = *req.Title
	}
	if req.Slug != nil && *req.Slug != "" && *req.Slug != inv.Slug {
		clean := slugify(*req.Slug)
		// Check uniqueness
		existing, _ := s.invRepo.FindBySlug(clean)
		if existing != nil && existing.ID != inv.ID {
			return nil, fmt.Errorf("slug '%s' sudah digunakan oleh undangan lain", clean)
		}
		inv.Slug = clean
		inv.Settings.CustomSlug = clean
	}
	if req.Status != nil && *req.Status != "" {
		inv.Status = *req.Status
	}
	if req.TemplateID != nil && *req.TemplateID != "" {
		inv.TemplateID = *req.TemplateID
	}
	if req.TemplateName != nil && *req.TemplateName != "" {
		inv.TemplateName = *req.TemplateName
	}
	if req.Stats != nil {
		inv.Stats = *req.Stats
	}
	if req.Event != nil {
		inv.Event = *req.Event
	}
	if req.Media != nil {
		inv.Media = *req.Media
	}
	if req.Guests != nil {
		inv.Guests = *req.Guests
	}
	if req.LoveStory != nil {
		inv.LoveStory = *req.LoveStory
	}
	if req.Streaming != nil {
		inv.Streaming = *req.Streaming
	}
	if req.Social != nil {
		inv.Social = *req.Social
	}
	if req.GuestBook != nil {
		inv.GuestBook = *req.GuestBook
	}
	if req.GreetingsList != nil {
		inv.GreetingsList = *req.GreetingsList
	}
	if req.Settings != nil {
		inv.Settings = *req.Settings
	}
	if req.Theme != nil {
		inv.Theme = *req.Theme
	}

	inv.UpdatedAt = time.Now().UTC()

	if err := s.invRepo.Update(inv); err != nil {
		return nil, fmt.Errorf("gagal memperbarui undangan: %w", err)
	}

	return inv, nil
}

func (s *invitationService) DeleteInvitation(id string, userID uuid.UUID) error {
	return s.invRepo.Delete(id, userID)
}

func (s *invitationService) DuplicateInvitation(id string, userID uuid.UUID) (*domain.Invitation, error) {
	orig, err := s.invRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, err
	}
	if orig == nil {
		return nil, errors.New("undangan yang akan diduplikasi tidak ditemukan")
	}

	newID := generateRandomID("inv")
	newSlug := s.generateUniqueSlug(fmt.Sprintf("%s-copy", orig.Slug))
	now := time.Now().UTC()

	duplicate := &domain.Invitation{
		ID:           newID,
		UserID:       userID,
		Slug:         newSlug,
		Title:        fmt.Sprintf("%s (Salinan)", orig.Title),
		TemplateID:   orig.TemplateID,
		TemplateName: orig.TemplateName,
		Status:       "Draft",
		Stats: domain.InvitationStats{
			Views:          0,
			RSVPAttending:  0,
			RSVPTotal:      0,
			GreetingsCount: 0,
		},
		Event:         orig.Event,
		Media:         orig.Media,
		Guests:        orig.Guests,
		LoveStory:     orig.LoveStory,
		Streaming:     orig.Streaming,
		Social:        orig.Social,
		GuestBook:     orig.GuestBook,
		GreetingsList: orig.GreetingsList,
		Settings:      orig.Settings,
		Theme:         orig.Theme,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
	duplicate.Settings.CustomSlug = newSlug

	if err := s.invRepo.Create(duplicate); err != nil {
		return nil, fmt.Errorf("gagal menduplikasi undangan: %w", err)
	}

	return duplicate, nil
}

func (s *invitationService) UpdateStatus(id string, userID uuid.UUID, status string) (*domain.Invitation, error) {
	inv, err := s.invRepo.FindByIDAndUserID(id, userID)
	if err != nil {
		return nil, err
	}
	if inv == nil {
		return nil, errors.New("undangan tidak ditemukan atau Anda tidak memiliki akses")
	}

	validStatuses := map[string]bool{
		"Draft":     true,
		"Published": true,
		"Live":      true,
	}
	if !validStatuses[status] {
		return nil, fmt.Errorf("status '%s' tidak valid (harus Draft, Published, atau Live)", status)
	}

	inv.Status = status
	inv.UpdatedAt = time.Now().UTC()

	if err := s.invRepo.Update(inv); err != nil {
		return nil, fmt.Errorf("gagal memperbarui status: %w", err)
	}

	return inv, nil
}

// Helper functions
func slugify(text string) string {
	s := strings.ToLower(text)
	reg := regexp.MustCompile("[^a-z0-9]+")
	s = reg.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

func (s *invitationService) generateUniqueSlug(base string) string {
	clean := slugify(base)
	if clean == "" {
		clean = "undangan"
	}
	slug := clean
	counter := 1

	for {
		existing, _ := s.invRepo.FindBySlug(slug)
		if existing == nil {
			return slug
		}
		counter++
		slug = fmt.Sprintf("%s-%d", clean, counter)
	}
}

func generateRandomID(prefix string) string {
	b := make([]byte, 4)
	_, _ = rand.Read(b)
	timestamp := time.Now().UnixNano() / 1e6
	return fmt.Sprintf("%s-%x-%s", prefix, timestamp, hex.EncodeToString(b))
}
