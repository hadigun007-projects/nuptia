.PHONY: help install dev dev-home dev-customer dev-admin dev-backend dev-template seed-backend build build-home build-customer build-admin clean kill docker-up docker-down docker-logs

# Default target
.DEFAULT_GOAL := help

# Colors for terminal output
BOLD    := \033[1m
GREEN   := \033[32m
CYAN    := \033[36m
YELLOW  := \033[33m
MAGENTA := \033[35m
BLUE    := \033[34m
RESET   := \033[0m

help: ## Menampilkan panduan penggunaan perintah Makefile
	@echo ""
	@echo "$(BOLD)$(MAGENTA)Nuptia Platform Management$(RESET)"
	@echo "Gunakan: $(CYAN)make [target]$(RESET)"
	@echo ""
	@echo "$(BOLD)Perintah Pengembangan (Development):$(RESET)"
	@echo "  $(GREEN)make dev$(RESET)            Jalankan SEMUA modul (Home, Customer, Admin, & Backend API) bersamaan"
	@echo "  $(GREEN)make kill$(RESET)           Bebaskan port 3000, 5173, 5174, 5000 (gunakan jika 'address already in use')"
	@echo "  $(GREEN)make dev-home$(RESET)       Jalankan aplikasi Landing Page (Next.js di port 3000)"
	@echo "  $(GREEN)make dev-customer$(RESET)   Jalankan Customer Dashboard (Vite di port 5173)"
	@echo "  $(GREEN)make dev-admin$(RESET)      Jalankan Admin Dashboard (Vite di port 5174)"
	@echo "  $(GREEN)make dev-backend$(RESET)    Jalankan Backend REST API (Go + Gin di port 5000)"
	@echo "  $(GREEN)make dev-template$(RESET)   Jalankan preview standalone template (Wedding Rustic di port 8080)"
	@echo "  $(GREEN)make seed-backend$(RESET)   Jalankan database seeder untuk template undangan"
	@echo ""
	@echo "$(BOLD)Instalasi & Build:$(RESET)"
	@echo "  $(GREEN)make install$(RESET)        Instal dependensi untuk semua modul (frontend & backend)"
	@echo "  $(GREEN)make build$(RESET)          Build semua aplikasi untuk mode produksi"
	@echo "  $(GREEN)make clean$(RESET)          Bersihkan file bundle & cache build (dist, .next)"
	@echo ""
	@echo "$(BOLD)Docker & Deployment:$(RESET)"
	@echo "  $(GREEN)make docker-up$(RESET)      Build & jalankan semua kontainer via Docker Compose"
	@echo "  $(GREEN)make docker-down$(RESET)    Hentikan semua kontainer Docker Compose"
	@echo "  $(GREEN)make docker-logs$(RESET)    Lihat streaming log dari kontainer Docker"
	@echo ""

install: ## Instal dependensi untuk semua aplikasi
	@echo "$(CYAN)Menginstal dependensi frontend/home...$(RESET)"
	@npm --prefix frontend/home install
	@echo "$(CYAN)Menginstal dependensi frontend/customer...$(RESET)"
	@npm --prefix frontend/customer install
	@echo "$(CYAN)Menginstal dependensi frontend/admin...$(RESET)"
	@npm --prefix frontend/admin install
	@echo "$(CYAN)Mengunduh dependensi backend (Go modules)...$(RESET)"
	@cd backend && go mod download
	@echo "$(GREEN)Semua dependensi berhasil diinstal!$(RESET)"

dev: ## Jalankan semua aplikasi secara bersamaan
	@echo "$(YELLOW)Membebaskan port sebelumnya (3000, 5173, 5174, 5000)...$(RESET)"
	@lsof -ti :3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti :5173 | xargs kill -9 2>/dev/null || true
	@lsof -ti :5174 | xargs kill -9 2>/dev/null || true
	@lsof -ti :5000 | xargs kill -9 2>/dev/null || true
	@sleep 1
	@echo "$(MAGENTA)Menjalankan Home (port 3000), Customer (port 5173), Admin (port 5174), & API (port 5000)...$(RESET)"
	@npx -y concurrently --kill-others-on-fail --raw -n "HOME,CUSTOMER,ADMIN,API" -c "cyan.bold,magenta.bold,blue.bold,green.bold" \
		"npm --prefix frontend/home run dev" \
		"npm --prefix frontend/customer run dev" \
		"npm --prefix frontend/admin run dev" \
		"cd backend && go run cmd/api/main.go"

dev-home: ## Jalankan hanya frontend/home
	@echo "$(CYAN)Menjalankan Nuptia Home (Next.js 16)...$(RESET)"
	@npm --prefix frontend/home run dev

dev-customer: ## Jalankan hanya frontend/customer
	@echo "$(MAGENTA)Menjalankan Nuptia Customer Dashboard (React 19 + Vite)...$(RESET)"
	@npm --prefix frontend/customer run dev

dev-admin: ## Jalankan hanya frontend/admin
	@echo "$(BLUE)Menjalankan Nuptia Admin Dashboard (React 19 + Vite di port 5174)...$(RESET)"
	@npm --prefix frontend/admin run dev

dev-backend: ## Jalankan hanya backend Go API
	@echo "$(GREEN)Menjalankan Nuptia Backend REST API (Go + Gin di port 5000)...$(RESET)"
	@cd backend && go run cmd/api/main.go

seed-backend: ## Jalankan seeder template database
	@echo "$(CYAN)Menjalankan database seeder template...$(RESET)"
	@cd backend && go run cmd/seed/main.go

dev-template: ## Jalankan preview template wedding-rustic
	@echo "$(YELLOW)Menjalankan preview template di http://localhost:8080...$(RESET)"
	@npx -y serve frontend/templates/wedding-rustic -l 8080

build: build-home build-customer build-admin ## Build semua aplikasi untuk produksi
	@echo "$(GREEN)Semua aplikasi berhasil di-build!$(RESET)"

build-home: ## Build frontend/home
	@echo "$(CYAN)Building frontend/home (Next.js)...$(RESET)"
	@npm --prefix frontend/home run build

build-customer: ## Build frontend/customer
	@echo "$(MAGENTA)Building frontend/customer (Vite)...$(RESET)"
	@npm --prefix frontend/customer run build

build-admin: ## Build frontend/admin
	@echo "$(BLUE)Building frontend/admin (Vite)...$(RESET)"
	@npm --prefix frontend/admin run build

kill: ## Bebaskan port yang digunakan (3000, 5173, 5174, 5000)
	@echo "$(YELLOW)Membebaskan port 3000, 5173, 5174, 5000...$(RESET)"
	@lsof -ti :3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti :5173 | xargs kill -9 2>/dev/null || true
	@lsof -ti :5174 | xargs kill -9 2>/dev/null || true
	@lsof -ti :5000 | xargs kill -9 2>/dev/null || true
	@echo "$(GREEN)Port berhasil dibebaskan!$(RESET)"

clean: ## Hapus folder build dan cache
	@echo "$(YELLOW)Membersihkan file bundle dan cache...$(RESET)"
	@rm -rf frontend/home/.next
	@rm -rf frontend/customer/dist
	@rm -rf frontend/admin/dist
	@echo "$(GREEN)Pembersihan selesai!$(RESET)"


docker-up: ## Jalankan kontainer produksi dengan Docker Compose
	@echo "$(CYAN)Menjalankan Docker Compose di background...$(RESET)"
	@docker compose up -d --build

docker-down: ## Hentikan kontainer Docker Compose
	@echo "$(YELLOW)Menghentikan layanan Docker Compose...$(RESET)"
	@docker compose down

docker-logs: ## Pantau log kontainer Docker Compose
	@docker compose logs -f
