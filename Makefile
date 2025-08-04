# Makefile para deploy no Cloudflare Pages
# Wasted Time Viewer - React + TypeScript + Vite

.PHONY: help clear install build clean deploy-info debug
.DEFAULT_GOAL := help

# Variáveis
SOURCE_DIR := frontend
BUILD_DIR := frontend/dist

# Cores para output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)Time Manager - Makefile Simples$(NC)"
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

pm-install:
	@echo "$(GREEN)📦 Instalando gerenciador de pacotes PNPM...$(NC)"
	npm -g install pnpm

install: pm-install ## Instala dependências com pnpm
	@echo "$(GREEN)📦 Instalando dependências com pnpm...$(NC)"
	cd $(SOURCE_DIR) && pnpm install --prod
	@echo "$(GREEN)✅ Dependências instaladas com sucesso!$(NC)"

build: install ## Executa build da aplicação
	@echo "$(GREEN)🔨 Executando build...$(NC)"
	cd $(SOURCE_DIR) && pnpm build
	@echo "$(GREEN)✅ Build concluído! Arquivos em $(BUILD_DIR)$(NC)"

# Desenvolvimento local
dev: install ## Inicia servidor de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	cd $(SOURCE_DIR) && pnpm dev

# Preview da build
preview: build ## Faz preview da build de produção
	@echo "$(GREEN)👀 Iniciando preview da build...$(NC)"
	cd $(SOURCE_DIR) && pnpm preview