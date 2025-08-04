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
	@echo "$(GREEN)Wasted Time Viewer - Makefile Simples$(NC)"
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

clean: ## Remove node_modules e arquivos de build (mantém package.json)
	@echo "$(YELLOW)🧹 Limpando projeto...$(NC)"
	rm -rf $(SOURCE_DIR)/node_modules
	rm -rf $(BUILD_DIR)
	rm -rf $(SOURCE_DIR)/.vite
	rm -rf $(SOURCE_DIR)/node_modules/.cache
	@echo "$(GREEN)✅ Limpeza concluída! package.json mantido$(NC)"

install: clean ## Instala dependências com yarn
	@echo "$(GREEN)📦 Instalando dependências com yarn...$(NC)"
	cd $(SOURCE_DIR) && yarn install
	@echo "$(GREEN)✅ Dependências instaladas com sucesso!$(NC)"

build: install ## Executa build da aplicação
	@echo "$(GREEN)🔨 Executando build...$(NC)"
	cd $(SOURCE_DIR) && yarn build
	@echo "$(GREEN)✅ Build concluído! Arquivos em $(BUILD_DIR)$(NC)"

# Desenvolvimento local
dev: install ## Inicia servidor de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	cd $(SOURCE_DIR) && yarn dev

# Preview da build
preview: build ## Faz preview da build de produção
	@echo "$(GREEN)👀 Iniciando preview da build...$(NC)"
	cd $(SOURCE_DIR) && yarn preview

# Informações de deploy
deploy-info: ## Mostra informações para configuração no Cloudflare Pages
	@echo "$(GREEN)🚀 Configuração para Cloudflare Pages:$(NC)"
	@echo "$(YELLOW)Build command:$(NC) make build"
	@echo "$(YELLOW)Build output directory:$(NC) frontend/dist"
	@echo "$(YELLOW)Root directory:$(NC) / (raiz do repositório)"
	@echo ""
	@echo "$(GREEN)📋 Variáveis de ambiente:$(NC)"
	@echo "$(YELLOW)NODE_VERSION:$(NC) 18"

# Debug - mostra informações do ambiente
debug: ## Mostra informações de debug do ambiente
	@echo "$(GREEN)🐛 Informações de debug:$(NC)"
	@echo "$(YELLOW)Working directory:$(NC) $$(pwd)"
	@echo "$(YELLOW)Node version:$(NC) $$(node --version 2>/dev/null || echo 'Node não encontrado')"
	@echo "$(YELLOW)Yarn version:$(NC) $$(yarn --version 2>/dev/null || echo 'Yarn não encontrado')"
	@echo "$(YELLOW)Source directory exists:$(NC) $$(test -d $(SOURCE_DIR) && echo 'Sim' || echo 'Não')"
	@echo "$(YELLOW)Package.json exists:$(NC) $$(test -f $(SOURCE_DIR)/package.json && echo 'Sim' || echo 'Não')"
	@echo "$(YELLOW)Yarn.lock exists:$(NC) $$(test -f $(SOURCE_DIR)/yarn.lock && echo 'Sim' || echo 'Não')"
	@echo "$(YELLOW)Build directory exists:$(NC) $$(test -d $(BUILD_DIR) && echo 'Sim' || echo 'Não')"
	@if [ -d $(BUILD_DIR) ]; then \
		echo "$(YELLOW)Build files:$(NC)"; \
		ls -la $(BUILD_DIR) | head -10; \
	fi