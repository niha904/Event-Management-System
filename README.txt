# Ocean Events - All Technologies

Included: HTML/CSS/JavaScript frontend, Node.js + Express backend, Python + Flask backend, and SQLite database.

PRIMARY (Node/Express):
1. cd backend-node
2. npm install
3. node server.js
4. Open http://localhost:5000

ALTERNATIVE (Flask):
1. cd backend-flask
2. pip install -r requirements.txt
3. python app.py
4. Change API in frontend/script.js from port 5000 to port 5001.

Both backends implement the same SQLite CRUD API and validation: required fields, valid email, duplicate registration, full event, non-existent event, attendee/event deletion, and search by attendee name/email/event. SQLite uses a one-to-many Events -> Attendees relationship with foreign key cascade.
