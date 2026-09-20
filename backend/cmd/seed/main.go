package main

import (
	"log"

	"nuptia-backend/internal/config"
	"nuptia-backend/internal/database"
)

func main() {
	log.Println("==================================================")
	log.Println("  Nuptia Database Seeder CLI")
	log.Println("==================================================")

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

	// 1. Seed templates
	log.Println("[Seeder CLI] Memulai seeding data template...")
	if err := database.SeedDefaultTemplates(db); err != nil {
		log.Fatalf("Gagal melakukan seeding template: %v", err)
	}

	// 2. Seed users
	log.Println("[Seeder CLI] Memulai seeding data pengguna...")
	if err := database.SeedDefaultUsers(db); err != nil {
		log.Fatalf("Gagal melakukan seeding users: %v", err)
	}

	log.Println("==================================================")
	log.Println("[Seeder CLI] Selesai dengan sukses!")
	log.Println("")
	log.Println("  Daftar Akun Internal (password: 'password123'):")
	log.Println("  ┌─────────────────────────────────┬───────────┐")
	log.Println("  │ Email                           │ Role      │")
	log.Println("  ├─────────────────────────────────┼───────────┤")
	log.Println("  │ admin@nuptia.id                 │ developer │")
	log.Println("  │ budi.ops@nuptia.id              │ admin     │")
	log.Println("  │ siti.support@nuptia.id          │ viewer    │")
	log.Println("  └─────────────────────────────────┴───────────┘")
	log.Println("")
	log.Println("  Daftar Akun Customer Contoh (password: 'password123'):")
	log.Println("  ┌─────────────────────────────────┬────────────┐")
	log.Println("  │ Email                           │ Status     │")
	log.Println("  ├─────────────────────────────────┼────────────┤")
	log.Println("  │ dimas.aditya@gmail.com          │ aktif      │")
	log.Println("  │ sarah.siti@yahoo.com            │ aktif      │")
	log.Println("  │ rian.pratama@gmail.com          │ aktif      │")
	log.Println("  │ budi.santoso@outlook.com        │ suspended  │")
	log.Println("  │ anisa.rahma@gmail.com           │ aktif      │")
	log.Println("  └─────────────────────────────────┴────────────┘")
	log.Println("==================================================")
}

