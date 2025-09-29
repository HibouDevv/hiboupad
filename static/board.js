document.addEventListener("DOMContentLoaded", () => {
  // boardId is defined in the template
  if (!boardId) {
    window.location.href = "/dashboard";
    return;
  }

  let notes = [];

  const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200'];
  let selectedColor = colors[Math.floor(Math.random() * colors.length)];

  async function loadNotes() {
    try {
      const response = await fetch(`/api/boards/${boardId}/notes`);
      notes = await response.json();
      renderNotes();
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  const notesGrid = document.getElementById('notesGrid');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const addNoteModal = document.getElementById('addNoteModal');
  const quickNoteForm = document.getElementById('quickNoteForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const colorSelector = document.getElementById('colorSelector');

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
        <p class="text-sm text-gray-600 mb-2">By: ${note.author}</p>
        <div class="flex items-center mb-4">
          <div class="flex space-x-1 mr-2">
            ${colors.map(color => `<button class="colorBtn w-6 h-6 rounded-full ${color} border-2 border-gray-300" data-id="${note.id}" data-color="${color}"></button>`).join('')}
          </div>
          <button class="deleteBtn bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" data-id="${note.id}">Delete</button>
        </div>
      `;
      notesGrid.appendChild(noteDiv);
    });

    // Add event listeners for color change buttons
    document.querySelectorAll('.colorBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        const newColor = e.target.dataset.color;
        try {
          const response = await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: newColor })
          });
          if (response.ok) {
            const note = notes.find(n => n.id === id);
            if (note) note.color = newColor;
            renderNotes();
          }
        } catch (error) {
          console.error('Error updating color:', error);
        }
      });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        if (confirm('Are you sure you want to delete this note?')) {
          try {
            const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
            if (response.ok) {
              notes = notes.filter(n => n.id !== id);
              renderNotes();
            }
          } catch (error) {
            console.error('Error deleting note:', error);
          }
        }
      });
    });
  }

  addNoteBtn.addEventListener('click', () => {
    selectedColor = colors[Math.floor(Math.random() * colors.length)];
    populateColorSelector();
    addNoteModal.classList.remove('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    addNoteModal.classList.add('hidden');
  });

  quickNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('quickTitle').value || 'Untitled';
    const content = document.getElementById('quickContent').value || 'No content';
    try {
      const response = await fetch(`/api/boards/${boardId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, color: selectedColor })
      });
      if (response.ok) {
        const newNote = await response.json();
        notes.push(newNote);
        quickNoteForm.reset();
        addNoteModal.classList.add('hidden');
        renderNotes();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  });

  loadNotes();
});
