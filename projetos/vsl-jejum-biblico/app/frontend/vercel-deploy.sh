#!/bin/bash
# Vercel Deploy Assistant - Jejum Bíblico

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Vercel Deploy - Jejum Bíblico Landing Page             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ Error: package.json not found${NC}"
    echo -e "${BLUE}Please run this script from the frontend directory:${NC}"
    echo "  cd projetos/vsl-jejum-biblico/app/frontend"
    exit 1
fi

echo -e "${BLUE}📋 Pré-Deploy Checklist${NC}"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi
echo -e "${GREEN}✓ Vercel CLI $(vercel --version 2>/dev/null || echo 'installed')${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git $(git --version | awk '{print $3}')${NC}"

echo ""
echo -e "${BLUE}🔒 Authentication${NC}"
echo ""

# Check if already logged in
if vercel whoami 2>/dev/null; then
    echo -e "${GREEN}✓ Already logged in to Vercel${NC}"
    LOGGED_IN=true
else
    echo -e "${YELLOW}⚠ Not logged in to Vercel${NC}"
    echo ""
    echo -e "${CYAN}Login options:${NC}"
    echo "1) GitHub"
    echo "2) GitLab" 
    echo "3) Bitbucket"
    echo "4) Google"
    echo "5) Email"
    echo ""
    read -p "Choose login method (1-5): " login_method
    
    case $login_method in
        1|2|3|4|5) 
            echo -e "${BLUE}➤ Opening Vercel login...${NC}"
            vercel login
            ;;
        *)
            echo -e "${RED}✗ Invalid option${NC}"
            exit 1
            ;;
    esac
    
    LOGGED_IN=true
fi

echo ""
echo -e "${BLUE}🏗️ Build Check${NC}"
echo ""

# Test build
if npm run build 2>/dev/null; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    read -p "Continue anyway? (y/n): " continue_build
    if [ "$continue_build" != "y" ]; then
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Ready to deploy!${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Deploy options:${NC}"
echo "1) Deploy to production (--prod)"
echo "2) Deploy to staging (preview)"
echo "3) Custom deployment"
echo "4) Cancel"
echo ""
read -p "Choose option (1-4): " deploy_option

case $deploy_option in
    1)
        echo ""
        echo -e "${BLUE}➤ Deploying to PRODUCTION...${NC}"
        echo ""
        vercel --prod --confirm
        
        echo ""
        echo -e "${GREEN}✓ Deployment complete!${NC}"
        echo ""
        echo -e "${CYAN}Your landing page is now live! 🎉${NC}"
        echo ""
        
        # Get deployment URL
        VERCEL_URL=$(vercel ls --prod 2>/dev/null | head -1 | awk '{print $1}' || echo "https://vercel.app")
        echo -e "${YELLOW}URL: ${NC}${GREEN}${VERCEL_URL}${NC}"
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}➤ Deploying to STAGING...${NC}"
        echo ""
        vercel --confirm
        
        echo ""
        echo -e "${GREEN}✓ Staging deployment complete!${NC}"
        echo ""
        echo -e "${CYAN}Preview URL available in Vercel dashboard${NC}"
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}➤ Running custom deployment...${NC}"
        vercel
        ;;
        
    4)
        echo -e "${YELLOW}Deployment cancelled${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}✗ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Next steps:${NC}"
echo ""
echo "1. Visit your deployment URL"
echo "2. Test the landing page"
echo "3. Configure custom domain (if desired)"
echo "4. Setup analytics & monitoring"
echo "5. Launch marketing campaign"
echo ""
echo -e "${CYAN}🎓 Helpful links:${NC}"
echo "  Dashboard: https://vercel.com/dashboard"
echo "  Docs: https://vercel.com/docs"
echo "  Support: https://vercel.com/support"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Parabéns! Sua página está em produção! 🚀${NC}"
echo ""
