let notes = JSON.parse(localStorage.getItem("notes")) || [];
let isEditing = false;
let editIndex = null;
let toastTimer = null;

// ── Helpers ────────────────────────────────────────────────

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function timeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m > 1 ? "s" : ""} ago`;
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function updateCharCount() {
  const val = document.getElementById("title").value;
  const el = document.getElementById("charCount");
  el.textContent = `${val.length} / 60`;
  el.className = "char-count" + (val.length > 50 ? " warn" : "");
}

function updateNoteCount() {
  const count = notes.length;
  document.getElementById("noteCount").textContent =
    count === 1 ? "1 note" : `${count} notes`;
}

// ── Add / Edit ──────────────────────────────────────────────

function handleAddOrEdit() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("Please enter both a title and description.");
    return;
  }

  if (isEditing) {
    notes[editIndex].title = title;
    notes[editIndex].content = content;
    notes[editIndex].updatedAt = Date.now();
    showToast("Note updated");
    exitEditMode();
  } else {
    notes.push({ title, content, createdAt: Date.now() });
    showToast("Note added");
  }

  saveNotes();
  displayNotes();
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  updateCharCount();
  updateNoteCount();
}

function startEdit(index) {
  // Scroll form into view
  document
    .getElementById("formCard")
    .scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("title").value = notes[index].title;
  document.getElementById("content").value = notes[index].content;
  updateCharCount();

  document.getElementById("addButtonText").textContent = "SAVE";
  document.getElementById("cancelBtn").style.display = "inline-flex";

  const banner = document.getElementById("editBanner");
  document.getElementById("editBannerText").textContent =
    `Editing "${notes[index].title}"`;
  banner.classList.add("show");

  isEditing = true;
  editIndex = index;

  // Highlight the note being edited
  displayNotes();
}

function cancelEdit() {
  exitEditMode();
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  updateCharCount();
  displayNotes();
}

function exitEditMode() {
  isEditing = false;
  editIndex = null;
  document.getElementById("addButtonText").textContent = "ADD";
  document.getElementById("cancelBtn").style.display = "none";
  document.getElementById("editBanner").classList.remove("show");
}

// ── Delete ──────────────────────────────────────────────────

function confirmDelete(index) {
  // Toggle inline confirm for the note
  const existing = document.getElementById(`del-${index}`);
  if (existing) {
    existing.classList.toggle("show");
  }
}

function deleteNote(index) {
  notes.splice(index, 1);

  if (isEditing && editIndex === index) {
    exitEditMode();
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    updateCharCount();
  } else if (isEditing && editIndex > index) {
    editIndex--;
  }

  saveNotes();
  updateNoteCount();
  displayNotes();
  showToast("Note deleted");
}

// ── Search ──────────────────────────────────────────────────

function filterNotes() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  document.getElementById("clearSearch").style.display = q ? "flex" : "none";
  displayNotes(q);
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("clearSearch").style.display = "none";
  displayNotes();
}

// ── Display ─────────────────────────────────────────────────

function displayNotes(query = "") {
  const notesList = document.getElementById("notesList");
  const emptyState = document.getElementById("emptyState");
  const emptySearch = document.getElementById("emptySearch");
  notesList.innerHTML = "";

  const filtered = notes.filter((n) => {
    if (!query) return true;
    return (
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query)
    );
  });

  emptyState.style.display = notes.length === 0 ? "block" : "none";
  emptySearch.style.display =
    notes.length > 0 && filtered.length === 0 ? "block" : "none";

  filtered.forEach((note, filteredIndex) => {
    // Find real index in notes array
    const realIndex = notes.indexOf(note);
    const isEditingThis = isEditing && editIndex === realIndex;
    const ts = note.updatedAt || note.createdAt;
    const metaText = note.updatedAt ? `Edited ${timeAgo(ts)}` : timeAgo(ts);

    const noteElement = document.createElement("div");
    noteElement.className = "note" + (isEditingThis ? " is-editing" : "");
    noteElement.innerHTML = `
      <h3>
        <span>${note.title}</span>
        <div class="note-actions">
          <button class="edit" onclick="startEdit(${realIndex})" title="Edit note">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="delete" onclick="confirmDelete(${realIndex})" title="Delete note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415z"></path>
            </svg>
          </button>
        </div>
      </h3>
      ${ts ? `<p class="note-meta">${metaText}</p>` : ""}
      <hr>
      <p>${note.content}</p>
      <div class="delete-confirm" id="del-${realIndex}">
        <p>Delete this note? This can't be undone.</p>
        <div class="delete-confirm-actions">
          <button class="btn-confirm-del" onclick="deleteNote(${realIndex})">Yes, delete</button>
          <button class="btn-confirm-cancel" onclick="confirmDelete(${realIndex})">Cancel</button>
        </div>
      </div>
      <div class="actions">
        <button class="share-btn" onclick="shareNote(${realIndex})">
          <i class="fa-solid fa-share-nodes"></i>
          Share
        </button>
      </div>
    `;
    notesList.appendChild(noteElement);
  });
}

// ── Share ───────────────────────────────────────────────────

function shareNote(index) {
  const note = notes[index];
  const text = `${note.title}\n\n${note.content}`;

  if (navigator.share) {
    navigator.share({ title: note.title, text }).catch(() => {});
  } else {
    // Fallback: Telegram
    const url = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }
}

// ── Init ────────────────────────────────────────────────────

updateNoteCount();
displayNotes();
