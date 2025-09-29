from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length
from models import init_db, get_user_by_email, create_user, get_user_by_id, get_boards_by_user, create_board, delete_board, update_board, get_notes_by_board, create_note, update_note, delete_note

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

init_db()

@login_manager.user_loader
def load_user(user_id):
    return get_user_by_id(int(user_id))

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class SignupForm(FlaskForm):
    name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = get_user_by_email(form.email.data)
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'danger')
    return render_template('login.html', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = SignupForm()
    if form.validate_on_submit():
        if get_user_by_email(form.email.data):
            flash('Email already registered', 'danger')
        else:
            user = create_user(form.name.data, form.email.data, form.password.data)
            login_user(user)
            flash('Account created successfully', 'success')
            return redirect(url_for('dashboard'))
    return render_template('signup.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user_id=current_user.id)

@app.route('/api/boards', methods=['GET'])
@login_required
def get_boards():
    boards = get_boards_by_user(current_user.id)
    return jsonify(boards)

@app.route('/api/boards', methods=['POST'])
@login_required
def create_new_board():
    data = request.get_json()
    name = data.get('name')
    if name:
        board = create_board(current_user.id, name)
        return jsonify(board), 201
    return jsonify({'error': 'Name is required'}), 400

@app.route('/api/boards/<int:board_id>', methods=['DELETE'])
@login_required
def delete_board_route(board_id):
    if delete_board(board_id, current_user.id):
        return jsonify({'success': True})
    return jsonify({'error': 'Board not found'}), 404

@app.route('/api/boards/<int:board_id>', methods=['PUT'])
@login_required
def update_board_route(board_id):
    data = request.get_json()
    new_name = data.get('name')
    if new_name and update_board(board_id, current_user.id, new_name):
        return jsonify({'success': True})
    return jsonify({'error': 'Board not found'}), 404

@app.route('/api/boards/<int:board_id>/notes', methods=['GET'])
@login_required
def get_notes(board_id):
    # Check if board belongs to user
    boards = get_boards_by_user(current_user.id)
    if not any(b['id'] == board_id for b in boards):
        return jsonify({'error': 'Board not found'}), 404
    notes = get_notes_by_board(board_id)
    return jsonify(notes)

@app.route('/api/boards/<int:board_id>/notes', methods=['POST'])
@login_required
def create_new_note(board_id):
    # Check if board belongs to user
    boards = get_boards_by_user(current_user.id)
    if not any(b['id'] == board_id for b in boards):
        return jsonify({'error': 'Board not found'}), 404
    data = request.get_json()
    title = data.get('title', 'Untitled')
    content = data.get('content', 'No content')
    author = current_user.name
    color = data.get('color', 'bg-yellow-200')
    note = create_note(board_id, title, content, author, color)
    return jsonify(note), 201

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@login_required
def update_note_route(note_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    color = data.get('color')
    if update_note(note_id, title, content, color):
        return jsonify({'success': True})
    return jsonify({'error': 'Note not found'}), 404

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@login_required
def delete_note_route(note_id):
    if delete_note(note_id):
        return jsonify({'success': True})
    return jsonify({'error': 'Note not found'}), 404

@app.route('/board')
@login_required
def board():
    board_id = request.args.get('id')
    if not board_id:
        return redirect(url_for('dashboard'))
    return render_template('board.html', board_id=board_id)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
