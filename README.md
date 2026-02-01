# Pocket CSV Extension

A clean, minimal browser extension for managing bookmarks with CSV import/export functionality.

## Quick Setup

1. **Create private GitHub repo**: `pocket-csv-extension`
2. **Push this code** to the repo
3. **Create release** with tag `v1.0.0`
4. **Upload** `pocket-csv-extension.xpi` to the release
5. **Submit to Mozilla** for signing

## Features

- Add bookmarks with one click
- Search and filter bookmarks
- Edit and delete with hover controls
- CSV import/export functionality
- Favicon previews and dark mode
- Middle-click for background tabs

## Files Structure

```
extension/
├── manifest.json       # Extension manifest
├── popup.html         # Main popup interface
├── popup.js          # Popup functionality
├── settings.html     # Settings page
├── settings.js       # Settings functionality
├── background.js     # Background script
├── updates.json      # Update manifest
├── README.md         # Documentation
└── icon*.svg         # Extension icons
```

## Installation

### For Users
1. Download the signed .xpi from releases
2. Drag and drop into Firefox
3. Extension installs automatically

### For Development
1. Clone this repo
2. Open Firefox → `about:debugging`
3. Load temporary add-on → select `manifest.json`

## Updating

When you release a new version:
1. Update version in `manifest.json`
2. Update version in `updates.json`
3. Create new GitHub release with same version tag
4. Upload new .xpi file to the release

Firefox will automatically update for users.

## Privacy

- All data stored locally
- No external services
- No tracking or analytics
- Open source code

## License

MIT License - Feel free to modify and distribute.
