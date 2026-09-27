package database

import (
	"fmt"
	"log"
	"strings"
	"time"

	"nuptia-backend/internal/domain"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// SeedDefaultUsers seeds internal staff and sample customer accounts idempotently.
// It checks per-email so it is safe to run multiple times without duplicating data.
func SeedDefaultUsers(db *gorm.DB) error {
	defaultPassword := "password123"
	hash, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("gagal mengenkripsi kata sandi default: %w", err)
	}
	hashedPassword := string(hash)

	type seedUser struct {
		Name     string
		Email    string
		Role     string
		IsActive bool
	}

	users := []seedUser{
		// --- Tim Internal ---
		{Name: "Super Admin Nuptia", Email: "admin@nuptia.id", Role: "developer", IsActive: true},
		{Name: "Budi Kurniawan", Email: "budi.ops@nuptia.id", Role: "admin", IsActive: true},
		{Name: "Siti Rahayu", Email: "siti.support@nuptia.id", Role: "viewer", IsActive: true},
		// --- Customer Contoh ---
		{Name: "Dimas Aditya", Email: "dimas.aditya@gmail.com", Role: "customer", IsActive: true},
		{Name: "Siti Sarah", Email: "sarah.siti@yahoo.com", Role: "customer", IsActive: true},
		{Name: "Rian Pratama", Email: "rian.pratama@gmail.com", Role: "customer", IsActive: true},
		{Name: "Budi Santoso", Email: "budi.santoso@outlook.com", Role: "customer", IsActive: false}, // suspended
		{Name: "Anisa Rahma", Email: "anisa.rahma@gmail.com", Role: "customer", IsActive: true},
	}

	seeded := 0
	skipped := 0
	for _, u := range users {
		email := strings.ToLower(strings.TrimSpace(u.Email))

		// Idempotency check: skip if email already exists
		var existing domain.User
		if err := db.Where("LOWER(email) = ?", email).First(&existing).Error; err == nil {
			skipped++
			continue
		}

		newUser := domain.User{
			ID:           uuid.New(),
			Name:         u.Name,
			Email:        email,
			PasswordHash: hashedPassword,
			AuthProvider: "email",
			Role:         u.Role,
			IsActive:     u.IsActive,
		}
		if err := db.Create(&newUser).Error; err != nil {
			return fmt.Errorf("gagal membuat user %s: %w", email, err)
		}
		seeded++
	}

	log.Printf("[Seeder] Users: %d akun baru ditambahkan, %d sudah ada (dilewati).\n", seeded, skipped)
	if seeded > 0 {
		log.Println("[Seeder] Kredensial default semua akun seeder: password = 'password123'")
	}
	return nil
}

func SeedDefaultTemplates(db *gorm.DB) error {
	var count int64
	db.Model(&domain.Template{}).Count(&count)
	if count > 0 {
		log.Printf("[Seeder] Tabel templates sudah memiliki %d data. Lewati initial seeding.\n", count)
		return nil
	}

	templates := []domain.Template{
		{
			ID:           "wedding-rustic",
			Slug:         "wedding-rustic",
			Name:         "Rustic Warm Taupe",
			Tagline:      "Romantic & Warm Taupe",
			Description:  "Tema nuansa krem hangat, taupe, dan aksen emas dengan gatekeeper kelopak bunga, countdown timer, dan amplop digital.",
			Category:     "rustic",
			Tier:         "free",
			ThumbnailURL: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format",
			PreviewURL:   "/templates/wedding-rustic",
			Rating:       5.0,
			IsActive:     true,
			IsPopular:    true,
			IsNew:        false,
			SortOrder:    1,
			SupportedFeatures: domain.JSONStringList{
				"countdown", "rsvp", "guestbook", "gift", "music", "story", "quote",
			},
			DefaultConfig: domain.JSONRaw(`{"primaryColor":"#A3158A","secondaryColor":"#FAF4EC","font":"Lora & Inter","accentColors":["#FAF4EC","#8C7E74","#D4AF37"]}`),
		},
		{
			ID:           "peach-blossom",
			Slug:         "peach-blossom",
			Name:         "Blush & Peach Blossom",
			Tagline:      "Ceria & Manis",
			Description:  "Desain ceria penuh keceriaan dengan dominasi warna peach lembut dan floral kontemporer.",
			Category:     "cheerful",
			Tier:         "free",
			ThumbnailURL: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format",
			PreviewURL:   "/preview/peach-blossom",
			Rating:       4.9,
			IsActive:     true,
			IsPopular:    true,
			IsNew:        false,
			SortOrder:    2,
			SupportedFeatures: domain.JSONStringList{
				"countdown", "rsvp", "gift", "music", "story", "quote", "gallery",
			},
			DefaultConfig: domain.JSONRaw(`{"primaryColor":"#FF7E67","font":"Nunito & Inter","accentColors":["#FF7E67","#FFE5E0","#FFFFFF"]}`),
		},
		{
			ID:           "sunshine-meadow",
			Slug:         "sunshine-meadow",
			Name:         "Sunshine Meadow",
			Tagline:      "Cerah & Santai",
			Description:  "Kombinasi kuning keemasan hangat dan tipografi klasik untuk resepsi semi-outdoor dan pesta kebun.",
			Category:     "modern",
			Tier:         "premium",
			ThumbnailURL: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop&auto=format",
			PreviewURL:   "/preview/sunshine-meadow",
			Rating:       4.8,
			IsActive:     true,
			IsPopular:    false,
			IsNew:        true,
			SortOrder:    3,
			SupportedFeatures: domain.JSONStringList{
				"countdown", "rsvp", "guestbook", "gift", "music", "streaming",
			},
			DefaultConfig: domain.JSONRaw(`{"primaryColor":"#F59E0B","font":"Playfair & Inter","accentColors":["#F59E0B","#FEF3C7","#78350F"]}`),
		},
		{
			ID:           "seraphina-ivory",
			Slug:         "seraphina-ivory",
			Name:         "Seraphina Ivory",
			Tagline:      "Minimalis & Elegan",
			Description:  "Gaya editorial modern berlatar ivory netral dengan tipografi berkelas dan sentuhan kontemporer.",
			Category:     "minimalis",
			Tier:         "premium",
			ThumbnailURL: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop&auto=format",
			PreviewURL:   "/preview/seraphina-ivory",
			Rating:       5.0,
			IsActive:     true,
			IsPopular:    true,
			IsNew:        false,
			SortOrder:    4,
			SupportedFeatures: domain.JSONStringList{
				"countdown", "rsvp", "guestbook", "gift", "story", "quote",
			},
			DefaultConfig: domain.JSONRaw(`{"primaryColor":"#8C7E74","font":"Cormorant & Inter","accentColors":["#8C7E74","#F5F5F0","#2C2A29"]}`),
		},
		{
			ID:           "verdant-garden",
			Slug:         "verdant-garden",
			Name:         "Verdant Garden",
			Tagline:      "Floral Sage Romantis",
			Description:  "Nuansa hijau sage yang menenangkan berpadu ilustrasi botani dedaunan dan nuansa alam.",
			Category:     "floral",
			Tier:         "free",
			ThumbnailURL: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=400&fit=crop&auto=format",
			PreviewURL:   "/preview/verdant-garden",
			Rating:       4.9,
			IsActive:     true,
			IsPopular:    false,
			IsNew:        false,
			SortOrder:    5,
			SupportedFeatures: domain.JSONStringList{
				"countdown", "rsvp", "guestbook", "gift", "music", "gallery",
			},
			DefaultConfig: domain.JSONRaw(`{"primaryColor":"#5A735D","font":"Lora & Inter","accentColors":["#5A735D","#E8EFE9","#2D3E30"]}`),
		},
		{
			ID:           "adat-jawa-heritage",
			Slug:         "adat-jawa-heritage",
			Name:         "Adat Jawa Klasik (Heritage)",
			Tagline:      "Tradisional & Sakral",
			Description:  "Nuansa cokelat batik sogan, ornamen gunungan wayang, dan aksen emas megah untuk pernikahan adat Jawa yang agung.",
			Category:     "adat",
			Tier:         "exclusive",
			ThumbnailURL: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop&auto=format",
			PreviewURL:   "/preview/adat-jawa-heritage",
			Rating:       4.9,
			IsActive:     true,
			IsPopular:    true,
			IsNew:        false,
			SortOrder:    6,
			SupportedFeatures: domain.JSONStringList{
				"countdown", "rsvp", "guestbook", "gift", "music", "story", "quote",
			},
			DefaultConfig: domain.JSONRaw(`{"primaryColor":"#854D0E","font":"Playfair & Inter","accentColors":["#854D0E","#FEF3C7","#451A03"]}`),
		},
	}

	log.Printf("[Seeder] Menyimpan %d data template awal ke database...\n", len(templates))
	for _, t := range templates {
		if err := db.Clauses(clause.OnConflict{DoNothing: true}).Create(&t).Error; err != nil {
			return err
		}
	}

	log.Println("[Seeder] Berhasil memasukkan data template awal ke PostgreSQL!")
	return nil
}

// SeedDefaultInvitations seeds sample wedding invitations linked to customer accounts
func SeedDefaultInvitations(db *gorm.DB) error {
	var count int64
	db.Model(&domain.Invitation{}).Count(&count)
	if count > 0 {
		log.Printf("[Seeder] Tabel invitations sudah memiliki %d data. Lewati initial seeding.\n", count)
		return nil
	}

	// Ensure users are present
	var dimas, sarah domain.User
	if err := db.Where("LOWER(email) = ?", "dimas.aditya@gmail.com").First(&dimas).Error; err != nil {
		log.Println("[Seeder Warning] User dimas.aditya@gmail.com belum ada, menjalankan SeedDefaultUsers...")
		if err := SeedDefaultUsers(db); err != nil {
			return err
		}
		_ = db.Where("LOWER(email) = ?", "dimas.aditya@gmail.com").First(&dimas)
	}
	_ = db.Where("LOWER(email) = ?", "sarah.siti@yahoo.com").First(&sarah)

	// Fallback user ID if user query fails
	dimasID := dimas.ID
	if dimasID == uuid.Nil {
		dimasID = uuid.New()
	}
	sarahID := sarah.ID
	if sarahID == uuid.Nil {
		sarahID = dimasID
	}

	now := time.Now().UTC()
	invitations := []domain.Invitation{
		// 1. Reza & Hana (Live)
		{
			ID:           "inv-reza-hana",
			UserID:       dimasID,
			Slug:         "reza-dan-hana",
			Title:        "Reza & Hana",
			TemplateID:   "peach-blossom",
			TemplateName: "Blush & Peach Blossom",
			Status:       "Live",
			Stats: domain.InvitationStats{
				Views:          1420,
				RSVPAttending:  148,
				RSVPTotal:      172,
				GreetingsCount: 89,
			},
			Event: domain.EventData{
				GroomNick:      "Reza",
				BrideNick:      "Hana",
				GroomFull:      "Muhammad Reza Pratama, S.T.",
				BrideFull:      "Hana Nur Afifah, S.Pd.",
				GroomParents:   "Bpk. H. Agus Salim & Ibu Hj. Siti Aminah",
				BrideParents:   "Bpk. Ir. Dede Supriatna & Ibu Dr. Ratna Dewi",
				GroomPhoto:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
				BridePhoto:     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
				GroomInstagram: "rezapratama",
				BrideInstagram: "hananurafifah",
				GroomBio:       "Putra pertama yang berdedikasi dan pencinta kopi.",
				BrideBio:       "Putri bungsu yang ceria dan guru berhati lembut.",
				AkadDate:       "2026-11-15",
				AkadTime:       "08:00",
				ResepsiDate:    "2026-11-15",
				ResepsiTime:    "11:00",
				Venue:          "Ballroom Grand Mercure Jakarta",
				Address:        "Jl. Hayam Wuruk No. 123, Jakarta Pusat 10120",
				MapsURL:        "https://maps.google.com",
				Quote:          "\"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...\" (QS. Ar-Rum: 21)",
				Blessing:       "Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.",
				Sessions: []domain.EventSession{
					{
						ID:       "ses-1",
						Name:     "Akad Nikah",
						Date:     "2026-11-15",
						Time:     "08:00",
						EndTime:  "10:00",
						Timezone: "WIB",
						Venue:    "Masjid Grand Mercure",
						Address:  "Lt. 2 Grand Mercure Jakarta",
						MapsURL:  "https://maps.google.com",
					},
					{
						ID:       "ses-2",
						Name:     "Resepsi Pernikahan",
						Date:     "2026-11-15",
						Time:     "11:00",
						EndTime:  "14:00",
						Timezone: "WIB",
						Venue:    "Grand Ballroom Mercure",
						Address:  "Lt. 3 Grand Mercure Jakarta",
						MapsURL:  "https://maps.google.com",
					},
				},
			},
			Media: domain.MediaData{
				HeroURL: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop&auto=format",
				Gallery: []domain.GalleryItem{
					{ID: "1", URL: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=400&h=400&fit=crop", Caption: "Foto Pre-Wedding", Loading: false},
					{ID: "2", URL: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&h=400&fit=crop", Caption: "Karangan Bunga Romantis", Loading: false},
					{ID: "3", URL: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=400&fit=crop", Caption: "Dekorasi Venue Elegan", Loading: false},
					{ID: "4", URL: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=400&fit=crop", Caption: "Cincin Pernikahan", Loading: false},
				},
				VideoURL:     "https://youtu.be/dQw4w9WgXcQ",
				MusicTitle:   "A Thousand Years – Christina Perri",
				MusicPlaying: false,
				MusicURL:     "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-piano-112191.mp3",
				Autoplay:     true,
			},
			Guests: domain.GuestData{
				RSVPEnabled:      true,
				GreetingsEnabled: true,
				BankName:         "Bank Central Asia (BCA)",
				AccountNo:        "1234 5678 90",
				AccountHolder:    "Muhammad Reza Pratama",
				EwalletType:      "GoPay",
				EwalletNo:        "0812 3456 7890",
				EwalletName:      "Reza Pratama",
				QRISURL:          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=300&fit=crop",
				PhysicalGiftEnabled: true,
				PhysicalGiftAddress: &domain.PhysicalGiftAddress{
					RecipientName: "Reza & Hana (Rumah Orang Tua Hana)",
					Phone:         "0812-3456-7890",
					Address:       "Jl. Melati No. 45, RT 02/RW 05, Cilandak",
					City:          "Jakarta Selatan",
					PostalCode:    "12430",
				},
			},
			LoveStory: []domain.LoveStoryMilestone{
				{
					ID:       "ls-1",
					Year:     "2020",
					Date:     "14 Februari 2020",
					Title:    "Pertemuan Pertama",
					Story:    "Bertemu di perpustakaan kampus saat sama-sama sedang menyelesaikan tugas akhir.",
					ImageURL: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop",
				},
				{
					ID:       "ls-2",
					Year:     "2022",
					Date:     "20 Oktober 2022",
					Title:    "Komitmen Berdua",
					Story:    "Setelah dua tahun saling mengenal dan menguatkan, kami memutuskan untuk berkomitmen serius.",
					ImageURL: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&h=300&fit=crop",
				},
				{
					ID:       "ls-3",
					Year:     "2024",
					Date:     "10 November 2024",
					Title:    "Hari Lamaran",
					Story:    "Keluarga besar bertemu dalam suasana hangat dan penuh doa restu untuk meresmikan langkah kami.",
					ImageURL: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=400&h=300&fit=crop",
				},
			},
			Streaming: domain.StreamingConfig{
				Enabled:      true,
				Platform:     "youtube",
				URL:          "https://youtube.com/live/demo-stream",
				ScheduleDate: "2026-11-15",
				ScheduleTime: "08:00 WIB",
				Notes:        "Bagi keluarga dan sahabat yang berhalangan hadir secara langsung, silakan ikuti prosesi akad nikah secara live streaming.",
			},
			Social: domain.SocialConfig{
				IGFilterURL: "https://instagram.com/ar/reza-hana-filter",
				Hashtag:     "#RezaHanaMenikah",
				IGGroom:     "@rezapratama",
				IGBride:     "@hananurafifah",
			},
			GuestBook: []domain.GuestBookEntry{
				{ID: "gb-1", Name: "Bpk. Ir. Joko Widodo & Ibu", Category: "VIP", Pax: 2, Status: "Hadir", CheckedIn: true},
				{ID: "gb-2", Name: "Dimas Aditya Nugraha", Category: "Teman", Pax: 1, Status: "Hadir", CheckedIn: false},
				{ID: "gb-3", Name: "Sarah Almira & Partner", Category: "Keluarga", Pax: 2, Status: "Hadir", CheckedIn: false},
				{ID: "gb-4", Name: "Rina Kartika", Category: "Rekan Kerja", Pax: 1, Status: "Belum Konfirmasi", CheckedIn: false},
			},
			GreetingsList: []domain.GreetingItem{
				{
					ID:           "gr-1",
					Name:         "Dimas Aditya",
					Relationship: "Sahabat Kuliah",
					Message:      "Selamat menempuh hidup baru Reza & Hana! Semoga menjadi keluarga sakinah mawaddah warahmah.",
					CreatedAt:    "2 jam yang lalu",
					IsPinned:     true,
				},
				{
					ID:           "gr-2",
					Name:         "Tante Rina & Om Ferry",
					Relationship: "Keluarga Besar",
					Message:      "Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Bahagia selalu ya!",
					CreatedAt:    "4 jam yang lalu",
					IsPinned:     false,
				},
			},
			Settings: domain.InvitationSettings{
				CustomSlug:        "reza-dan-hana",
				IsPrivate:         false,
				Password:          "",
				SearchEngineIndex: true,
				MusicAutoplay:     true,
			},
			Theme: domain.ThemeConfig{
				TemplateID:   "peach-blossom",
				TemplateName: "Blush & Peach Blossom",
				PrimaryColor: "#FF7E67",
				FontStyle:    "Nunito & Inter",
			},
			CreatedAt: now.Add(-30 * 24 * time.Hour),
			UpdatedAt: now.Add(-2 * time.Hour),
		},

		// 2. Dimas & Riana (Published)
		{
			ID:           "inv-dimas-riana",
			UserID:       dimasID,
			Slug:         "dimas-dan-riana",
			Title:        "Dimas & Riana",
			TemplateID:   "sunshine-meadow",
			TemplateName: "Sunshine Meadow",
			Status:       "Published",
			Stats: domain.InvitationStats{
				Views:          740,
				RSVPAttending:  82,
				RSVPTotal:      96,
				GreetingsCount: 42,
			},
			Event: domain.EventData{
				GroomNick:    "Dimas",
				BrideNick:    "Riana",
				GroomFull:    "Dimas Aditya Nugraha, S.Kom.",
				BrideFull:    "Riana Kartika Putri, B.A.",
				GroomParents: "Bpk. Bambang Soediro & Ibu Sri Wahyuni",
				BrideParents: "Bpk. Hendro Kusumo & Ibu Maria Ulfah",
				AkadDate:     "2026-12-20",
				AkadTime:     "09:00",
				ResepsiDate:  "2026-12-20",
				ResepsiTime:  "13:00",
				Venue:        "Gedung Dhanapala Kemenkeu",
				Address:      "Jl. Senen Raya No. 1, Jakarta Pusat",
				MapsURL:      "https://maps.google.com",
				Quote:        "\"Mencintai seseorang dan dicintai olehnya adalah hal paling berharga di dunia.\"",
				Blessing:     "Merupakan kehormatan bagi kami atas kehadiran dan doa restu Bapak/Ibu.",
			},
			Media: domain.MediaData{
				HeroURL: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&fit=crop&auto=format",
				Gallery: []domain.GalleryItem{
					{ID: "1", URL: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop", Caption: "Kebersamaan Kami", Loading: false},
					{ID: "2", URL: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&h=400&fit=crop", Caption: "Detail Bunga", Loading: false},
				},
				VideoURL:     "",
				MusicTitle:   "Until I Found You – Stephen Sanchez",
				MusicPlaying: false,
				Autoplay:     true,
			},
			Guests: domain.GuestData{
				RSVPEnabled:         true,
				GreetingsEnabled:    true,
				BankName:            "Bank Mandiri",
				AccountNo:           "1400 0192 8374",
				AccountHolder:       "Dimas Aditya Nugraha",
				EwalletType:         "OVO",
				EwalletNo:           "0813 9876 5432",
				EwalletName:         "Riana Putri",
				PhysicalGiftEnabled: false,
			},
			LoveStory: []domain.LoveStoryMilestone{},
			Streaming: domain.StreamingConfig{
				Enabled:  false,
				Platform: "youtube",
			},
			Social: domain.SocialConfig{
				Hashtag: "#DimasRianaDay",
				IGGroom: "@dimasnugraha",
				IGBride: "@rianaputri",
			},
			GuestBook:     []domain.GuestBookEntry{},
			GreetingsList: []domain.GreetingItem{},
			Settings: domain.InvitationSettings{
				CustomSlug:        "dimas-dan-riana",
				IsPrivate:         false,
				SearchEngineIndex: true,
				MusicAutoplay:     true,
			},
			Theme: domain.ThemeConfig{
				TemplateID:   "sunshine-meadow",
				TemplateName: "Sunshine Meadow",
				PrimaryColor: "#F59E0B",
				FontStyle:    "Playfair & Inter",
			},
			CreatedAt: now.Add(-15 * 24 * time.Hour),
			UpdatedAt: now.Add(-1 * 24 * time.Hour),
		},

		// 3. Arya & Sarah (Draft)
		{
			ID:           "inv-arya-sarah",
			UserID:       sarahID,
			Slug:         "arya-dan-sarah",
			Title:        "Arya & Sarah",
			TemplateID:   "seraphina-ivory",
			TemplateName: "Seraphina Ivory",
			Status:       "Draft",
			Stats: domain.InvitationStats{
				Views:          0,
				RSVPAttending:  0,
				RSVPTotal:      0,
				GreetingsCount: 0,
			},
			Event: domain.EventData{
				GroomNick:    "Arya",
				BrideNick:    "Sarah",
				GroomFull:    "Arya Wardhana, S.E.",
				BrideFull:    "Sarah Almira, M.M.",
				GroomParents: "Bpk. Ir. Gunawan & Ibu Endang",
				BrideParents: "Bpk. Dr. Faisal & Ibu Nurhayati",
				AkadDate:     "2027-02-14",
				AkadTime:     "08:30",
				ResepsiDate:  "2027-02-14",
				ResepsiTime:  "18:30",
				Venue:        "Hutan Kota by Plataran",
				Address:      "Gelora Bung Karno, Senayan, Jakarta",
				MapsURL:      "https://maps.google.com",
				Quote:        "\"Dan Kami jadikan kamu berpasang-pasangan.\"",
				Blessing:     "Doa restu Anda adalah kado terindah bagi kami.",
			},
			Media: domain.MediaData{
				HeroURL:      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=500&fit=crop&auto=format",
				Gallery:      []domain.GalleryItem{},
				MusicTitle:   "Perfect – Ed Sheeran",
				MusicPlaying: false,
				Autoplay:     false,
			},
			Guests: domain.GuestData{
				RSVPEnabled:      false,
				GreetingsEnabled: true,
				BankName:         "Bank Central Asia (BCA)",
			},
			LoveStory: []domain.LoveStoryMilestone{},
			Streaming: domain.StreamingConfig{
				Enabled:  false,
				Platform: "zoom",
			},
			Social: domain.SocialConfig{
				Hashtag: "#AryaSarahStory",
				IGGroom: "@aryawardhana",
				IGBride: "@sarahalmira",
			},
			GuestBook:     []domain.GuestBookEntry{},
			GreetingsList: []domain.GreetingItem{},
			Settings: domain.InvitationSettings{
				CustomSlug: "arya-dan-sarah",
				IsPrivate:  true,
				Password:   "nuptiawedding",
			},
			Theme: domain.ThemeConfig{
				TemplateID:   "seraphina-ivory",
				TemplateName: "Seraphina Ivory",
				PrimaryColor: "#8C7E74",
				FontStyle:    "Cormorant & Inter",
			},
			CreatedAt: now.Add(-5 * 24 * time.Hour),
			UpdatedAt: now.Add(-5 * 24 * time.Hour),
		},
	}

	log.Printf("[Seeder] Menyimpan %d data undangan awal ke database...\n", len(invitations))
	for _, inv := range invitations {
		if err := db.Clauses(clause.OnConflict{DoNothing: true}).Create(&inv).Error; err != nil {
			return fmt.Errorf("gagal membuat undangan %s: %w", inv.Slug, err)
		}
	}

	log.Println("[Seeder] Berhasil memasukkan data undangan awal ke PostgreSQL!")
	return nil
}

