package main

import (
	"log"

	"nuptia-backend/internal/config"
	"nuptia-backend/internal/database"
)

func main() {
	log.Println("[Seeder CLI] Memuat konfigurasi...")
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Gagal memuat konfigurasi: %v", err)
	}

	log.Println("[Seeder CLI] Menghubungkan ke PostgreSQL...")
	db, err := database.InitPostgres(cfg)
	if err != nil {
		log.Fatalf("Gagal menghubungkan ke database: %v", err)
	}

	if err := database.SeedDefaultTemplates(db); err != nil {
		log.Fatalf("Gagal melakukan seeding template: %v", err)
	}

	log.Println("[Seeder CLI] Selesai dengan sukses.")
}
