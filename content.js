// ─── TextVault Content Script ────────────────────────────────────────────────

(() => {
  let selectedText = "";
  let currentUrl = "";
  let currentTitle = "";
  let selectedFile = null;
  let dialog = null;
  let overlay = null;

  // ─── Listen for messages from background ────────────────────────────────
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showSaveDialog") {
      selectedText = message.text;
      currentUrl = message.url;
      currentTitle = message.title;
      showSaveDialog();
    }
  });

  // ─── Build and Show the Save Dialog ─────────────────────────────────────
  function showSaveDialog() {
    // Remove any existing dialog
    removeDialog();

    // Create overlay
    overlay = document.createElement("div");
    overlay.id = "textvault-overlay";
    document.body.appendChild(overlay);

    // Create dialog
    dialog = document.createElement("div");
    dialog.id = "textvault-dialog";
    dialog.innerHTML = `
      <div class="tv-header">
        <div class="tv-header-title">
          <div class="tv-logo">📌</div>
          TextVault
        </div>
        <button class="tv-close-btn" id="tv-close">✕</button>
      </div>

      <div class="tv-preview">${escapeHtml(truncate(selectedText, 200))}</div>

      <div class="tv-source-url">
        <span>🔗</span>
        <span>${escapeHtml(currentUrl)}</span>
      </div>

      <div class="tv-section-label">Note Heading</div>
      <div class="tv-heading-row">
        <input type="text" class="tv-heading-input" id="tv-heading-input" placeholder="Enter a heading for this note..." />
      </div>

      <div class="tv-section-label">Save to File</div>
      <div class="tv-file-list" id="tv-file-list">
        <div class="tv-empty-state">Loading...</div>
      </div>

      <div class="tv-new-file-row">
        <input type="text" class="tv-new-file-input" id="tv-new-file-input" placeholder="New file name..." />
        <button class="tv-new-file-btn" id="tv-new-file-btn">+ Create</button>
      </div>

      <div class="tv-footer">
        <button class="tv-save-btn" id="tv-save-btn" disabled>Select a file to save</button>
      </div>
    `;

    document.body.appendChild(dialog);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add("tv-visible");
      dialog.classList.add("tv-visible");
    });

    // Bind events
    document.getElementById("tv-close").addEventListener("click", removeDialog);
    overlay.addEventListener("click", removeDialog);
    document.getElementById("tv-new-file-btn").addEventListener("click", handleCreateFile);
    document.getElementById("tv-save-btn").addEventListener("click", handleSave);
    document.getElementById("tv-new-file-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleCreateFile();
    });

    // Load existing files
    loadFileList();
  }

  // ─── Load File List ─────────────────────────────────────────────────────
  function loadFileList() {
    chrome.runtime.sendMessage({ action: "getFiles" }, (files) => {
      const container = document.getElementById("tv-file-list");
      if (!container) return;

      const fileNames = Object.keys(files || {});

      if (fileNames.length === 0) {
        container.innerHTML = `
          <div class="tv-empty-state">
            No files yet — create one below!
          </div>
        `;
        return;
      }

      container.innerHTML = "";
      fileNames.forEach((name) => {
        const file = files[name];
        const noteCount = file.notes ? file.notes.length : 0;
        const item = document.createElement("div");
        item.className = "tv-file-item";
        item.dataset.fileName = name;
        item.innerHTML = `
          <div class="tv-file-icon">📄</div>
          <div class="tv-file-info">
            <div class="tv-file-name">${escapeHtml(name)}</div>
            <div class="tv-file-meta">${noteCount} note${noteCount !== 1 ? "s" : ""} · Created ${formatDate(file.createdAt)}</div>
          </div>
        `;
        item.addEventListener("click", () => selectFile(name, item));
        container.appendChild(item);
      });
    });
  }

  // ─── Select a File ──────────────────────────────────────────────────────
  function selectFile(name, element) {
    selectedFile = name;

    // Update UI
    document.querySelectorAll(".tv-file-item").forEach((el) => el.classList.remove("tv-selected"));
    element.classList.add("tv-selected");

    const saveBtn = document.getElementById("tv-save-btn");
    saveBtn.disabled = false;
    saveBtn.textContent = `Save to "${name}"`;
  }

  // ─── Create New File ───────────────────────────────────────────────────
  function handleCreateFile() {
    const input = document.getElementById("tv-new-file-input");
    const name = input.value.trim();
    if (!name) return;

    chrome.runtime.sendMessage({ action: "createFile", fileName: name }, (result) => {
      if (result.success) {
        input.value = "";
        loadFileList();
        // Auto-select the new file after a brief delay for DOM update
        setTimeout(() => {
          const items = document.querySelectorAll(".tv-file-item");
          items.forEach((item) => {
            if (item.dataset.fileName === name) {
              selectFile(name, item);
            }
          });
        }, 100);
      } else {
        showToast("⚠️", result.error || "File already exists");
      }
    });
  }

  // ─── Save Note ──────────────────────────────────────────────────────────
  function handleSave() {
    if (!selectedFile) return;

    const headingInput = document.getElementById("tv-heading-input");
    const heading = headingInput.value.trim();
    if (!heading) {
      headingInput.focus();
      headingInput.style.borderColor = "rgba(233, 69, 96, 0.8)";
      headingInput.style.boxShadow = "0 0 0 3px rgba(233, 69, 96, 0.2)";
      headingInput.setAttribute("placeholder", "⚠ Please enter a heading!");
      return;
    }

    const note = {
      text: selectedText,
      url: currentUrl,
      pageTitle: currentTitle,
      heading: heading
    };

    chrome.runtime.sendMessage({ action: "saveNote", fileName: selectedFile, note }, (result) => {
      if (result.success) {
        removeDialog();
        showToast("✅", `Saved to "${selectedFile}" (${result.noteCount} notes)`);
      } else {
        showToast("❌", "Failed to save note");
      }
    });
  }

  // ─── Remove Dialog ──────────────────────────────────────────────────────
  function removeDialog() {
    if (dialog) {
      dialog.classList.remove("tv-visible");
      overlay.classList.remove("tv-visible");
      setTimeout(() => {
        dialog?.remove();
        overlay?.remove();
        dialog = null;
        overlay = null;
        selectedFile = null;
      }, 300);
    }
  }

  // ─── Toast Notification ─────────────────────────────────────────────────
  function showToast(icon, message) {
    // Remove existing toast
    const existing = document.getElementById("textvault-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "textvault-toast";
    toast.innerHTML = `
      <span class="tv-toast-icon">${icon}</span>
      <span>${escapeHtml(message)}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("tv-visible"));

    setTimeout(() => {
      toast.classList.remove("tv-visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── Utility Functions ──────────────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function truncate(str, max) {
    return str.length > max ? str.substring(0, max) + "…" : str;
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
})();
