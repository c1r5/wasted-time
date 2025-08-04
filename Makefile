# Makefile para deploy no Cloudflare Pages
# Wasted Time Viewer - React + TypeScript + Vite
# Suporta pnpm e npm como fallback

.PHONY: help install build clean dev preview lint type-check deploy-info
.DEFAULT_GOAL := help

# Variáveis
NODE_VERSION := 18
BUILD_DIR := frontend/dist
SOURCE_DIR := frontend

# Cores para output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)Wasted Time Viewer - Makefile para Cloudflare Pages$(NC)"
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Detecta qual package manager usar
detect-pm:
	@if [ -f "$(SOURCE_DIR)/pnpm-lock.yaml" ]; then \
		echo "pnpm" > .pm-detected; \
	elif [ -f "$(SOURCE_DIR)/yarn.lock" ]; then \
		echo "yarn" > .pm-detected; \
	else \
		echo "npm" > .pm-detected; \
	fi

# Instalação de dependências
install: detect-pm ## Instala todas as dependências
	@echo "$(GREEN)📦 Verificando estrutura do projeto...$(NC)"
	@test -f $(SOURCE_DIR)/package.json || (echo "$(RED)❌ package.json não encontrado em $(SOURCE_DIR)$(NC)" && exit 1)
	@PM=$$(cat .pm-detected); \
	echo "$(GREEN)📦 Detectado package manager: $$PM$(NC)"; \
	if [ "$$PM" = "pnpm" ]; then \
		echo "$(GREEN)📦 Instalando pnpm...$(NC)"; \
		npm install -g pnpm@latest 2>/dev/null || echo "$(YELLOW)⚠️  pnpm já instalado$(NC)"; \
		echo "$(GREEN)📦 Instalando dependências com pnpm...$(NC)"; \
		cd $(SOURCE_DIR) && pnpm install --frozen-lockfile; \
	elif [ "$$PM" = "yarn" ]; then \
		echo "$(GREEN)📦 Instalando dependências com yarn...$(NC)"; \
		cd $(SOURCE_DIR) && yarn install --frozen-lockfile; \
	else \
		echo "$(GREEN)📦 Instalando dependências com npm...$(NC)"; \
		cd $(SOURCE_DIR) && npm ci; \
	fi
	@echo "$(GREEN)✅ Dependências instaladas com sucesso!$(NC)"

# Build para produção (comando principal para Cloudflare Pages)
build: install ## Constrói a aplicação para produção
	@echo "$(GREEN)🔨 Construindo aplicação para produção...$(NC)"
	@PM=$$(cat .pm-detected 2>/dev/null || echo "npm"); \
	if [ "$$PM" = "pnpm" ]; then \
		cd $(SOURCE_DIR) && pnpm run build; \
	elif [ "$$PM" = "yarn" ]; then \
		cd $(SOURCE_DIR) && yarn build; \
	else \
		cd $(SOURCE_DIR) && npm run build; \
	fi
	@echo "$(GREEN)✅ Build concluído! Arquivos em $(BUILD_DIR)$(NC)"
	@echo "$(YELLOW)📁 Conteúdo do diretório de build:$(NC)"
	@ls -la $(BUILD_DIR) 2>/dev/null || echo "$(RED)❌ Diretório de build não encontrado$(NC)"

# Limpeza
clean: ## Remove arquivos de build e cache
	@echo "$(YELLOW)🧹 Limpando arquivos de build...$(NC)"
	rm -rf $(BUILD_DIR)
	rm -rf $(SOURCE_DIR)/node_modules/.cache
	rm -rf $(SOURCE_DIR)/.vite
	rm -f .pm-detected
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

# Desenvolvimento local
dev: install ## Inicia servidor de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	@PM=$$(cat .pm-detected 2>/dev/null || echo "npm"); \
	if [ "$$PM" = "pnpm" ]; then \
		cd $(SOURCE_DIR) && pnpm run dev; \
	elif [ "$$PM" = "yarn" ]; then \
		cd $(SOURCE_DIR) && yarn dev; \
	else \
		cd $(SOURCE_DIR) && npm run dev; \
	fi

# Preview da build
preview: build ## Faz preview da build de produção
	@echo "$(GREEN)👀 Iniciando preview da build...$(NC)"
	@PM=$$(cat .pm-detected 2>/dev/null || echo "npm"); \
	if [ "$$PM" = "pnpm" ]; then \
		cd $(SOURCE_DIR) && pnpm run preview; \
	elif [ "$$PM" = "yarn" ]; then \
		cd $(SOURCE_DIR) && yarn preview; \
	else \
		cd $(SOURCE_DIR) && npm run preview; \
	fi

# Linting
lint: install ## Executa linting do código
	@echo "$(GREEN)🔍 Executando linting...$(NC)"
	@PM=$$(cat .pm-detected 2>/dev/null || echo "npm"); \
	if [ "$$PM" = "pnpm" ]; then \
		cd $(SOURCE_DIR) && pnpm run lint; \
	elif [ "$$PM" = "yarn" ]; then \
		cd $(SOURCE_DIR) && yarn lint; \
	else \
		cd $(SOURCE_DIR) && npm run lint; \
	fi

# Type checking
type-check: install ## Verifica tipos TypeScript
	@echo "$(GREEN)🔍 Verificando tipos TypeScript...$(NC)"
	@PM=$$(cat .pm-detected 2>/dev/null || echo "npm"); \
	if [ "$$PM" = "pnpm" ]; then \
		cd $(SOURCE_DIR) && pnpm exec tsc --noEmit; \
	elif [ "$$PM" = "yarn" ]; then \
		cd $(SOURCE_DIR) && yarn tsc --noEmit; \
	else \
		cd $(SOURCE_DIR) && npx tsc --noEmit; \
	fi

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
	@echo "$(YELLOW)npm version:$(NC) $$(npm --version 2>/dev/null || echo 'npm não encontrado')"
	@echo "$(YELLOW)pnpm version:$(NC) $$(pnpm --version 2>/dev/null || echo 'pnpm não encontrado')"
	@echo "$(YELLOW)Working directory:$(NC) $$(pwd)"
	@echo "$(YELLOW)Source directory exists:$(NC) $$(test -d $(SOURCE_DIR) && echo 'Sim' || echo 'Não')"
	@echo "$(YELLOW)Package.json exists:$(NC) $$(test -f $(SOURCE_DIR)/package.json && echo 'Sim' || echo 'Não')"
	@if [ -f "$(SOURCE_DIR)/pnpm-lock.yaml" ]; then \
		echo "$(YELLOW)Lock file:$(NC) pnpm-lock.yaml"; \
	elif [ -f "$(SOURCE_DIR)/yarn.lock" ]; then \
		echo "$(YELLOW)Lock file:$(NC) yarn.lock"; \
	elif [ -f "$(SOURCE_DIR)/package-lock.json" ]; then \
		echo "$(YELLOW)Lock file:$(NC) package-lock.json"; \
	else \
		echo "$(YELLOW)Lock file:$(NC) Nenhum encontrado"; \
	fi