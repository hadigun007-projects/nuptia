.PHONY: help install dev dev-home dev-customer dev-template build build-home build-customer clean docker-up docker-down docker-logs

# Default target
.DEFAULT_GOAL := help

# Colors for terminal output
BOLD    := \033[1m
GREEN   := \033[32m
CYAN    := \033[36m
YELLOW  := \033[33m
MAGENTA := \033[35m
RESET   := \033[0m

help: ## Menampilkan panduan penggunaan perintah Makefile
	@echo ""
	@echo "$(BOLD)$(MAGENTA)Nuptia Platform Management$(RESET)"
	@echo "Gunakan: $(CYAN)make [target]$(RESET)"
	@echo ""
	@echo "$(BOLD)Perintah Pengembangan (Development):$(RESET)"
	@echo "  $(GREEN)make dev$(RESET)            Jalankan SEMUA aplikasi frontend (Home & Customer) bersamaan"
	@echo "  $(GREEN)make dev-home$(RESET)       Jalankan aplikasi Landing Page (Next.js di port 3000)"
	@echo "  $(GREEN)make dev-customer$(RESET)   Jalankan Customer Dashboard (Vite di port 5173)"
	@echo "  $(GREEN)make dev-template$(RESET)   Jalankan preview standalone template (Wedding Rustic di port 8080)"
	@echo ""
	@echo "$(BOLD)Instalasi & Build:$(RESET)"
	@echo "  $(GREEN)make install$(RESET)        Instal dependensi untuk semua modul frontend"
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
	@echo "$(GREEN)Semua dependensi berhasil diinstal!$(RESET)"

dev: ## Jalankan semua aplikasi secara bersamaan
	@echo "$(MAGENTA)Menjalankan Home (port 3000) & Customer (port 5173)...$(RESET)"
	@npx -y concurrently -k -n "HOME,CUSTOMER" -c "cyan.bold,magenta.bold" \
		"npm --prefix frontend/home run dev" \
		"npm --prefix frontend/customer run dev"

dev-home: ## Jalankan hanya frontend/home
	@echo "$(CYAN)Menjalankan Nuptia Home (Next.js 16)...$(RESET)"
	@npm --prefix frontend/home run dev

dev-customer: ## Jalankan hanya frontend/customer
	@echo "$(MAGENTA)Menjalankan Nuptia Customer Dashboard (React 19 + Vite)...$(RESET)"
	@npm --prefix frontend/customer run dev

dev-template: ## Jalankan preview template wedding-rustic
	@echo "$(YELLOW)Menjalankan preview template di http://localhost:8080...$(RESET)"
	@npx -y serve frontend/templates/wedding-rustic -l 8080

build: build-home build-customer ## Build semua aplikasi untuk produksi
	@echo "$(GREEN)Semua aplikasi berhasil di-build!$(RESET)"

build-home: ## Build frontend/home
	@echo "$(CYAN)Building frontend/home (Next.js)...$(RESET)"
	@npm --prefix frontend/home run build

build-customer: ## Build frontend/customer
	@echo "$(MAGENTA)Building frontend/customer (Vite)...$(RESET)"
	@npm --prefix frontend/customer run build

clean: ## Hapus folder build dan cache
	@echo "$(YELLOW)Membersihkan file bundle dan cache...$(RESET)"
	@rm -rf frontend/home/.next
	@rm -rf frontend/customer/dist
	@echo "$(GREEN)Pembersihan selesai!$(RESET)"

docker-up: ## Jalankan kontainer produksi dengan Docker Compose
	@echo "$(CYAN)Menjalankan Docker Compose di background...$(RESET)"
	@docker compose up -d --build

docker-down: ## Hentikan kontainer Docker Compose
	@echo "$(YELLOW)Menghentikan layanan Docker Compose...$(RESET)"
	@docker compose down

docker-logs: ## Pantau log kontainer Docker Compose
	@docker compose logs -f
