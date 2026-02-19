#!/bin/bash
# Deploy via Docker - Jejum Bíblico

set -e

echo "🐳 Deploy via Docker - Jejum Bíblico"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Validar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não encontrado. Instale de https://docker.com${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker encontrado: $(docker --version)${NC}"
echo ""

# Opções
echo -e "${YELLOW}Escolha uma opção:${NC}"
echo "1) Desenvolvimento (npm run dev)"
echo "2) Produção com Docker"
echo "3) Produção com Docker Compose"
echo ""
read -p "Opção (1-3): " option

case $option in
    1)
        echo -e "${BLUE}➤ Iniciando ambiente de desenvolvimento...${NC}"
        npm install
        npm run dev
        ;;
    2)
        echo -e "${BLUE}➤ Building Docker image...${NC}"
        docker build -t jejum-biblico:latest .
        echo -e "${GREEN}✓ Image build concluído${NC}"
        echo ""
        echo -e "${BLUE}➤ Iniciando container...${NC}"
        docker run -p 3000:3000 \
            -e NEXT_PUBLIC_API_URL="https://api.jejumbiblico.com/api" \
            -e NODE_ENV=production \
            jejum-biblico:latest
        ;;
    3)
        echo -e "${BLUE}➤ Iniciando Docker Compose...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✓ Containers iniciados${NC}"
        echo ""
        echo -e "${YELLOW}Acesse em: http://localhost${NC}"
        docker-compose logs -f
        ;;
    *)
        echo -e "${RED}✗ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deploy iniciado com sucesso!${NC}"
echo -e "${YELLOW}════════════════════════════════════════════${NC}"
