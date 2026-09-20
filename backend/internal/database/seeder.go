package database

import (
	"log"

	"nuptia-backend/internal/domain"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

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
