#!/bin/bash

echo "🔄 Updating XMenity Social Token Factory on VM..."
echo "External IP: 34.45.54.110"
echo ""

# Stop the dev server
echo "🛑 Stopping development server..."
pkill -f "next dev" 2>/dev/null || echo "No dev server running"

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin cursor/start-unspecified-coding-task-8a48

# Install any new dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Remember to update .env with your specific configuration!"
fi

echo ""
echo "✅ Update complete!"
echo ""
echo "🚀 To start the server:"
echo "   npm run dev"
echo ""
echo "🌐 Access your app at:"
echo "   http://34.45.54.110:3000 (external)"
echo "   http://localhost:3000 (local)"
echo ""
echo "📋 Don't forget to configure AWS Security Group for port 3000!"