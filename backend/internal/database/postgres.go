package database

import (
	"log"
	"time"

	"nuptia-backend/internal/config"
	"nuptia-backend/internal/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitPostgres(cfg *config.Config) (*gorm.DB, error) {
	logLevel := logger.Warn
	if cfg.GinMode == "debug" {
		logLevel = logger.Info
	}

	db, err := gorm.Open(postgres.Open(cfg.DSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	// Connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(50)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Run AutoMigrate for Template and User
	log.Println("[Database] Menjalankan AutoMigrate untuk tabel templates dan users...")
	if err := db.AutoMigrate(&domain.Template{}, &domain.User{}); err != nil {
		return nil, err
	}
	log.Println("[Database] Migrasi tabel templates dan users sukses!")

	return db, nil
}
