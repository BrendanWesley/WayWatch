#!/bin/bash

# Smart Road Quality Monitoring System - Setup Script
# This script helps set up the entire project

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Smart Road Quality Monitoring System - Setup Script      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi
echo "✓ Python $(python3 --version 2>&1 | awk '{print $2}')"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi
echo "✓ npm $(npm --version)"

echo ""
echo "🔧 Installing dependencies..."
echo ""

# Install backend dependencies
echo "📦 Backend (Node.js)..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Install Python dependencies
echo "🐍 Python packages..."
pip3 install -r detection/requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Python packages installation failed"
    exit 1
fi
echo "✓ Python packages installed"
echo ""

# Install app dependencies
echo "📱 React Native App (Expo)..."
cd app
npm install
if [ $? -ne 0 ]; then
    echo "❌ App installation failed"
    exit 1
fi
cd ..
echo "✓ App dependencies installed"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Setup Complete! ✓                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Find your laptop IP:"
echo "   macOS/Linux: ifconfig | grep 'inet '"
echo "   Windows: ipconfig"
echo ""
echo "2. Edit app/App.js and update:"
echo "   const BACKEND_IP = 'YOUR.IP.HERE';"
echo ""
echo "3. Terminal 1 - Start Backend:"
echo "   cd backend && npm start"
echo ""
echo "4. Terminal 2 - Start Python Detection:"
echo "   cd detection && python3 detect.py"
echo ""
echo "5. Terminal 3 - Start React Native App:"
echo "   cd app && npm start"
echo ""
echo "📖 For detailed instructions, see README.md"
echo ""
