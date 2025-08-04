# Makefile para deploy no Cloudflare Pages
# Wasted Time Viewer - React + TypeScript + Vite

.PHONY: help install build clean dev preview lint type-check format test deploy-info
.DEFAULT_GOAL := help

# Variáveis
NODE_VERSION := 18
PNPM_VERSION := latest
BUILD_DIR := frontend/dist
SOURCE_DIR := frontend

# Cores para output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help:
	@echo "$(GREEN)Wasted Time Viewer - Makefile para Cloudflare Pages$(NC)"
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install:
	@echo "$(GREEN)📦 Verificando e instalando pnpm...$(NC)"
	@which pnpm > /dev/null 2>&1 || npm install -g pnpm@$(PNPM_VERSION)
	@echo "$(GREEN)📦 Instalando dependências...$(NC)"
	cd $(SOURCE_DIR) && pnpm install --frozen-lockfile
	@echo "$(GREEN)✅ Dependências instaladas com sucesso!$(NC)"

build: install
	@echo "$(GREEN)🔨 Construindo aplicação para produção...$(NC)"
	cd $(SOURCE_DIR) && pnpm run build
	@echo "$(GREEN)✅ Build concluído! Arquivos em $(BUILD_DIR)$(NC)"
	@echo "$(YELLOW)📁 Conteúdo do diretório de build:$(NC)"
	@ls -la $(BUILD_DIR) || echo "$(RED)❌ Diretório de build não encontrado$(NC)"

# Limpeza
clean: ## Remove arquivos de build e cache
	@echo "$(YELLOW)🧹 Limpando arquivos de build...$(NC)"
	rm -rf $(BUILD_DIR)
	rm -rf $(SOURCE_DIR)/node_modules/.cache
	rm -rf $(SOURCE_DIR)/.vite
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

# Desenvolvimento local
dev: install ## Inicia servidor de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	cd $(SOURCE_DIR) && pnpm run dev

# Preview da build
preview: build ## Faz preview da build de produção
	@echo "$(GREEN)👀 Iniciando preview da build...$(NC)"
	cd $(SOURCE_DIR) && pnpm run preview

# Linting
lint: install ## Executa linting do código
	@echo "$(GREEN)🔍 Executando linting...$(NC)"
	cd $(SOURCE_DIR) && pnpm run lint

# Type checking
type-check: install ## Verifica tipos TypeScript
	@echo "$(GREEN)🔍 Verificando tipos TypeScript...$(NC)"
	cd $(SOURCE_DIR) && pnpm exec tsc --noEmit

# Validação completa (para CI/CD)
validate: install lint type-check ## Executa todas as validações
	@echo "$(GREEN)✅ Todas as validações passaram!$(NC)"

# Informações de deploy
deploy-info: ## Mostra informações para configuração no Cloudflare Pages
	@echo "$(GREEN)🚀 Configuração para Cloudflare Pages:$(NC)"
	@echo "$(YELLOW)Build command:$(NC) make build"
	@echo "$(YELLOW)Build output directory:$(NC) frontend/dist"
	@echo "$(YELLOW)Root directory:$(NC) / (raiz do repositório)"
	@echo "$(YELLOW)Node.js version:$(NC) $(NODE_VERSION)"
	@echo ""
	@echo "$(GREEN)📋 Variáveis de ambiente recomendadas:$(NC)"
	@echo "$(YELLOW)NODE_VERSION:$(NC) $(NODE_VERSION)"
	@echo "$(YELLOW)PNPM_VERSION:$(NC) $(PNPM_VERSION)"
	@echo ""
	@echo "$(GREEN)📁 Estrutura esperada após build:$(NC)"
	@echo "  frontend/dist/"
	@echo "  ├── index.html"
	@echo "  ├── assets/"
	@echo "  └── ..."

# Comando para verificar se tudo está funcionando
health-check: ## Verifica se a aplicação está funcionando
	@echo "$(GREEN)🏥 Executando health check...$(NC)"
	@if [ -f "$(BUILD_DIR)/index.html" ]; then \
		echo "$(GREEN)✅ index.html encontrado$(NC)"; \
	else \
		echo "$(RED)❌ index.html não encontrado$(NC)"; \
		exit 1; \
	fi
	@if [ -d "$(BUILD_DIR)/assets" ]; then \
		echo "$(GREEN)✅ Pasta assets encontrada$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Pasta assets não encontrada$(NC)"; \
	fi
	@echo "$(GREEN)🎉 Health check concluído!$(NC)"

# Comando completo para deploy
deploy: clean validate build health-check ## Executa todo o processo de deploy
	@echo "$(GREEN)🚀 Deploy pronto para Cloudflare Pages!$(NC)"

# Debug - mostra informações do ambiente
debug: ## Mostra informações de debug do ambiente
	@echo "$(GREEN)🐛 Informações de debug:$(NC)"
	@echo "$(YELLOW)Node version:$(NC) $$(node --version 2>/dev/null || echo 'Node não encontrado')"
	@echo "$(YELLOW)PNPM version:$(NC) $$(pnpm --version 2>/dev/null || echo 'PNPM não encontrado')"
	@echo "$(YELLOW)Working directory:$(NC) $$(pwd)"
	@echo "$(YELLOW)Source directory exists:$(NC) $$(test -d $(SOURCE_DIR) && echo 'Sim' || echo 'Não')"
	@echo "$(YELLOW)Package.json exists:$(NC) $$(test -f $(SOURCE_DIR)/package.json && echo 'Sim' || echo 'Não')"
	@echo "$(YELLOW)Lockfile exists:$(NC) $$(test -f $(SOURCE_DIR)/pnpm-lock.yaml && echo 'Sim' || echo 'Não')"