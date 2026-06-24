#!/bin/bash
# AT&T Telecom Intelligence Dashboard - Quick Start Script

echo "=========================================="
echo "  AT&T Telecom Intelligence Dashboard"
echo "  Starting frontend development server..."
echo "=========================================="

cd "$(dirname "$0")/frontend"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo ""
echo "Starting dashboard at http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""
npm start
