let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ─────────────────────────────────────────────
// Migrate old notes structure
// ─────────────────────────────────────────────

notes = notes.map((note) => ({
  id: note.id || crypto.randomUUID(),

  title: note.title || "",

  content: note.content || "",

  tags: Array.isArray(note.tags) ? note.tags : [],

  pinned: note.pinned || false,

  createdAt: note.createdAt || Date.now(),

  updatedAt: note.updatedAt || null,
}));

let isEditing = false;
let editId = null;
let toastTimer = null;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
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

function clearForm() {
  document.getElementById("title").value = "";

  document.getElementById("content").value = "";

  document.getElementById("tags").value = "";

  updateCharCount();
}

// ─────────────────────────────────────────────
// Add / Edit
// ─────────────────────────────────────────────

function handleAddOrEdit() {
  const title = document.getElementById("title").value.trim();

  const content = document.getElementById("content").value.trim();

  const tags = document
    .getElementById("tags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !content) {
    alert("Please enter both title and description.");

    return;
  }

  if (isEditing) {
    const note = notes.find((n) => n.id === editId);

    if (!note) return;

    note.title = title;

    note.content = content;

    note.tags = tags;

    note.updatedAt = Date.now();

    showToast("Note updated");

    exitEditMode();
  } else {
    notes.push({
      id: crypto.randomUUID(),

      title,

      content,

      tags,

      pinned: false,

      createdAt: Date.now(),

      updatedAt: null,
    });

    showToast("Note added");
  }

  saveNotes();

  displayNotes();

  updateNoteCount();

  clearForm();
}

function startEdit(id) {
  const note = notes.find((n) => n.id === id);

  if (!note) return;

  document.getElementById("formCard").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  document.getElementById("title").value = note.title;

  document.getElementById("content").value = note.content;

  document.getElementById("tags").value = (note.tags || []).join(", ");

  updateCharCount();

  document.getElementById("addButtonText").textContent = "SAVE";

  document.getElementById("cancelBtn").style.display = "inline-flex";

  document.getElementById("editBannerText").textContent =
    `Editing "${note.title}"`;

  document.getElementById("editBanner").classList.add("show");

  isEditing = true;

  editId = id;

  displayNotes();
}

function cancelEdit() {
  exitEditMode();

  clearForm();

  displayNotes();
}

function exitEditMode() {
  isEditing = false;

  editId = null;

  document.getElementById("addButtonText").textContent = "ADD";

  document.getElementById("cancelBtn").style.display = "none";

  document.getElementById("editBanner").classList.remove("show");
}

// ─────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────

function confirmDelete(id) {
  const el = document.getElementById(`del-${id}`);

  if (el) {
    el.classList.toggle("show");
  }
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);

  if (isEditing && editId === id) {
    exitEditMode();

    clearForm();
  }

  saveNotes();

  updateNoteCount();

  displayNotes();

  showToast("Note deleted");
}

// ─────────────────────────────────────────────
// Pin
// ─────────────────────────────────────────────

function togglePin(id) {
  const note = notes.find((n) => n.id === id);

  if (!note) return;

  note.pinned = !note.pinned;

  saveNotes();

  displayNotes();

  showToast(note.pinned ? "Pinned note" : "Unpinned note");
}

// ─────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Share
// ─────────────────────────────────────────────

function shareNote(id) {
  const note = notes.find((n) => n.id === id);

  if (!note) return;

  const text = `${note.title}\n\n${note.content}`;

  if (navigator.share) {
    navigator
      .share({
        title: note.title,
        text,
      })
      .catch(() => {});
  } else {
    const url = `https://t.me/share/url?url=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
  }
}

// ─────────────────────────────────────────────
// Display
// ─────────────────────────────────────────────

function displayNotes(query = "") {
  const notesList = document.getElementById("notesList");

  const emptyState = document.getElementById("emptyState");

  const emptySearch = document.getElementById("emptySearch");

  notesList.innerHTML = "";

  const filtered = notes

    .filter((note) => {
      if (!query) return true;

      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.tags || []).some((tag) => tag.toLowerCase().includes(query))
      );
    })

    .sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return b.pinned - a.pinned;
      }

      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    });

  emptyState.style.display = notes.length === 0 ? "block" : "none";

  emptySearch.style.display =
    notes.length > 0 && filtered.length === 0 ? "block" : "none";

  filtered.forEach((note) => {
    const isEditingThis = isEditing && editId === note.id;

    const ts = note.updatedAt || note.createdAt;

    const metaText = note.updatedAt ? `Edited ${timeAgo(ts)}` : timeAgo(ts);

    const noteElement = document.createElement("div");

    noteElement.className =
      "note" +
      (isEditingThis ? " is-editing" : "") +
      (note.pinned ? " pinned" : "");

    noteElement.innerHTML = `

      <h3>

        <span>
          ${note.pinned ? "📌 " : ""}
          ${note.title}
        </span>

        <div class="note-actions">

          <button
            class="pin"
            onclick="togglePin('${note.id}')"
            title="Pin note"
          >
            <i class="fa-solid fa-thumbtack"></i>
          </button>

          <button
            class="edit"
            onclick="startEdit('${note.id}')"
            title="Edit note"
          >
            <i class="fa-solid fa-pen"></i>
          </button>

          <button
            class="delete"
            onclick="confirmDelete('${note.id}')"
            title="Delete note"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

        </div>

      </h3>

      <p class="note-meta">
        ${metaText}
      </p>

      <hr>

      <p class="note-content">
        ${note.content}
      </p>

      ${
        (note.tags || []).length
          ? `
            <div class="tags">

              ${(note.tags || [])
                .map(
                  (tag) => `
                  <span class="tag">
                    ${tag}
                  </span>
                `,
                )
                .join("")}

            </div>
          `
          : ""
      }

      <div
        class="delete-confirm"
        id="del-${note.id}"
      >

        <p>
          Delete this note?
          This can't be undone.
        </p>

        <div class="delete-confirm-actions">

          <button
            class="btn-confirm-del"
            onclick="deleteNote('${note.id}')"
          >
            Yes, delete
          </button>

          <button
            class="btn-confirm-cancel"
            onclick="confirmDelete('${note.id}')"
          >
            Cancel
          </button>

        </div>

      </div>

      <div class="actions">

        <button
          class="share-btn"
          onclick="shareNote('${note.id}')"
        >
          <i class="fa-solid fa-share-nodes"></i>
          Share
        </button>

      </div>
    `;

    notesList.appendChild(noteElement);
  });
}

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────

updateNoteCount();

displayNotes();
