import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE = 'hiboupad.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS boards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                board_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                author TEXT NOT NULL,
                color TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (board_id) REFERENCES boards (id)
            )
        ''')

class User:
    def __init__(self, id, name, email, password_hash):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_active(self):
        return True

    def get_id(self):
        return str(self.id)

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

def get_user_by_email(email):
    with get_db() as conn:
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        if user:
            return User(user['id'], user['name'], user['email'], user['password_hash'])
        return None

def get_user_by_id(user_id):
    with get_db() as conn:
        user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        if user:
            return User(user['id'], user['name'], user['email'], user['password_hash'])
        return None

def create_user(name, email, password):
    password_hash = generate_password_hash(password)
    with get_db() as conn:
        conn.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', (name, email, password_hash))
        user_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return User(user_id, name, email, password_hash)

def get_boards_by_user(user_id):
    with get_db() as conn:
        boards = conn.execute('SELECT * FROM boards WHERE user_id = ? ORDER BY created_at DESC', (user_id,)).fetchall()
        return [{'id': b['id'], 'name': b['name'], 'created_at': b['created_at']} for b in boards]

def create_board(user_id, name):
    with get_db() as conn:
        conn.execute('INSERT INTO boards (user_id, name) VALUES (?, ?)', (user_id, name))
        board_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return {'id': board_id, 'name': name, 'created_at': 'now'}

def delete_board(board_id, user_id):
    with get_db() as conn:
        conn.execute('DELETE FROM boards WHERE id = ? AND user_id = ?', (board_id, user_id))
        return conn.rowcount > 0

def update_board(board_id, user_id, new_name):
    with get_db() as conn:
        conn.execute('UPDATE boards SET name = ? WHERE id = ? AND user_id = ?', (new_name, board_id, user_id))
        return conn.rowcount > 0

def get_notes_by_board(board_id):
    with get_db() as conn:
        notes = conn.execute('SELECT * FROM notes WHERE board_id = ?', (board_id,)).fetchall()
        return [{'id': n['id'], 'title': n['title'], 'content': n['content'], 'author': n['author'], 'color': n['color']} for n in notes]

def create_note(board_id, title, content, author, color):
    with get_db() as conn:
        conn.execute('INSERT INTO notes (board_id, title, content, author, color) VALUES (?, ?, ?, ?, ?)', (board_id, title, content, author, color))
        note_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return {'id': note_id, 'title': title, 'content': content, 'author': author, 'color': color}

def update_note(note_id, title=None, content=None, color=None):
    with get_db() as conn:
        updates = []
        params = []
        if title is not None:
            updates.append('title = ?')
            params.append(title)
        if content is not None:
            updates.append('content = ?')
            params.append(content)
        if color is not None:
            updates.append('color = ?')
            params.append(color)
        if updates:
            query = f'UPDATE notes SET {", ".join(updates)} WHERE id = ?'
            params.append(note_id)
            conn.execute(query, params)
            return conn.rowcount > 0
        return False

def delete_note(note_id):
    with get_db() as conn:
        conn.execute('DELETE FROM notes WHERE id = ?', (note_id,))
        return conn.rowcount > 0
