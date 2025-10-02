// dashboard.js - uses localStorage for boards and export/import JSON functionality

document.addEventListener('DOMContentLoaded', () => {
  const boardsContainer = document.getElementById('boardsContainer');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importInput = document.getElementById('importInput');

  function getBoards() {
    const boards = localStorage.getItem('boards');
    return boards ? JSON.parse(boards) : [];
  }

  function saveBoards(boards) {
    localStorage.setItem('boards', JSON.stringify(boards));
  }

  function renderBoards() {
    const boards = getBoards();
    boardsContainer.innerHTML = '';
    if (boards.length === 0) {
      boardsContainer.innerHTML = '<p class="text-gray-600">No boards yet. Create one!</p>';
      return;
    }
    boards.forEach(board => {
      const boardEl = document.createElement('div');
      boardEl.className = 'bg-white p-4 rounded shadow cursor-pointer hover:bg-indigo-50';
      boardEl.textContent = board.name;
      boardEl.addEventListener('click', () => {
        window.location.href = `/board?id=${board.id}`;
      });
      boardsContainer.appendChild(boardEl);
    });
  }

  exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(getBoards(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiboupad_boards.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', () => {
    importInput.click();
  });

  importInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBoards = JSON.parse(e.target.result);
        if (Array.isArray(importedBoards)) {
          saveBoards(importedBoards);
          renderBoards();
          alert('Boards imported successfully!');
        } else {
          alert('Invalid JSON format.');
        }
      } catch (err) {
        alert('Error reading JSON file.');
      }
    };
    reader.readAsText(file);
  });

  renderBoards();
});
