document.addEventListener("DOMContentLoaded", () => {
  const boardsList = document.getElementById('boardsList');
  const createBoardBtn = document.getElementById('createBoardBtn');

  let boards = [];

  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = message;
    notification.className = `fixed top-6 right-6 text-white px-4 py-2 rounded shadow-lg ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    notification.classList.remove('hidden');
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }

  async function renderBoards() {
    try {
      const response = await fetch('/api/boards');
      boards = await response.json();
      boardsList.innerHTML = '';
      boards.forEach(board => {
        const boardDiv = document.createElement('div');
        boardDiv.className = 'bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-200 hover:-translate-y-1';
        boardDiv.innerHTML = `
          <h3 class="text-2xl font-bold mb-4 text-gray-800">${board.name}</h3>
          <div class="flex space-x-2">
            <a href="/board?id=${board.id}" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200">Open Board</a>
            <button class="editBtn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors duration-200" data-id="${board.id}">Edit</button>
            <button class="deleteBtn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200" data-id="${board.id}">Delete</button>
          </div>
        `;
        boardsList.appendChild(boardDiv);
      });
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  }

  createBoardBtn.addEventListener('click', async () => {
    const name = prompt('Enter board name:');
    if (name) {
      try {
        const response = await fetch('/api/boards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
        if (response.ok) {
          renderBoards();
          showNotification('Board created successfully');
        } else {
          showNotification('Error creating board', 'error');
        }
      } catch (error) {
        console.error('Error creating board:', error);
        showNotification('Error creating board', 'error');
      }
    }
  });

  // Event delegation for edit and delete
  boardsList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('editBtn')) {
      const id = parseInt(e.target.dataset.id);
      const board = boards.find(b => b.id === id);
      if (board) {
        const newName = prompt('Enter new name:', board.name);
        if (newName) {
          try {
            const response = await fetch(`/api/boards/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: newName }),
            });
            if (response.ok) {
              renderBoards();
              showNotification('Board updated successfully');
            } else {
              showNotification('Error updating board', 'error');
            }
          } catch (error) {
            console.error('Error updating board:', error);
            showNotification('Error updating board', 'error');
          }
        }
      }
    } else if (e.target.classList.contains('deleteBtn')) {
      const id = parseInt(e.target.dataset.id);
      if (confirm('Delete this board?')) {
        try {
          const response = await fetch(`/api/boards/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            renderBoards();
            showNotification('Board deleted successfully');
          } else {
            showNotification('Error deleting board', 'error');
          }
        } catch (error) {
          console.error('Error deleting board:', error);
          showNotification('Error deleting board', 'error');
        }
      }
    }
  });

  renderBoards();
});
