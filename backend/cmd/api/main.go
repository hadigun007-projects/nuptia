package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"nuptia-backend/internal/config"
	"nuptia-backend/internal/database"
	"nuptia-backend/internal/handler"
	"nuptia-backend/internal/middleware"
	"nuptia-backend/internal/repository"
	"nuptia-backend/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("==================================================")
	log.Println("  Nuptia Backend REST API Service (Go + Gin)")
	log.Println("==================================================")

	// 1. Load Configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("[Config] Gagal memuat konfigurasi: %v", err)
	}

	if cfg.GinMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 2. Connect Database & Auto-Migrate
	db, err := database.InitPostgres(cfg)
	if err != nil {
		log.Fatalf("[Database] Gagal menghubungkan ke PostgreSQL: %v", err)
	}

	// 3. Auto-seed if database is empty
	if err := database.SeedDefaultTemplates(db); err != nil {
		log.Printf("[Database Warning] Gagal auto-seed template: %v", err)
	}
	if err := database.SeedDefaultUsers(db); err != nil {
		log.Printf("[Database Warning] Gagal auto-seed users: %v", err)
	}

	// 4. Initialize Dependency Injection Layers
	templateRepo := repository.NewTemplateRepository(db)
	templateService := service.NewTemplateService(templateRepo)
	templateHandler := handler.NewTemplateHandler(templateService)

	userRepo := repository.NewUserRepository(db)
	resetRepo := repository.NewPasswordResetRepository(db)
	emailSvc := service.NewEmailService(cfg)
	authService := service.NewAuthService(userRepo, resetRepo, emailSvc, cfg)
	authHandler := handler.NewAuthHandler(authService)

	adminHandler := handler.NewAdminHandler(userRepo, templateRepo)

	// 5. Setup Gin Router
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware(cfg.AllowedOrigins))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"service":   "nuptia-backend",
			"timestamp": time.Now().UTC(),
		})
	})

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		templateHandler.RegisterRoutes(v1)
	}

	// Protected API v1 group with JWT Auth Middleware
	v1Protected := v1.Group("")
	v1Protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))

	authHandler.RegisterRoutes(v1, v1Protected)

	// Admin API v1 group with JWT Auth & RBAC Middleware
	v1Admin := v1.Group("/admin")
	v1Admin.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	v1Admin.Use(middleware.RequireRole("admin", "developer", "viewer"))
	adminHandler.RegisterRoutes(v1Admin)


	// 6. Graceful HTTP Server
	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:         serverAddr,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[Server] REST API berjalan di http://localhost:%s\n", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("[Server Error] ListenAndServe failed: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[Server] Menerima sinyal shutdown, menghentikan server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("[Server Error] Forced shutdown: %v", err)
	}

	log.Println("[Server] Server berhasil dihentikan secara aman.")
}
