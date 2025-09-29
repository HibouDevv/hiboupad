# TODO for Adding Flask Auth to HibouPad

- [x] Set up virtual environment
- [x] Install dependencies: flask, flask-login, flask-wtf (using sqlite3 for DB)
- [x] Create models.py with User class and sqlite3 DB functions
- [x] Create app.py with Flask app setup, database, login manager, routes for /, /login, /signup, /logout, /dashboard, /board
- [x] Create templates/ directory and move HTML files there
- [x] Modify login.html and signup.html to use Flask-WTF forms
- [x] Create static/ directory and move styles.css there
- [x] Modify other templates (index.html, dashboard.html, board.html) to use Jinja2 and add auth checks
- [x] Remove localStorage features from board.js and dashboard.js, replace with API calls
- [x] Delete login.js and signup.js
- [x] Update links in templates to Flask routes
- [x] Add API routes for boards and notes
- [x] Update JS to use fetch instead of localStorage
- [x] Add notification system instead of alerts
- [x] Test the app: run, register, login, access protected pages
