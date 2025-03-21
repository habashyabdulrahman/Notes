// استرجاع النوتات من local storage عند تحميل الصفحة
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function addNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title && content) {
        const note = { title, content };
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
        displayNotes();
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
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
            <h3>${note.title}</h3>
            <hr>
            <p>${note.content}</p>
            <div class="actions">
            <button onclick="shareNoteTelegram(${index})">
                <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                        >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
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

function shareNoteTelegram(index) {
    const note = notes[index];
    const text = `${note.title}\n\n${note.content}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
}

// عرض النوتات عند تحميل الصفحة
displayNotes();
