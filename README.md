# 📌 TextVault — Highlight & Save Notes

**TextVault** is a Chrome extension that lets you highlight any text on the web, tag it with a custom heading, and save it into organized files (notebooks) — all while preserving the source URL, page title, and timestamp. Think of it as your personal web clipping tool, right inside your browser.

---

## 🎯 Why TextVault?

While browsing the web — reading articles, research papers, documentation, or social media — you often come across text you'd like to save for later. TextVault makes this effortless:

- **No copy-paste hassle** — just highlight, right-click, and save.
- **Source tracking** — every note automatically records where it came from.
- **Organized notebooks** — group related notes into named files.
- **Heading support** — label each note so you remember why you saved it.
- **Export to .txt** — download your notes as clean, formatted text files.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖱️ **Right-Click to Save** | Highlight any text on a webpage → right-click → "📌 Save to TextVault" |
| 🏷️ **Custom Headings** | Every note requires a heading so your notes are always labeled |
| 📁 **Multiple Files** | Create multiple files (notebooks) to organize notes by topic |
| 📂 **File Selection** | When saving, choose from existing files or create a new one on the spot |
| 🔍 **Search & Filter** | Search across all notes by text, heading, URL, or file name |
| 📥 **Export as .txt** | Export any file as a beautifully formatted text document |
| 🗑️ **Delete Notes/Files** | Remove individual notes or entire files when no longer needed |
| 🔗 **Source URLs** | Every note stores the full URL and page title of its source |
| 🕐 **Timestamps** | Know exactly when each note was saved |
| 🌙 **Dark Theme UI** | Premium dark interface with smooth animations |

---

## 🚀 Installation

### Step 1 — Download or Clone

Download the extension files to a folder on your computer. The folder should contain:

```
Assignment-1/
├── manifest.json
├── background.js
├── content.js
├── content.css
├── popup.html
├── popup.js
├── popup.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Step 2 — Open Chrome Extensions Page

1. Open Google Chrome.
2. In the address bar, type `chrome://extensions/` and press **Enter**.

### Step 3 — Enable Developer Mode

1. In the top-right corner of the Extensions page, toggle **Developer mode** to **ON**.

### Step 4 — Load the Extension

1. Click the **"Load unpacked"** button (appears after enabling Developer mode).
2. Browse to and select the `Assignment-1` folder.
3. Click **"Select Folder"**.

### Step 5 — Pin the Extension (Recommended)

1. Click the **puzzle piece icon** 🧩 in Chrome's toolbar (top-right).
2. Find **"TextVault — Highlight & Save Notes"** in the list.
3. Click the **pin icon** 📌 next to it so it's always visible in your toolbar.

✅ **Done!** TextVault is now installed and ready to use.

---

## 📖 How to Use

### 1. Saving Highlighted Text

This is the core workflow — saving any text you find on the web.

**Steps:**

1. **Navigate** to any webpage (article, blog, documentation, social media, etc.).
2. **Highlight** the text you want to save by clicking and dragging your mouse over it.
3. **Right-click** on the highlighted text.
4. Click **"📌 Save to TextVault"** from the context menu.

A floating dialog will appear in the center of the page:

- **Text Preview** — shows a preview of what you highlighted.
- **Source URL** — automatically captured from the page.
- **Note Heading** — *(required)* type a descriptive heading for this note (e.g., "Key takeaway from research", "Python syntax tip", etc.).
- **File Selection** — choose an existing file to save into, OR create a new file.

5. **Enter a heading** for your note.
6. **Select a file** from the list (it will highlight in red when selected).
7. Click the **"Save to [filename]"** button.

A toast notification at the bottom-right confirms the save. ✅

---

### 2. Creating a New File

Files act as notebooks — you can create as many as you need to organize notes by topic.

**From the Save Dialog (while saving a note):**

1. At the bottom of the save dialog, type a name in the **"New file name..."** input.
2. Click **"+ Create"** or press **Enter**.
3. The new file appears in the list and is ready to be selected.

**From the Popup (extension icon):**

1. Click the **TextVault icon** in your Chrome toolbar.
2. Go to the **📁 Files** tab.
3. Type a name in the **"New file name..."** input.
4. Click **"+ Create"**.

---

### 3. Viewing Your Notes

1. Click the **TextVault icon** 📌 in your Chrome toolbar to open the popup.
2. The **📝 Notes** tab shows all your saved notes, sorted by most recent.

Each note card displays:
- **File badge** — which file the note belongs to (shown in red).
- **Heading** — the title you gave the note (shown in bold).
- **Text** — the highlighted text content.
- **Source link** — click to revisit the original page.
- **Timestamp** — when the note was saved.

---

### 4. Searching & Filtering Notes

The Notes tab includes powerful search and filter tools:

- **Search bar** 🔍 — type to instantly filter notes by text content, heading, URL, or file name.
- **File dropdown** — select a specific file to show only its notes, or choose "All Files" to see everything.

---

### 5. Exporting Notes as a .txt File

You can download any file as a clean, formatted text document.

**Steps:**

1. Click the **TextVault icon** in your toolbar.
2. Go to the **📁 Files** tab.
3. Click the **📥 export button** next to the file you want to export.
4. A "Save As" dialog will appear — choose where to save the `.txt` file.

**Exported file format:**

```
╔════════════════════════════════════════════════════════════╗
║  TextVault — My Research Notes                            ║
║  Exported: 4/8/2026, 3:30:00 PM                          ║
║  Total Notes: 2                                           ║
╚════════════════════════════════════════════════════════════╝

[Note 1 of 2]

Source  : https://example.com/article-about-ai
Page    : Understanding AI — Example Blog
Saved   : Tuesday, April 8, 2026 at 03:15 PM

## Key Insight on Neural Networks

Neural networks are computing systems inspired by biological
neural networks that constitute animal brains. They learn to
perform tasks by considering examples.

────────────────────────────────────────────────────────────

[Note 2 of 2]

Source  : https://docs.python.org/3/tutorial/
Page    : The Python Tutorial — Python 3.x Documentation
Saved   : Tuesday, April 8, 2026 at 03:25 PM

## Python List Comprehension Syntax

List comprehensions provide a concise way to create lists.
The syntax is: [expression for item in iterable if condition]


════════════════════════════════════════════════════════════
End of file — 2 note(s) saved in "My Research Notes"
════════════════════════════════════════════════════════════
```

---

### 6. Deleting Notes & Files

**Delete a single note:**

1. Open the popup → **📝 Notes** tab.
2. Hover over the note card — a **🗑 delete button** appears in the top-right corner.
3. Click it and confirm the deletion.

**Delete an entire file (and all its notes):**

1. Open the popup → **📁 Files** tab.
2. Click the **🗑 delete button** next to the file.
3. Confirm the deletion. ⚠️ This removes all notes inside the file.

---

## 🗂️ Project Structure

```
Assignment-1/
│
├── manifest.json        → Extension configuration (Manifest V3)
├── background.js        → Service worker: context menus, storage, export
├── content.js           → Injected script: floating save dialog on pages
├── content.css          → Styles for the save dialog & toast notifications
├── popup.html           → Popup UI structure (opens from toolbar icon)
├── popup.js             → Popup logic: tabs, search, file management
├── popup.css            → Popup styling: dark theme, animations
├── README.md            → This file
│
└── icons/
    ├── icon16.png       → Toolbar icon (16×16)
    ├── icon48.png       → Extension page icon (48×48)
    └── icon128.png      → Chrome Web Store icon (128×128)
```

### File Responsibilities

| File | Role |
|------|------|
| **manifest.json** | Declares the extension's metadata, permissions (`contextMenus`, `storage`, `activeTab`, `downloads`), and file references. Uses **Manifest V3**. |
| **background.js** | Runs as a **service worker**. Creates the right-click context menu. Handles all CRUD operations (create/read/update/delete) for files and notes using `chrome.storage.local`. Manages `.txt` file export via the Downloads API. |
| **content.js** | **Injected into every webpage**. Listens for the "Save to TextVault" context menu click. Builds and displays the floating save dialog. Handles file selection, new file creation, heading input, and saving. |
| **content.css** | Styles the floating save dialog, heading input, file list, save button, and toast notification. Uses high `z-index` values to appear above all page content. |
| **popup.html** | The HTML structure for the popup that opens when you click the extension icon. Contains two tabs: Notes and Files. |
| **popup.js** | Drives the popup: loads all data from storage, renders note cards and file cards, handles search/filter, create/delete operations, and export triggers. |
| **popup.css** | Styles the popup with a premium dark theme, gradient backgrounds, animated card entries, and responsive scrollable lists. |

---

## 🔧 Technical Details

### Permissions Used

| Permission | Why |
|------------|-----|
| `contextMenus` | Adds the "📌 Save to TextVault" option to the right-click menu |
| `storage` | Persists all notes and files locally using `chrome.storage.local` |
| `activeTab` | Accesses the current tab's URL and title when saving a note |
| `downloads` | Exports files as `.txt` downloads with a "Save As" dialog |

### Data Storage

All data is stored locally in your browser using **`chrome.storage.local`**. No data is sent to any external server. The storage structure:

```json
{
  "textvault_files": {
    "My Research": {
      "createdAt": 1712345678000,
      "notes": [
        {
          "text": "The highlighted text...",
          "url": "https://example.com/page",
          "pageTitle": "Example Page Title",
          "heading": "My Custom Heading",
          "savedAt": 1712345678000
        }
      ]
    }
  }
}
```

### Browser Compatibility

- ✅ **Google Chrome** (version 88+, Manifest V3 support)
- ✅ **Microsoft Edge** (Chromium-based)
- ✅ **Brave Browser**
- ✅ **Opera** (Chromium-based)
- ❌ Firefox (uses a different extension format)

---

## 💡 Tips & Best Practices

1. **Use descriptive headings** — headings like "Important" are less useful than "Python async/await syntax" or "React useEffect cleanup pattern".
2. **Organize by topic** — create separate files for different subjects (e.g., "Machine Learning", "JavaScript Tips", "Research Papers").
3. **Export regularly** — export your files as `.txt` backups so you have copies outside the browser.
4. **Use search** — the popup search bar searches across headings, text, URLs, and file names all at once.
5. **Quick save workflow** — create your files upfront in the Files tab, then saving notes is just: highlight → right-click → heading → click file → save.

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Context menu doesn't appear | Make sure you have text **selected/highlighted** before right-clicking. The menu item only shows for text selections. |
| Save dialog doesn't show | Refresh the webpage and try again. Some pages (like `chrome://` pages) block content scripts. |
| Extension icon missing | Click the puzzle piece icon 🧩 in Chrome's toolbar and pin TextVault. |
| Changes not taking effect | After modifying files, go to `chrome://extensions/` and click the **reload** ↻ button on the TextVault card. |
| Notes not persisting | Check that the `storage` permission is listed in `manifest.json`. Also make sure you're not in Incognito mode (extensions are disabled by default there). |

---

## 📜 License

This project is open-source and free to use for personal and educational purposes.

---

> Built with ❤️ as part of **EAG v3 — Session 1, Assignment 1**
