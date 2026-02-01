#!/bin/bash

# Build and Release Script for Pocket CSV Extension

set -e

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
echo "📦 Building Pocket CSV Extension v$VERSION"

# Clean up old builds
rm -f *.xpi

# Create XPI package
echo "🔨 Creating XPI package..."
zip -r "pocket-csv-extension.xpi" \
    manifest.json \
    popup.html \
    popup.js \
    background.js \
    settings.html \
    settings.js \
    updates.json \
    icon*.svg

echo "✅ Created pocket-csv-extension.xpi"

# Commit and push changes
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Release v$VERSION - Production ready extension

- All Mozilla validation issues resolved
- Security warnings fixed
- Clean DOM creation without innerHTML" || echo "No changes to commit"

git push

# Create GitHub release
echo "🚀 Creating GitHub release v$VERSION..."
gh release create "v$VERSION" \
    pocket-csv-extension.xpi \
    --title "Pocket CSV Extension v$VERSION" \
    --notes "## Pocket CSV Extension v$VERSION

### Features
- ✅ Bookmark management with CSV import/export
- ✅ Search and filter functionality
- ✅ Inline editing and deletion with hover controls
- ✅ Favicon previews and dark mode support
- ✅ Middle-click for background tabs
- ✅ Mozilla Add-ons compliant

### Installation
1. Download the .xpi file
2. Drag and drop into Firefox
3. Extension installs automatically

### Security & Privacy
- All data stored locally in browser
- No external services or tracking
- Mozilla security compliant
- No data collection (declared as 'none')"

echo "🎉 Release v$VERSION created successfully!"
echo "📥 Download: https://github.com/iamtrazy/pocket-csv-extension/releases/download/v$VERSION/pocket-csv-extension.xpi"
