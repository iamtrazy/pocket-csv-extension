# Pocket CSV - Bookmark Manager Extension

A simple browser extension for managing bookmarks with CSV import/export functionality.

## Features

- **Add Bookmarks**: Save current page with one click
- **Search & Filter**: Find bookmarks by title, URL, or tags
- **CSV Import/Export**: Backup and restore bookmarks as CSV files
- **Inline Editing**: Edit bookmark titles and URLs directly
- **Favicon Display**: Visual bookmark identification
- **Pagination**: Navigate through large bookmark collections
- **Dark Mode**: Automatic theme support

## How It Works

The extension stores all bookmarks locally in your browser using Chrome's storage API. No data is sent to external servers.

- **Popup Interface**: Main bookmark list with search and add functionality
- **Settings Page**: Import/export CSV files and view statistics
- **Local Storage**: All data stays on your device

## Installation

### Firefox
1. Go to [Releases](https://github.com/iamtrazy/pocket-csv-extension/releases)
2. Download `pocket-csv-firefox-signed-v1.0.11.xpi`
3. Drag and drop the file into Firefox
4. Click "Add" when prompted

### Chrome
1. Go to [Releases](https://github.com/iamtrazy/pocket-csv-extension/releases)
2. Download `pocket-csv-chrome-v1.0.11.zip`
3. Extract the ZIP file
4. Open Chrome Extensions (`chrome://extensions/`)
5. Enable "Developer mode"
6. Click "Load unpacked" and select the extracted folder

## Usage

- **Add Bookmark**: Click the extension icon and press "Add Current Page"
- **Search**: Type in the search box to filter bookmarks
- **Edit**: Hover over a bookmark and click "Edit"
- **Delete**: Hover over a bookmark and click "Delete"
- **Import/Export**: Click settings gear icon for CSV operations

## CSV Format

```
url;title;tags;created_at
https://example.com;Example Site;web,tools;1643723400
```
