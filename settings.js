async function loadStats() {
  try {
    const result = await chrome.storage.local.get(['bookmarks']);
    const bookmarks = result.bookmarks || [];
    const total = bookmarks.length;
    const oldest = total > 0 ? 
      new Date(Math.min(...bookmarks.map(b => b.created_at * 1000))).toLocaleDateString() : 
      'N/A';
    
    const statsEl = document.getElementById('stats');
    statsEl.textContent = '';
    
    const totalEl = document.createElement('strong');
    totalEl.textContent = total.toString();
    const textEl = document.createElement('span');
    textEl.textContent = ' total bookmarks';
    const brEl = document.createElement('br');
    const oldestEl = document.createElement('span');
    oldestEl.textContent = 'Oldest bookmark: ' + oldest;
    
    statsEl.appendChild(totalEl);
    statsEl.appendChild(textEl);
    statsEl.appendChild(brEl);
    statsEl.appendChild(oldestEl);
  } catch (error) {
    document.getElementById('stats').textContent = 'Unable to load statistics';
  }
}

function importCSV() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    showImportStatus('Please select a CSV file first', 'error');
    return;
  }
  
  showImportStatus('Processing file...', '');
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const bookmarks = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const parts = line.split(';');
          if (parts[0] && parts[0].trim()) {
            bookmarks.push({
              url: parts[0].trim(),
              title: parts[1] ? parts[1].trim() : parts[0].trim(),
              tags: parts[2] ? parts[2].trim() : '',
              created_at: parts[3] ? parseInt(parts[3]) : Math.floor(Date.now() / 1000)
            });
          }
        }
      }
      
      if (bookmarks.length > 0) {
        chrome.storage.local.set({bookmarks: bookmarks}).then(() => {
          showImportStatus(`Successfully imported ${bookmarks.length} bookmarks!`, 'success');
          setTimeout(() => loadStats(), 1000);
        });
      } else {
        showImportStatus('No valid bookmarks found in CSV file', 'error');
      }
    } catch (error) {
      showImportStatus('Import failed. Please check your CSV format.', 'error');
    }
  };
  
  reader.onerror = () => {
    showImportStatus('Failed to read file', 'error');
  };
  
  reader.readAsText(file);
}

function exportCSV() {
  chrome.storage.local.get(['bookmarks']).then(result => {
    const bookmarks = result.bookmarks || [];
    if (bookmarks.length === 0) {
      showExportStatus('No bookmarks to export', 'error');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const csv = 'url;title;tags;created_at\n' + 
      bookmarks.map(b => `${b.url};${b.title.replace(/;/g, ',')};${b.tags};${b.created_at}`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-export-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showExportStatus(`Exported ${bookmarks.length} bookmarks successfully!`, 'success');
  });
}

function showImportStatus(message, type) {
  const status = document.getElementById('importStatus');
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';
}

function showExportStatus(message, type) {
  const status = document.getElementById('exportStatus');
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';
}

// Initialize
document.getElementById('importBtn').onclick = importCSV;
document.getElementById('exportBtn').onclick = exportCSV;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadStats);
} else {
  loadStats();
}
