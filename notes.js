
//New Note Field
const showNewButton = document.getElementById('showNew');
const newNoteClass = document.getElementById('newNoteInput');
showNewButton.addEventListener('click', function () {
    if (newNoteClass.style.display === 'block') {
        newNoteClass.style.display = 'none';
    } else {
        newNoteClass.style.display = 'block';
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const editableFields = document.querySelectorAll('.editable-field');
    editableFields.forEach(field => {
        field.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const { selectionStart, selectionEnd } = this;
                this.value = this.value.substring(0, selectionStart) + '\t' + this.value.substring(selectionEnd);
                this.selectionStart = this.selectionEnd = selectionStart + 1;
            }
        });
    });
});

//List of Notes
function createTemplate1(note) {

    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const template = document.querySelector('#noteTemplate');
    const templateClone = template.content.cloneNode(true);
    templateClone.querySelector('article').setAttribute('id', note.number);
    const title = templateClone.querySelector('h1');
    title.textContent = note.title;
    const divDateCreated = templateClone.querySelector('#created');
    divDateCreated.textContent = dateCreated;
    const divDateModified = templateClone.querySelector('#modified');
    divDateModified.textContent = dateModified;
    const noteText = templateClone.querySelector('#content');
    noteText.textContent = note.text;
    const backButton = templateClone.querySelector('#backButton');
    const deleteButton = templateClone.querySelector('#deleteButton');
    const editButton = templateClone.querySelector('#editButton');
    backButton.classList.add('hide');
    deleteButton.classList.add('hide');
    editButton.classList.add('hide');

    return templateClone;
}

//Show one note
function switchToOneNote(noteId) {
    const templateDiv = document.getElementById(noteId);
    const backButton = templateDiv.querySelector('#backButton');
    const deleteButton = templateDiv.querySelector('#deleteButton');
    const editButton = templateDiv.querySelector('#editButton');
    backButton.classList.remove('hide');
    deleteButton.classList.remove('hide');
    editButton.classList.remove('hide');
    backButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        loadNotes();
    });
    deleteButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        deleteNote(noteId);
        loadNotes();
    });
    editButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        editNote(noteId);
    })
    templateDiv.classList.remove('template1');
    templateDiv.classList.add('template2');

}

function loadOneNote(noteId) {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const note = Notes[noteIndex];
    const template1 = createTemplate1(note);
    noteContainer.prepend(template1);
    switchToOneNote(noteId);
}

//Save Note
function saveNote() {
    event.preventDefault();
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteText = document.getElementById('note').value;
    const currentDate = new Date();
    const noteTitle = document.getElementById('title').value;
    if (noteText == '' || noteTitle == '') { return; }
    const newNote = {
        number: Notes.length,
        created: currentDate,
        lastModified: currentDate,
        title: noteTitle,
        text: noteText
    };
    Notes.push(newNote)
    localStorage.setItem('notes', JSON.stringify(Notes));
    document.getElementById('title').value = "";
    document.getElementById('note').value = "";
}


const saveButton = document.getElementById('newNote');
saveButton.addEventListener('click', saveNote);
saveButton.addEventListener('click', loadNotes);

//Date format
let currentDate = new Date();

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes} hours`;
}



//Delete Note
function deleteNote(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const index = Notes.findIndex(note => note.number === parseInt(noteId));
    if (index !== -1) {
        Notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(Notes));

    }

}



//Edit Note
function editNote(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const note = Notes[noteIndex];
    const noteContainer = document.getElementById('noteContainer');
    noteContainer.innerHTML = '';
    const editForm = document.createElement('form');
    const editTitleInput = document.createElement('input');
    editTitleInput.type = 'text';
    editTitleInput.id = 'editTitle';
    editTitleInput.value = note.title;
    editForm.appendChild(editTitleInput);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(document.createElement('br'));
    const editNoteTextarea = document.createElement('textarea');
    editNoteTextarea.value = note.text;
    editNoteTextarea.id = 'editNote';
    editNoteTextarea.classList.add('editable-field');
    editNoteTextarea.textContent = note.text;
    editForm.appendChild(editNoteTextarea);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(document.createElement('br'));
    const saveEditButton = document.createElement('button');
    saveEditButton.type = 'button';
    saveEditButton.id = 'saveEdit';
    saveEditButton.textContent = 'Save Changes';
    saveEditButton.addEventListener('click', function () {
        saveEditedNote(note.number);
    });
    editForm.appendChild(saveEditButton);
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.id = 'back';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', function () {
        loadNotes();
    });
    editForm.appendChild(backButton);
    noteContainer.appendChild(editForm);
    const editableField = document.getElementById('editNote');
    editableField.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = this;
            this.value = this.value.substring(0, selectionStart) + '\t' + this.value.substring(selectionEnd);
            this.selectionStart = this.selectionEnd = selectionStart + 1;
        }
    });

}

function saveEditedNote(noteId) {
    const storedNotes = localStorage.getItem('notes');
    let Notes = JSON.parse(storedNotes);
    const noteIndex = Notes.findIndex(item => item.number === parseInt(noteId));
    const editTitle = document.getElementById('editTitle').value;
    const editNote = document.getElementById('editNote').value;
    if (noteIndex !== -1) {
        Notes[noteIndex].title = editTitle;
        Notes[noteIndex].text = editNote;
        Notes[noteIndex].lastModified = new Date();
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes();
    }
}



//JSON load notes
function loadNotes() {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    const fragment = document.createDocumentFragment();
    if (storedNotes) {
        let Notes = JSON.parse(storedNotes);
        for (const key in Notes) {
            if (Notes.hasOwnProperty(key)) {
                const note = Notes[key];
                const template1 = createTemplate1(note);
                fragment.prepend(template1);
            }
        }
    };
    noteContainer.append(fragment);
    noteContainer.addEventListener('click', event => {
        const clickedElement = event.target;
        const note = clickedElement.closest('article');
        if (note) {
            loadOneNote(note.id)
        }
    })
}


//Initialize App
function initializeApp() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {

    } else {
        let Notes = [{
            "number": 0,
            "created": currentDate,
            "lastModified": currentDate,
            "title": "Note one",
            "text": "Welcome to Note App"
        }];
        localStorage.setItem('notes', JSON.stringify(Notes));
    }
    loadNotes();
}

initializeApp()
