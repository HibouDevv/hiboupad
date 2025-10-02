document.addEventListener("DOMContentLoaded", () => {
  const boardsList = document.getElementById('boardsList');
  const createBoardBtn = document.getElementById('createBoardBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importInput = document.getElementById('importInput');

  let boards = JSON.parse(localStorage.getItem('boards')) || [];

  function renderBoards() {
    boardsList.innerHTML = '';
    boards.forEach(board => {
      const boardDiv = document.createElement('div');
      boardDiv.className = 'bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-200 hover:-translate-y-1';
      boardDiv.innerHTML = `
        <h3 class="text-2xl font-bold mb-4 text-gray-800">${board.name}</h3>
        <div class="flex space-x-2">
          <a href="./board.html?id=${board.id}" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200">Open Board</a>
          <button class="editBtn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-200" data-id="${board.id}">Edit</button>
          <button class="deleteBtn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200" data-id="${board.id}">Delete</button>
        </div>
      `;
      boardsList.appendChild(boardDiv);
    });
  }

  createBoardBtn.addEventListener('click', () => {
    const name = prompt('Enter board name:');
    if (name) {
      const id = Date.now(); // simple unique id
      boards.push({ id, name, notes: [] });
      localStorage.setItem('boards', JSON.stringify(boards));
      renderBoards();
    }
  });

  exportBtn.addEventListener('click', () => {
    const data = {};
    for (let key in localStorage) {
      data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiboupad-data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', () => {
    importInput.click();
  });

  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          for (let key in data) {
            localStorage.setItem(key, data[key]);
          }
          boards = JSON.parse(localStorage.getItem('boards')) || [];
          renderBoards();
          alert('Data imported successfully!');
        } catch (error) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  });

  // Event delegation for edit and delete
  boardsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('editBtn')) {
      const id = parseInt(e.target.dataset.id);
      const board = boards.find(b => b.id === id);
      if (board) {
        const newName = prompt('Enter new name:', board.name);
        if (newName) {
          board.name = newName;
          localStorage.setItem('boards', JSON.stringify(boards));
          renderBoards();
        }
      }
    } else if (e.target.classList.contains('deleteBtn')) {
      const id = parseInt(e.target.dataset.id);
      if (confirm('Delete this board?')) {
        boards = boards.filter(b => b.id !== id);
        localStorage.setItem('boards', JSON.stringify(boards));
        renderBoards();
      }
    }
  });

  renderBoards();
});
