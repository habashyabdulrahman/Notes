// استرجاع النوتات من local storage عند تحميل الصفحة
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let isEditing = false; // متغير لتتبع حالة التعديل
let editIndex = null; // متغير لتخزين الفهرس أثناء التعديل

function handleAddOrEdit() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (title && content) {
    if (isEditing) {
      // إذا كان في وضع التعديل، قم بتحديث النوتة
      notes[editIndex].title = title;
      notes[editIndex].content = content;
      isEditing = false; // الخروج من وضع التعديل
      editIndex = null; // إعادة تعيين الفهرس
    } else {
      // إذا كان في وضع الإضافة، قم بإضافة نوتة جديدة
      const note = { title, content };
      notes.push(note);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    document.getElementById("addButtonText").textContent = "ADD"; // إعادة تعيين النص إلى "ADD"
  } else {
    alert("الرجاء إدخال عنوان ومحتوى للنوتة.");
  }
}

function displayNotes() {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
      <h3>
        ${note.title}
        <div class="note-actions">
          <button class="edit" onclick="startEdit(${index})">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="delete" onclick="deleteNote(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415z"></path>
            </svg>
          </button>
        </div>
      </h3>
      <hr>
      <p>${note.content}</p>
      <div class="actions">
        <button class="btn" onclick="shareNoteTelegram(${index})">
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
              </svg>
            </div>
          </div>
          <span>Telegram</span>
        </button>
      </div>
    `;
    notesList.appendChild(noteElement);
  });
}

function startEdit(index) {
  // نقل محتوى النوتة إلى حقلي الإدخال
  document.getElementById("title").value = notes[index].title;
  document.getElementById("content").value = notes[index].content;

  // تغيير نص الزر إلى "Edit"
  document.getElementById("addButtonText").textContent = "Edit";

  // تفعيل وضع التعديل
  isEditing = true;
  editIndex = index;
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function shareNoteTelegram(index) {
  const note = notes[index];
  const text = `${note.title}\n\n${note.content}`;
  const url = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

// عرض النوتات عند تحميل الصفحة
displayNotes();
