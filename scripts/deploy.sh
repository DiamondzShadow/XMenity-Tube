#!/bin/bash

# XMenity Social Token Factory Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 XMenity Social Token Factory Deployment Script"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Copying from .env.example..."
        cp .env.example .env
        print_error "Please edit the .env file with your actual values before continuing!"
        print_info "Required variables:"
        echo "  - THIRDWEB_CLIENT_ID"
        echo "  - THIRDWEB_SECRET_KEY"
        echo "  - ADMIN_WALLET_PRIVATE_KEY"
        echo "  - INSIGHTIQ_API_KEY"
        echo "  - DATABASE_URL"
        echo "  - JWT_SECRET"
        exit 1
    else
        print_success ".env file found"
    fi
}

# Install dependencies
install_deps() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Setup database
setup_database() {
    print_info "Setting up database..."
    
    # Generate Prisma client
    npx prisma generate
    print_success "Prisma client generated"
    
    # Push database schema
    npx prisma db push
    print_success "Database schema pushed"
    
    print_info "You can view your database with: npx prisma studio"
}

# Build the application
build_app() {
    print_info "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Deploy to different platforms
deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Set up environment variables for Vercel
    print_info "Setting up Vercel environment variables..."
    vercel env add THIRDWEB_CLIENT_ID
    vercel env add THIRDWEB_SECRET_KEY
    vercel env add FACTORY_CONTRACT_ADDRESS
    vercel env add ADMIN_WALLET_PRIVATE_KEY
    vercel env add INSIGHTIQ_API_KEY
    vercel env add DATABASE_URL
    vercel env add JWT_SECRET
    
    # Deploy
    vercel --prod
    print_success "Deployed to Vercel!"
}

deploy_replit() {
    print_info "Setting up for Replit deployment..."
    
    # Create replit configuration
    cat > .replit << EOF
modules = ["nodejs-18"]

[nix]
channel = "stable-22_11"

[deployment]
run = ["npm", "start"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 3000
externalPort = 80
EOF

    cat > replit.nix << EOF
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.postgresql
  ];
}
EOF

    print_success "Replit configuration created"
    print_info "Upload your project to Replit and run: npm install && npm run build && npm start"
}

# Setup for GCP VM
setup_gcp_vm() {
    print_info "Setting up for GCP VM deployment..."
    
    # Create systemd service file
    cat > xmenity-social-token.service << EOF
[Unit]
Description=XMenity Social Token Factory
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/xmenity-social-token
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    # Create nginx configuration
    cat > xmenity-nginx.conf << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    print_success "GCP VM configuration files created"
    print_info "Manual steps for GCP VM:"
    echo "1. Copy files to your VM: scp -r . user@your-vm-ip:/var/www/xmenity-social-token"
    echo "2. Install Node.js 18+, nginx, and PM2"
    echo "3. Set up SSL with Let's Encrypt"
    echo "4. Start the service with PM2 or systemd"
}

# Docker setup
create_dockerfile() {
    print_info "Creating Docker configuration..."
    
    cat > Dockerfile << EOF
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
EOF

    cat > .dockerignore << EOF
Dockerfile
.dockerignore
.next
.git
node_modules
npm-debug.log
README.md
.env
.env.local
.env.production.local
.env.local
EOF

    cat > docker-compose.yml << EOF
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: social_tokens
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
EOF

    print_success "Docker configuration created"
    print_info "Run with: docker-compose up --build"
}

# Main deployment function
main() {
    local platform=$1
    
    echo "Starting deployment process..."
    
    # Common setup steps
    check_env
    install_deps
    setup_database
    
    case $platform in
        "vercel")
            build_app
            deploy_vercel
            ;;
        "replit")
            deploy_replit
            ;;
        "gcp")
            build_app
            setup_gcp_vm
            ;;
        "docker")
            create_dockerfile
            ;;
        "local")
            print_info "Setting up for local development..."
            print_success "Setup complete! Run 'npm run dev' to start development server"
            ;;
        *)
            print_error "Unknown platform: $platform"
            print_info "Available platforms: vercel, replit, gcp, docker, local"
            exit 1
            ;;
    esac
    
    print_success "Deployment process completed for $platform!"
    
    if [ "$platform" != "local" ]; then
        print_warning "Remember to:"
        echo "1. Update your environment variables in the deployment platform"
        echo "2. Set up your database connection"
        echo "3. Configure your custom domain (if applicable)"
        echo "4. Test the InsightIQ webhook integration"
    fi
}

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <platform>"
    echo ""
    echo "Available platforms:"
    echo "  vercel  - Deploy to Vercel"
    echo "  replit  - Set up for Replit"
    echo "  gcp     - Set up for Google Cloud Platform VM"
    echo "  docker  - Create Docker configuration"
    echo "  local   - Set up for local development"
    echo ""
    echo "Example: $0 vercel"
    exit 1
fi

# Run main function with the platform argument
main $1