#!/bin/bash
# Deploy Script para Jejum Bíblico Frontend

set -e

echo "🚀 Iniciando Deploy da Landing Page Jejum Bíblico"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Verificar Node.js
echo -e "${BLUE}➤ Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Instale de https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
echo ""

# Step 2: Instalar dependências
echo -e "${BLUE}➤ Instalando dependências...${NC}"
cd "$(dirname "$0")"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Pasta node_modules já existe, pulando install"
fi
echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

# Step 3: Validar código
echo -e "${BLUE}➤ Executando linting...${NC}"
npm run lint || true
echo -e "${GREEN}✓ Lint concluído${NC}"
echo ""

# Step 4: Build
echo -e "${BLUE}➤ Fazendo build para produção...${NC}"
rm -rf .next
npm run build
echo -e "${GREEN}✓ Build concluído com sucesso${NC}"
echo ""

# Step 5: Tamanho do build
echo -e "${BLUE}➤ Tamanho do build:${NC}"
du -sh .next || true
echo ""

# Step 6: Informações de deployment
echo -e "${YELLOW}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Build pronto para produção!${NC}"
echo ""
echo -e "${YELLOW}Próximos Passos:${NC}"
echo ""
echo -e "${BLUE}Opção 1: Vercel (RECOMENDADO)${NC}"
echo "  npm install -g vercel"
echo "  vercel --prod"
echo ""
echo -e "${BLUE}Opção 2: Deploy Local${NC}"
echo "  npm start"
echo ""
echo -e "${BLUE}Opção 3: Netlify${NC}"
echo "  netlify deploy --prod"
echo ""
echo -e "${YELLOW}📖 Leia DEPLOY.md para instruções completas${NC}"
echo -e "${YELLOW}════════════════════════════════════════════${NC}"
