// ─── TextVault Popup Script ──────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // ─── Tab Switching ────────────────────────────────────────────────────
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      document.getElementById(`content-${tab.dataset.tab}`).classList.add("active");
    });
  });

  // ─── Load Data ────────────────────────────────────────────────────────
  loadData();

  // ─── Search & Filter ─────────────────────────────────────────────────
  document.getElementById("search-input").addEventListener("input", renderNotes);
  document.getElementById("file-filter").addEventListener("change", renderNotes);

  // ─── Create File ──────────────────────────────────────────────────────
  document.getElementById("create-file-btn").addEventListener("click", handleCreateFile);
  document.getElementById("create-file-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCreateFile();
  });
});

let allFiles = {};

function loadData() {
  chrome.runtime.sendMessage({ action: "getAllNotes" }, (files) => {
    allFiles = files || {};
    updateStats();
    populateFileFilter();
    renderNotes();
    renderFiles();
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────

function updateStats() {
  const fileNames = Object.keys(allFiles);
  let totalNotes = 0;
  fileNames.forEach((name) => {
    totalNotes += allFiles[name].notes ? allFiles[name].notes.length : 0;
  });

  document.getElementById("header-stats").innerHTML = `
    <span class="stat-number">${totalNotes}</span> note${totalNotes !== 1 ? "s" : ""}<br/>
    <span class="stat-number">${fileNames.length}</span> file${fileNames.length !== 1 ? "s" : ""}
  `;
}

// ─── File Filter Dropdown ─────────────────────────────────────────────────

function populateFileFilter() {
  const select = document.getElementById("file-filter");
  const currentValue = select.value;

  // Clear all options except the first
  while (select.options.length > 1) {
    select.remove(1);
  }

  Object.keys(allFiles).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  select.value = currentValue;
}

// ─── Render Notes ─────────────────────────────────────────────────────────

function renderNotes() {
  const container = document.getElementById("notes-list");
  const searchQuery = document.getElementById("search-input").value.toLowerCase();
  const fileFilter = document.getElementById("file-filter").value;

  // Gather all notes with their file names
  let notes = [];
  Object.entries(allFiles).forEach(([fileName, file]) => {
    if (fileFilter !== "__all__" && fileName !== fileFilter) return;
    (file.notes || []).forEach((note, index) => {
      notes.push({ ...note, fileName, noteIndex: index });
    });
  });

  // Search filter
  if (searchQuery) {
    notes = notes.filter(
      (n) =>
        n.text.toLowerCase().includes(searchQuery) ||
        n.url.toLowerCase().includes(searchQuery) ||
        n.fileName.toLowerCase().includes(searchQuery) ||
        (n.heading || "").toLowerCase().includes(searchQuery)
    );
  }

  // Sort by most recent first
  notes.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

  if (notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No notes yet</div>
        <div class="empty-state-desc">
          Highlight text on any webpage, right-click and choose<br/>
          <strong>"📌 Save to TextVault"</strong> to get started.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = notes
    .map(
      (note) => `
      <div class="note-card" data-file="${escapeHtml(note.fileName)}" data-index="${note.noteIndex}">
        <button class="note-delete" title="Delete note">🗑</button>
        <div class="note-file-badge">${escapeHtml(note.fileName)}</div>
        <div class="note-heading">${escapeHtml(note.heading || "Untitled")}</div>
        <div class="note-text">${escapeHtml(note.text)}</div>
        <div class="note-meta">
          <a href="${escapeHtml(note.url)}" class="note-url" target="_blank" title="${escapeHtml(note.url)}">
            🔗 ${escapeHtml(getDomain(note.url))}
          </a>
          <span class="note-time">${formatDate(note.savedAt)}</span>
        </div>
      </div>
    `
    )
    .join("");

  // Bind delete buttons
  container.querySelectorAll(".note-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".note-card");
      const fileName = card.dataset.file;
      const noteIndex = parseInt(card.dataset.index);
      handleDeleteNote(fileName, noteIndex);
    });
  });
}

// ─── Render Files ─────────────────────────────────────────────────────────

function renderFiles() {
  const container = document.getElementById("files-list");
  const fileNames = Object.keys(allFiles);

  if (fileNames.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📁</div>
        <div class="empty-state-title">No files created</div>
        <div class="empty-state-desc">
          Create a file above to start organizing your notes.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = fileNames
    .map((name) => {
      const file = allFiles[name];
      const noteCount = file.notes ? file.notes.length : 0;
      return `
        <div class="file-card" data-file="${escapeHtml(name)}">
          <div class="file-card-icon">📄</div>
          <div class="file-card-info">
            <div class="file-card-name">${escapeHtml(name)}</div>
            <div class="file-card-meta">${noteCount} note${noteCount !== 1 ? "s" : ""} · Created ${formatDate(file.createdAt)}</div>
          </div>
          <div class="file-card-actions">
            <button class="file-action-btn export-btn" title="Export as .txt">📥</button>
            <button class="file-action-btn danger delete-file-btn" title="Delete file">🗑</button>
          </div>
        </div>
      `;
    })
    .join("");

  // Bind export buttons
  container.querySelectorAll(".export-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".file-card");
      handleExportFile(card.dataset.file);
    });
  });

  // Bind delete file buttons
  container.querySelectorAll(".delete-file-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".file-card");
      handleDeleteFile(card.dataset.file);
    });
  });
}

// ─── Actions ──────────────────────────────────────────────────────────────

function handleCreateFile() {
  const input = document.getElementById("create-file-input");
  const name = input.value.trim();
  if (!name) return;

  chrome.runtime.sendMessage({ action: "createFile", fileName: name }, (result) => {
    if (result.success) {
      input.value = "";
      loadData();
    } else {
      alert(result.error || "Failed to create file");
    }
  });
}

function handleDeleteNote(fileName, noteIndex) {
  if (!confirm("Delete this note?")) return;
  chrome.runtime.sendMessage({ action: "deleteNote", fileName, noteIndex }, (result) => {
    if (result.success) loadData();
  });
}

function handleDeleteFile(fileName) {
  const noteCount = allFiles[fileName]?.notes?.length || 0;
  if (!confirm(`Delete "${fileName}" and its ${noteCount} note(s)?`)) return;
  chrome.runtime.sendMessage({ action: "deleteFile", fileName }, (result) => {
    if (result.success) loadData();
  });
}

function handleExportFile(fileName) {
  chrome.runtime.sendMessage({ action: "exportFile", fileName }, (result) => {
    if (!result.success) {
      alert(result.error || "Export failed");
    }
  });
}

// ─── Utilities ────────────────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function formatDate(timestamp) {
  if (!timestamp) return "unknown";
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}
