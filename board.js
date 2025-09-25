document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const boardId = parseInt(urlParams.get('id'));
  if (!boardId) {
    window.location.href = "dashboard.html";
    return;
  }

  let boards = JSON.parse(localStorage.getItem('boards')) || [];
  let board = boards.find(b => b.id === boardId);
  if (!board) {
    window.location.href = "dashboard.html";
    return;
  }

  let notes = board.notes;

  const colors = ['bg-yellow-200', 'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-orange-200'];

  // Assign colors to existing notes if missing
  notes.forEach(note => {
    if (!note.color) {
      note.color = colors[Math.floor(Math.random() * colors.length)];
    }
  });

  const notesGrid = document.getElementById('notesGrid');
  const logoutBtn = document.getElementById('logoutBtn');
  const shareBtn = document.getElementById('shareBtn');
  const backBtn = document.getElementById('backBtn');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const addNoteModal = document.getElementById('addNoteModal');
  const quickNoteForm = document.getElementById('quickNoteForm');
  const cancelBtn = document.getElementById('cancelBtn');

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
          <button class="heartBtn bg-red-500 text-white px-3 py-1 rounded mr-2" data-id="${note.id}">❤️ ${note.hearts}</button>
          ${note.author === currentUser.name ? `<button class="deleteBtn bg-gray-500 text-white px-2 py-1 rounded" data-id="${note.id}">Delete</button>` : ''}
        </div>
        <div class="comments mb-4">
          <h4 class="font-semibold mb-2">Comments:</h4>
          <ul class="mb-2">
            ${note.comments.map(c => `<li class="text-sm">${c.author}: ${c.text}</li>`).join('')}
          </ul>
          <form class="commentForm" data-id="${note.id}">
            <input type="text" placeholder="Add a comment..." required class="border px-2 py-1 mr-2 rounded" />
            <button type="submit" class="bg-indigo-600 text-white px-3 py-1 rounded">Comment</button>
          </form>
        </div>
      `;
      notesGrid.appendChild(noteDiv);
    });

    // Add event listeners for heart buttons
    document.querySelectorAll('.heartBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const note = notes.find(n => n.id === id);
        if (note) {
          note.hearts++;
          board.notes = notes;
          localStorage.setItem('boards', JSON.stringify(boards));
          renderNotes();
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

    // Add event listeners for comment forms
    document.querySelectorAll('.commentForm').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(e.target.dataset.id);
        const text = e.target.querySelector('input').value;
        const note = notes.find(n => n.id === id);
        if (note) {
          note.comments.push({ author: currentUser.name, text });
          board.notes = notes;
          localStorage.setItem('boards', JSON.stringify(boards));
          renderNotes();
        }
      });
    });
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = "dashboard.html";
  });

  shareBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Board link copied to clipboard! Share it with others.');
    }).catch(err => {
      alert('Failed to copy link. Please copy manually: ' + window.location.href);
    });
  });

  backBtn.addEventListener('click', () => {
    window.location.href = "dashboard.html";
  });

  addNoteBtn.addEventListener('click', () => {
    addNoteModal.classList.remove('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    addNoteModal.classList.add('hidden');
  });

  quickNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('quickTitle').value || 'Untitled';
    const content = document.getElementById('quickContent').value || 'No content';
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNote = {
      id: Date.now(),
      title,
      content,
      hearts: 0,
      comments: [],
      author: currentUser.name,
      color: randomColor
    };
    notes.push(newNote);
    board.notes = notes;
    localStorage.setItem('boards', JSON.stringify(boards));
    quickNoteForm.reset();
    addNoteModal.classList.add('hidden');
    renderNotes();
  });

  renderNotes();
});
