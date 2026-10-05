let notes = [];

function loadNotes() {
    const saved = localStorage.getItem('myNotes');
    if (saved) {
        notes = JSON.parse(saved);
    }
    renderNotes();
}

function saveNotes() {
    localStorage.setItem('myNotes', JSON.stringify(notes));
}

function renderNotes() {
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    if (notes.length === 0) {
        list.innerHTML = '<div class="empty-message">Пока пусто...<span>Добавь первую заметку!</span></div>';
        return;
    }

    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.dataset.index = index;

        noteDiv.innerHTML = `
            <div class="note-text">${escapeHtml(note.text)}</div>
            <div class="note-actions">
                <button class="edit-btn" onclick="startEdit(${index})">Редактировать</button>
                <button class="delete-btn" onclick="deleteNote(${index})">Удалить</button>
            </div>
        `;

        list.appendChild(noteDiv);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('addBtn').addEventListener('click', function() {
    const input = document.getElementById('noteInput');
    const text = input.value.trim();

    if (text === '') {
        alert('Напиши хоть что-нибудь!');
        return;
    }

    notes.unshift({ text: text });
    saveNotes();
    renderNotes();
    input.value = '';
});

function deleteNote(index) {
    if (confirm('Точно стереть эту заметку?')) {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
    }
}

function startEdit(index) {
    const noteDiv = document.querySelector(`.note[data-index="${index}"]`);
    const note = notes[index];

    noteDiv.innerHTML = `
        <textarea class="edit-textarea">${escapeHtml(note.text)}</textarea>
        <div class="note-actions">
            <button class="save-btn" onclick="saveEdit(${index})">Сохранить</button>
            <button class="cancel-btn" onclick="renderNotes()">Отмена</button>
        </div>
    `;
}

function saveEdit(index) {
    const noteDiv = document.querySelector(`.note[data-index="${index}"]`);
    const textarea = noteDiv.querySelector('.edit-textarea');
    const newText = textarea.value.trim();

    if (newText === '') {
        alert('Заметка не может быть пустой!');
        return;
    }

    notes[index].text = newText;
    saveNotes();
    renderNotes();
}

loadNotes();