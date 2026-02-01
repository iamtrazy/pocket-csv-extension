class PocketCSV {
  constructor() {
    this.bookmarks = [];
    this.filtered = [];
    this.page = 1;
    this.perPage = 10;
    this.query = '';
    this.init();
  }

  async init() {
    try {
      await this.load();
      this.bind();
      this.render();
    } catch (error) {
      setTimeout(() => this.init(), 100);
    }
  }

  bind() {
    document.getElementById('addBtn').onclick = () => this.add();
    document.getElementById('settingsBtn').onclick = () => this.showSettings();
    document.getElementById('searchInput').oninput = (e) => this.search(e.target.value);
    document.getElementById('exportBtn').onclick = () => this.export();
  }

  showSettings() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings.html')
    });
  }

  async add() {
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      const bookmark = {
        url: tab.url,
        title: tab.title || new URL(tab.url).hostname,
        tags: '',
        created_at: Math.floor(Date.now() / 1000)
      };
      this.bookmarks.unshift(bookmark);
      await this.save();
      this.filter();
      this.render();
    } catch (error) {
      // Silently handle errors
    }
  }

  search(q) {
    this.query = q.toLowerCase();
    this.page = 1;
    this.filter();
    this.render();
  }

  filter() {
    if (!this.query) {
      this.filtered = [...this.bookmarks];
    } else {
      this.filtered = this.bookmarks.filter(b => 
        b.title.toLowerCase().includes(this.query) ||
        b.url.toLowerCase().includes(this.query) ||
        b.tags.toLowerCase().includes(this.query)
      );
    }
    this.filtered.sort((a, b) => b.created_at - a.created_at);
  }

  async load() {
    const result = await chrome.storage.local.get(['bookmarks']);
    this.bookmarks = result.bookmarks || [];
    this.filter();
  }

  async save() {
    await chrome.storage.local.set({bookmarks: this.bookmarks});
  }

  favicon(url) {
    try {
      return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`;
    } catch {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="%23ddd"/></svg>';
    }
  }

  open(url) {
    chrome.tabs.create({url});
    window.close();
  }

  render() {
    const start = (this.page - 1) * this.perPage;
    const items = this.filtered.slice(start, start + this.perPage);
    
    const countText = this.query ? 
      `${this.filtered.length} of ${this.bookmarks.length}` : 
      `${this.bookmarks.length} bookmarks`;
    document.getElementById('totalCount').textContent = countText;
    
    const container = document.getElementById('bookmarks');
    container.textContent = '';
    
    items.forEach(bookmark => {
      const div = document.createElement('div');
      div.className = 'bookmark';
      
      // Create elements safely without innerHTML
      const favicon = document.createElement('img');
      favicon.className = 'favicon';
      favicon.src = this.favicon(bookmark.url);
      favicon.onerror = () => favicon.style.display = 'none';
      
      const bookmarkInfo = document.createElement('div');
      bookmarkInfo.className = 'bookmark-info';
      
      const title = document.createElement('div');
      title.className = 'bookmark-title';
      title.textContent = bookmark.title;
      
      const url = document.createElement('div');
      url.className = 'bookmark-url';
      url.textContent = bookmark.url;
      
      const date = document.createElement('div');
      date.className = 'bookmark-date';
      date.textContent = new Date(bookmark.created_at * 1000).toLocaleDateString();
      
      const actions = document.createElement('div');
      actions.className = 'actions';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = '✏️';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '🗑️';
      
      const editForm = document.createElement('div');
      editForm.className = 'edit-form';
      
      const editUrl = document.createElement('input');
      editUrl.type = 'text';
      editUrl.className = 'edit-url';
      editUrl.value = bookmark.url;
      
      const editTitle = document.createElement('input');
      editTitle.type = 'text';
      editTitle.className = 'edit-title';
      editTitle.value = bookmark.title;
      
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'Save';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'cancel-btn';
      cancelBtn.textContent = 'Cancel';
      
      const deleteConfirm = document.createElement('div');
      deleteConfirm.className = 'delete-confirm';
      
      const confirmText = document.createElement('span');
      confirmText.textContent = 'Delete this bookmark?';
      
      const confirmYes = document.createElement('button');
      confirmYes.className = 'confirm-yes';
      confirmYes.textContent = 'Delete';
      
      const confirmNo = document.createElement('button');
      confirmNo.className = 'confirm-no';
      confirmNo.textContent = 'Cancel';
      
      // Assemble elements
      bookmarkInfo.appendChild(title);
      bookmarkInfo.appendChild(url);
      bookmarkInfo.appendChild(date);
      
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      
      editForm.appendChild(editUrl);
      editForm.appendChild(editTitle);
      editForm.appendChild(saveBtn);
      editForm.appendChild(cancelBtn);
      
      deleteConfirm.appendChild(confirmText);
      deleteConfirm.appendChild(confirmYes);
      deleteConfirm.appendChild(confirmNo);
      
      div.appendChild(favicon);
      div.appendChild(bookmarkInfo);
      div.appendChild(actions);
      div.appendChild(editForm);
      div.appendChild(deleteConfirm);
      
      this.bindBookmarkEvents(div, bookmark);
      container.appendChild(div);
    });
    
    this.renderPagination();
  }

  bindBookmarkEvents(div, bookmark) {
    const info = div.querySelector('.bookmark-info');
    const editBtn = div.querySelector('.edit-btn');
    const deleteBtn = div.querySelector('.delete-btn');
    const editForm = div.querySelector('.edit-form');
    const deleteConfirm = div.querySelector('.delete-confirm');
    const saveBtn = div.querySelector('.save-btn');
    const cancelBtn = div.querySelector('.cancel-btn');
    const confirmYes = div.querySelector('.confirm-yes');
    const confirmNo = div.querySelector('.confirm-no');
    
    info.onclick = () => this.open(bookmark.url);
    info.onmousedown = (e) => {
      if (e.button === 1) {
        e.preventDefault();
        chrome.tabs.create({url: bookmark.url, active: false});
      }
    };
    
    editBtn.onclick = (e) => {
      e.stopPropagation();
      info.style.display = 'none';
      editForm.style.display = 'block';
    };
    
    cancelBtn.onclick = (e) => {
      e.stopPropagation();
      info.style.display = 'block';
      editForm.style.display = 'none';
    };
    
    saveBtn.onclick = (e) => {
      e.stopPropagation();
      this.saveEdit(bookmark, div);
    };
    
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      info.style.display = 'none';
      deleteConfirm.style.display = 'block';
    };
    
    confirmYes.onclick = (e) => {
      e.stopPropagation();
      this.deleteBookmark(bookmark);
    };
    
    confirmNo.onclick = (e) => {
      e.stopPropagation();
      info.style.display = 'block';
      deleteConfirm.style.display = 'none';
    };
  }

  renderPagination() {
    const total = Math.ceil(this.filtered.length / this.perPage);
    const container = document.getElementById('pagination');
    
    if (total <= 1) {
      container.textContent = '';
      return;
    }

    container.textContent = '';
    
    const first = document.createElement('button');
    first.textContent = '««';
    first.disabled = this.page === 1;
    first.onclick = () => this.goTo(1);
    container.appendChild(first);
    
    const prev = document.createElement('button');
    prev.textContent = '‹';
    prev.disabled = this.page === 1;
    prev.onclick = () => this.goTo(this.page - 1);
    container.appendChild(prev);
    
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === this.page ? 'current' : '';
      btn.onclick = () => this.goTo(i);
      container.appendChild(btn);
    }
    
    const next = document.createElement('button');
    next.textContent = '›';
    next.disabled = this.page === total;
    next.onclick = () => this.goTo(this.page + 1);
    container.appendChild(next);
    
    const last = document.createElement('button');
    last.textContent = '»»';
    last.disabled = this.page === total;
    last.onclick = () => this.goTo(total);
    container.appendChild(last);
  }

  goTo(page) {
    this.page = page;
    this.render();
  }

  async saveEdit(bookmark, div) {
    const newUrl = div.querySelector('.edit-url').value.trim();
    const newTitle = div.querySelector('.edit-title').value.trim();
    
    if (!newUrl) return;
    
    const index = this.bookmarks.indexOf(bookmark);
    if (index !== -1) {
      this.bookmarks[index].url = newUrl;
      this.bookmarks[index].title = newTitle || new URL(newUrl).hostname;
      await this.save();
      this.filter();
      this.render();
    }
  }

  async deleteBookmark(bookmark) {
    const index = this.bookmarks.indexOf(bookmark);
    if (index !== -1) {
      this.bookmarks.splice(index, 1);
      await this.save();
      this.filter();
      this.render();
    }
  }

  export() {
    const today = new Date().toISOString().split('T')[0];
    const csv = 'url;title;tags;created_at\n' + 
      this.bookmarks.map(b => `${b.url};${b.title.replace(/;/g, ',')};${b.tags};${b.created_at}`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-export-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PocketCSV());
} else {
  new PocketCSV();
}
