#!/bin/bash
# One-shot setup script for new developers.
set -e

echo "=== Flutter x Ts.ED Framework Setup ==="
echo ""

# Check prerequisites
command -v flutter >/dev/null 2>&1 || { echo "ERROR: Flutter not installed. Visit https://flutter.dev/docs/get-started/install"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js not installed. Visit https://nodejs.org"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "ERROR: Git not installed."; exit 1; }

echo "✓ Prerequisites found"

# Install lefthook
if ! command -v lefthook &> /dev/null; then
  echo "Installing lefthook..."
  if command -v brew &> /dev/null; then
    brew install lefthook
  else
    npm install -g @arkweid/lefthook
  fi
fi

# Install gitleaks
if ! command -v gitleaks &> /dev/null; then
  echo "Installing gitleaks..."
  if command -v brew &> /dev/null; then
    brew install gitleaks
  else
    echo "WARNING: Install gitleaks manually: https://github.com/gitleaks/gitleaks"
  fi
fi

# Install spectral for OpenAPI validation
if ! command -v spectral &> /dev/null; then
  echo "Installing Spectral CLI..."
  npm install -g @stoplight/spectral-cli
fi

# Setup lefthook git hooks
lefthook install

# Flutter setup
echo "Setting up Flutter..."
cp frontend/.env.example frontend/.env.dev 2>/dev/null || true
cp frontend/.env.example frontend/.env.staging 2>/dev/null || true
cp frontend/.env.example frontend/.env.prod 2>/dev/null || true
cd frontend && flutter pub get
dart run build_runner build --delete-conflicting-outputs
cd ..

# Backend setup
echo "Setting up Backend..."
cp backend/.env.example backend/.env.dev 2>/dev/null || true
cd backend && npm install
cd ..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Fill in frontend/.env.dev with your API keys"
echo "  2. Fill in backend/.env.dev with DATABASE_URL and JWT_SECRET"
echo "  3. Run: cd backend && npm run db:migrate"
echo "  4. Run: /init to configure PROJECT_CONFIG.md"
echo "  5. Run: /store-check to see required store assets"
echo ""
