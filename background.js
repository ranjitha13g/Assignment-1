// ─── TextVault Background Service Worker ────────────────────────────────────

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "textvault-save",
    title: "📌 Save to TextVault",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "textvault-save" && info.selectionText) {
    // Send message to content script to show the save dialog
    chrome.tabs.sendMessage(tab.id, {
      action: "showSaveDialog",
      text: info.selectionText,
      url: tab.url,
      title: tab.title
    });
  }
});

// Listen for messages from content script / popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getFiles") {
    getFiles().then(sendResponse);
    return true; // async
  }

  if (message.action === "saveNote") {
    saveNote(message.fileName, message.note).then(sendResponse);
    return true;
  }

  if (message.action === "createFile") {
    createFile(message.fileName).then(sendResponse);
    return true;
  }

  if (message.action === "deleteFile") {
    deleteFile(message.fileName).then(sendResponse);
    return true;
  }

  if (message.action === "deleteNote") {
    deleteNote(message.fileName, message.noteIndex).then(sendResponse);
    return true;
  }

  if (message.action === "exportFile") {
    exportFile(message.fileName).then(sendResponse);
    return true;
  }

  if (message.action === "getAllNotes") {
    getAllNotes().then(sendResponse);
    return true;
  }
});

// ─── Storage Helpers ─────────────────────────────────────────────────────────

async function getFiles() {
  const data = await chrome.storage.local.get("textvault_files");
  return data.textvault_files || {};
}

async function saveFiles(files) {
  await chrome.storage.local.set({ textvault_files: files });
}

async function createFile(fileName) {
  const files = await getFiles();
  if (files[fileName]) {
    return { success: false, error: "File already exists" };
  }
  files[fileName] = { notes: [], createdAt: Date.now() };
  await saveFiles(files);
  return { success: true };
}

async function deleteFile(fileName) {
  const files = await getFiles();
  delete files[fileName];
  await saveFiles(files);
  return { success: true };
}

async function saveNote(fileName, note) {
  const files = await getFiles();

  // Auto-create file if it doesn't exist
  if (!files[fileName]) {
    files[fileName] = { notes: [], createdAt: Date.now() };
  }

  files[fileName].notes.push({
    text: note.text,
    url: note.url,
    pageTitle: note.pageTitle || "",
    heading: note.heading || "Untitled",
    savedAt: Date.now()
  });

  await saveFiles(files);
  return { success: true, noteCount: files[fileName].notes.length };
}

async function deleteNote(fileName, noteIndex) {
  const files = await getFiles();
  if (files[fileName] && files[fileName].notes[noteIndex] !== undefined) {
    files[fileName].notes.splice(noteIndex, 1);
    await saveFiles(files);
    return { success: true };
  }
  return { success: false, error: "Note not found" };
}

async function getAllNotes() {
  return await getFiles();
}

async function exportFile(fileName) {
  const files = await getFiles();
  const file = files[fileName];
  if (!file) return { success: false, error: "File not found" };

  let content = ``;
  content += `╔════════════════════════════════════════════════════════════╗\n`;
  content += `║  TextVault — ${fileName.padEnd(44)}║\n`;
  content += `║  Exported: ${new Date().toLocaleString().padEnd(46)}║\n`;
  content += `║  Total Notes: ${String(file.notes.length).padEnd(43)}║\n`;
  content += `╚════════════════════════════════════════════════════════════╝\n\n`;

  file.notes.forEach((note, index) => {
    // Separator between notes
    if (index > 0) {
      content += `\n────────────────────────────────────────────────────────────\n\n`;
    }

    // Note number
    content += `[Note ${index + 1} of ${file.notes.length}]\n\n`;

    // Source link
    content += `Source  : ${note.url}\n`;
    if (note.pageTitle) {
      content += `Page    : ${note.pageTitle}\n`;
    }

    // Date saved
    const savedDate = new Date(note.savedAt);
    const formattedDate = savedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = savedDate.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
    content += `Saved   : ${formattedDate} at ${formattedTime}\n`;

    // Heading
    content += `\n## ${note.heading || "Untitled Note"}\n\n`;

    // Text content
    content += `${note.text}\n`;
  });

  // Footer
  content += `\n\n════════════════════════════════════════════════════════════\n`;
  content += `End of file — ${file.notes.length} note(s) saved in "${fileName}"\n`;
  content += `════════════════════════════════════════════════════════════\n`;

  // Use the downloads API to save the file
  const blob = new Blob([content], { type: "text/plain" });
  const dataUrl = await blobToDataUrl(blob);

  chrome.downloads.download({
    url: dataUrl,
    filename: `TextVault_${fileName.replace(/[^a-zA-Z0-9]/g, "_")}.txt`,
    saveAs: true
  });

  return { success: true };
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
