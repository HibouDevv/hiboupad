document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const boardId = urlParams.get('id');
  // Removed redirect if no boardId to allow direct access
  // if (!boardId) {
  //   window.location.href = "dashboard.html";
  //   return;
  // }

  let boards = JSON.parse(localStorage.getItem('boards')) || [];
  let board = boards.find(b => b.id == boardId);
  // Removed redirect if board not found to allow direct access
  // if (!board) {
  //   window.location.href = "dashboard.html";
  //   return;
  // }

  // If board not found, create a new board with this id
  if (!board) {
    board = { id: boardId, name: "New Board", notes: [] };
    boards.push(board);
    localStorage.setItem('boards', JSON.stringify(boards));
  }

  let notes = board.notes || [];

  const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200'];
  let selectedColor = colors[Math.floor(Math.random() * colors.length)];
  let editingNoteId = null;

  // Assign colors to existing notes if missing
  notes.forEach(note => {
    if (!note.color) {
      note.color = colors[Math.floor(Math.random() * colors.length)];
    }
  });

  const notesGrid = document.getElementById('notesGrid');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const addNoteModal = document.getElementById('addNoteModal');
  const quickNoteForm = document.getElementById('quickNoteForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const colorSelector = document.getElementById('colorSelector');
  const modalTitle = addNoteModal.querySelector('h2');
  const submitBtn = quickNoteForm.querySelector('button[type="submit"]');

  function populateColorSelector() {
    colorSelector.innerHTML = '';
    colors.forEach(color => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `modalColorBtn w-8 h-8 rounded-full ${color} border-2 ${color === selectedColor ? 'border-indigo-500' : 'border-gray-300'}`;
      btn.dataset.color = color;
      colorSelector.appendChild(btn);
    });
  }

  // Event delegation for modal color buttons
  colorSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('modalColorBtn')) {
      selectedColor = e.target.dataset.color;
      populateColorSelector(); // Update borders
    }
  });

  function renderNotes() {
    notesGrid.innerHTML = '';
    notes.forEach(note => {
      const noteDiv = document.createElement('div');
      noteDiv.className = `${note.color} p-6 rounded-lg shadow-lg break-inside-avoid mb-6`;
      noteDiv.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-2">${note.title}</h3>
        <p class="mb-4 text-gray-700">${note.content}</p>
        <div class="flex items-center mb-4">
          <div class="flex space-x-1 mr-2">
            ${colors.map(color => `<button class="colorBtn w-6 h-6 rounded-full ${color} border-2 border-gray-300" data-id="${note.id}" data-color="${color}"></button>`).join('')}
          </div>
          <button class="editBtn bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2" data-id="${note.id}">Edit</button>
          <button class="deleteBtn bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" data-id="${note.id}">Delete</button>
        </div>
      `;
      notesGrid.appendChild(noteDiv);
    });

    // Add event listeners for color change buttons
    document.querySelectorAll('.colorBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const newColor = e.target.dataset.color;
        const note = notes.find(n => n.id === id);
        if (note) {
          note.color = newColor;
          board.notes = notes;
          localStorage.setItem('boards', JSON.stringify(boards));
          renderNotes();
        }
      });
    });

    // Add event listeners for edit buttons
    document.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const note = notes.find(n => n.id === id);
        if (note) {
          document.getElementById('quickTitle').value = note.title;
          document.getElementById('quickContent').value = note.content;
          selectedColor = note.color;
          populateColorSelector();
          modalTitle.textContent = 'Update Note';
          submitBtn.textContent = 'Update Note';
          addNoteModal.classList.remove('hidden');
          editingNoteId = id;
        }
      });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('Are you sure you want to delete this note?')) {
          notes = notes.filter(n => n.id !== id);
          board.notes = notes;
          localStorage.setItem('boards', JSON.stringify(boards));
          renderNotes();
        }
      });
    });
  }

  addNoteBtn.addEventListener('click', () => {
    selectedColor = colors[Math.floor(Math.random() * colors.length)];
    populateColorSelector();
    modalTitle.textContent = 'Add New Note';
    submitBtn.textContent = 'Add Note';
    addNoteModal.classList.remove('hidden');
    editingNoteId = null;
  });

  cancelBtn.addEventListener('click', () => {
    addNoteModal.classList.add('hidden');
    editingNoteId = null;
  });

  quickNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('quickTitle').value.trim() || 'Untitled';
    const content = document.getElementById('quickContent').value.trim() || 'No content';
    if (!title && !content) {
      alert('Please enter a title or content for the note.');
      return;
    }
    if (editingNoteId !== null) {
      // Update existing note
      const note = notes.find(n => n.id === editingNoteId);
      if (note) {
        note.title = title;
        note.content = content;
        note.color = selectedColor;
      }
    } else {
      // Add new note
      const newNote = {
        id: Date.now(),
        title,
        content,
        color: selectedColor
      };
      notes.push(newNote);
    }
    board.notes = notes;
    localStorage.setItem('boards', JSON.stringify(boards));
    quickNoteForm.reset();
    addNoteModal.classList.add('hidden');
    editingNoteId = null;
    renderNotes();
  });

  renderNotes();
});
