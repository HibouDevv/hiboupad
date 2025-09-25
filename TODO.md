# TODO: Make HibouPad Functional with LocalStorage Auth

## 1. Update index.html ✅
- Add id="getStarted" to the Get Started link/button
- Keep original HibouPad theme (indigo colors)

## 2. Update login.html ✅
- Remove Firebase scripts and config
- Keep original structure and theme

## 3. Update signup.html ✅
- Remove Firebase scripts and config
- Keep original structure and theme

## 4. Update login.js ✅
- Remove all Firebase code and imports
- Implement localStorage-based login: retrieve users from localStorage, check email/password match
- On success, store user in localStorage session, redirect to board.html
- On failure, show alert
- Remove Google sign-in for simplicity

## 5. Update signup.js ✅
- Remove all Firebase code and imports
- Implement localStorage-based signup: store users array in localStorage with email, password (hashed if possible, but plain for demo), name
- Check if email exists, alert if so
- On success, store current user in session, redirect to board.html
- Remove Google sign-in for simplicity

## 6. Create board.html ✅
- Full HTML page: header with HibouPad title and logout button
- Main section: form to post new note (title, content)
- Board area: grid to display notes
- Each note: display content, heart button (with count), comments section
- Footer
- Use Tailwind for styling, indigo theme
- Include script src="board.js" defer

## 7. Create board.js ✅
- On load: check if user logged in (localStorage), else redirect to login.html
- Load notes from localStorage (array of notes with id, title, content, hearts:0, comments:[], author)
- Display notes in grid
- Post new note: add to localStorage, re-render
- Heart button: increment hearts count for note, update localStorage
- Comments: form per note, add comment with author, update localStorage
- Logout: clear session, redirect to index.html

## 8. Update script.js ✅
- Fix selector if needed, but it targets #getStarted which we'll add

## 9. Test the flow ✅
- Index -> Signup -> Board (post note, heart, comment)
- Logout -> Index -> Login -> Board

## 10. Enhance board to resemble Padlet ✅
- Change layout to masonry columns
- Add random colors to notes
- Update note styling for sticky-note look

## 11. Add delete button for notes ✅
- Add delete button visible only to note author
- Confirm delete, remove from localStorage, re-render

## 12. Add invite/share feature ✅
- Add share button in header to copy board URL to clipboard

## 13. Create dashboard for board management
- Create dashboard.html with list of user's boards
- Allow create, edit name, delete boards
- Each board has unique URL (board.html?id=boardId)

## 14. Update localStorage for multiple boards
- Change notes to boards array: [{id, name, notes: []}]
- Update board.js to load notes by board ID from URL

## 15. Implement persistent login ✅
- Check localStorage currentUser on page load
- Redirect logged-in users appropriately (index to dashboard, etc.)

## 16. Add quick note creation ✅
- Add floating + button in bottom right for quick note creation
- Show modal or inline form for title and content

## 17. Add back to dashboard button ✅
- Add button in board header to return to dashboard
