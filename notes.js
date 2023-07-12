//New Note Field
const showNewButton = document.getElementById('showNew');
const newNoteClass = document.getElementById('newsNote');
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

//SaveNote
function saveNote() {
    event.preventDefault();
    const noteText = document.getElementById('note').value;
    const formattedText = JSON.stringify(noteText);
    const currentDate = new Date();
    const noteTitle = document.getElementById('title').value;
    if (noteText == '' || noteTitle == '') { return; }
    const newNote = {
        number: Notes.length,
        created: currentDate,
        lastModified: currentDate,
        title: noteTitle,
        text: formattedText
    };
    Notes.push(newNote)
    localStorage.setItem('notes', JSON.stringify(Notes));
    document.getElementById('title').value = "";
    document.getElementById('note').value = "";
}


const saveButton = document.getElementById('newNote');
saveButton.addEventListener('click', saveNote);
saveButton.addEventListener('click', loadNotes);

//Default Note
let currentDate = new Date();
let Notes = [{
    "created": currentDate,
    "lastModified": currentDate,
    "title": "Note one",
    "text": "Welcome to Note App"
},];

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} at ${hours}:${minutes} hours`;
}

//List of Notes
function createTemplate1(note) {
    const formattedNoteText = note.text.replace(/"/g, '')
        .replace(/\\n/g, '<br>')
        .replace(/\\t/g, '&#9;');
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const template = document.createElement('div');
        template.classList.add('template1');
        template.setAttribute('id',note.number);
    const title = document.createElement('h2');
        title.textContent = note.title;
        template.appendChild(title);
    const createdDateField = document.createElement('div');
        createdDateField.classList.add('datefield');
        createdDateField.innerHTML = `<strong>Created:</strong> ${formatDate(note.created)}`;
        template.appendChild(createdDateField);
    const modifiedDateField = document.createElement('div');
        modifiedDateField.classList.add('datefield');
        modifiedDateField.innerHTML = `<strong>Last Modified:</strong> ${formatDate(note.lastModified)}`;
        template.appendChild(modifiedDateField);
    const noteText = document.createElement('p');
        noteText.innerHTML = formattedNoteText;
        template.appendChild(noteText);

    return template;
}

//One note
function createTemplate2(note) {
    if (newNoteClass.style.display === 'block') {
        newNoteClass.style.display = 'none';
    }
    const formattedNoteText = note.text.replace(/"/g, '')
        .replace(/\\n/g, '<br>')
        .replace(/\\t/g, '&#9;');
    const dateCreated = formatDate(note.created);
    const dateModified = formatDate(note.lastModified);
    const template = document.createElement('div');
    template.classList.add('template2');
    const title = document.createElement('h2');
        title.textContent = note.title;
        template.appendChild(title);
    const createdDateField = document.createElement('div');
        createdDateField.classList.add('datefield');
        createdDateField.innerHTML = `<strong>Created:</strong> ${formatDate(note.created)}`;
        template.appendChild(createdDateField);
    const modifiedDateField = document.createElement('div');
        modifiedDateField.classList.add('datefield');
        modifiedDateField.innerHTML = `<strong>Last Modified:</strong> ${formatDate(note.lastModified)}`;
        template.appendChild(modifiedDateField);
    const noteText = document.createElement('p');
        noteText.innerHTML = formattedNoteText;
        template.appendChild(noteText);
    const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.textContent = 'Back to List';
        backLink.setAttribute('id','backLink');
        template.appendChild(backLink);
        template.appendChild(document.createElement('br'));
        template.appendChild(document.createElement('br'));
    const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete Note';
        deleteButton.id = 'deletethisNote';
        template.appendChild(deleteButton);
    const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit Note';
        editButton.id = 'editElement';
        template.appendChild(editButton);
    
    return template;
}

//Delete Note
function deleteNote(noteId) {
    const index = Notes.findIndex(note => note.number === noteId);
    if (index !== -1) {
        Notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes();
    }
}

//Navigation to single note
function navigateToItem(note) {
    const noteContainer = document.getElementById('noteContainer');
    noteContainer.innerHTML = '';
    const template2 = createTemplate2(note);
    noteContainer.appendChild(template2);
    const backLink = document.getElementById('backLink');
    backLink.addEventListener('click', function (event) {
        event.preventDefault();
        loadNotes();
    });
    const deleteButton = document.getElementById('deletethisNote');
    deleteButton.addEventListener('click', function () {
        deleteNote(note.number)
    });
    const editButton = document.getElementById('editElement');
    editButton.addEventListener('click', function () {
        editNote(note);
    });
}

//Edit Note
function editNote(note) {
    const noteContainer = document.getElementById('noteContainer');
    noteContainer.innerHTML = '';
    const formattedText = note.text.replace(/"/g, '')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '&#9;');
    const editForm = document.createElement('form');
    const editTitleInput = document.createElement('input');
        editTitleInput.type = 'text';
        editTitleInput.id = 'editTitle';
        editTitleInput.value = note.title;
        editForm.appendChild(editTitleInput);
        editForm.appendChild(document.createElement('br'));
        editForm.appendChild(document.createElement('br'));
    const editNoteTextarea = document.createElement('textarea');
        editNoteTextarea.value = formattedText;
        editNoteTextarea.id = 'editNote';
        editNoteTextarea.classList.add('editable-field');
        editNoteTextarea.textContent = formattedText;
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
    const editTitle = document.getElementById('editTitle').value;
    const editNote = document.getElementById('editNote').value;
    const formattedText = JSON.stringify(editNote);
    const index = Notes.findIndex(note => note.number === noteId);
    if (index !== -1) {
        Notes[index].title = editTitle;
        Notes[index].text = formattedText;
        Notes[index].lastModified = new Date();
        localStorage.setItem('notes', JSON.stringify(Notes));
        loadNotes();
    }
}

//Template 1 click
function noteClick(note) {
    return function () {
        navigateToItem(note);
    }
}

//JSON load notes
function loadNotes() {
    const noteContainer = document.getElementById('noteContainer')
    noteContainer.innerHTML = '';
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        Notes = JSON.parse(storedNotes);
    }

    for (const key in Notes) {
        if (Notes.hasOwnProperty(key)) {
            const note = Notes[key];
            const template1 = createTemplate1(note);
            template1.addEventListener('click', noteClick(note));
            noteContainer.prepend(template1);
        }
    }
}

//Initialize App
function initializeApp() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        Notes = JSON.parse(storedNotes);
    } else {
        Notes = [{
            "number": 0,
            "created": currentDate,
            "lastModified": currentDate,
            "title": "Note one",
            "text": "Welcome to Note App"
        }];
        localStorage.setItem('notes', JSON.stringify(Notes));
    }
    console.log(Notes.length);
    loadNotes();
}

initializeApp()
