# Event Management System

A full-stack web application designed to manage events and attendees in one place. The system allows users to create events, register attendees, search records, and manage event and attendee information through an interactive web interface.

**Project:** Mini Project – Event / Attendee Management System

---

## Overview

The Event Management System provides a simple and user-friendly platform for managing events and their registered attendees.

Users can create events by entering details such as event name, date, and venue. Attendees can then be registered for available events, searched by name or event, and removed when required.

The application follows a full-stack architecture with a web-based frontend, REST APIs, backend processing, and database storage.

---

## Features

* Add new events with event name, date and venue
* Display all available events dynamically
* Register attendees for an event
* View registered attendees
* Search attendees by name or event
* Delete attendees
* Delete events
* Email format validation
* Required-field validation
* Duplicate attendee registration prevention
* Validation for invalid or non-existent events
* Event capacity checking
* Dynamic updates without refreshing the page
* REST API based communication using Fetch API
* SQLite database for storing event and attendee information
* Events and attendees maintained using a one-to-many relationship
* User-friendly Ocean-themed interface
* Responsive and interactive frontend

---

## Technology Stack

| Layer                | Technology            |
| -------------------- | --------------------- |
| Frontend             | HTML, CSS, JavaScript |
| Client Communication | JavaScript Fetch API  |
| Backend              | Node.js, Express.js   |
| Additional Backend   | Python, Flask         |
| Database             | SQLite                |
| API                  | REST API              |
| Development          | VS Code, Git, GitHub  |

---

## Application Architecture

The application follows a client-server architecture:

```text
User
  │
  ▼
Frontend
HTML + CSS + JavaScript
  │
  │ Fetch API / JSON
  ▼
Backend
Node.js + Express.js
  │
  ▼
SQLite Database
  │
  ├── Events
  └── Attendees
```

A Flask backend is also included as an additional backend implementation.

---

## Database Design

The system uses SQLite to store event and attendee records.

### Events

* Event ID
* Event Name
* Event Date
* Venue
* Capacity

### Attendees

* Attendee ID
* Attendee Name
* Email
* Ticket Type
* Event ID

The relationship between the tables is:

```text
Events
   │
   │ 1
   │
   │
   │ Many
   ▼
Attendees
```

One event can have multiple attendees, while each attendee registration belongs to a specific event.

---

## Validation

The application performs validation on the frontend and backend.

Validation includes:

* Required fields cannot be empty
* Email must have a valid format
* Duplicate attendee registration is prevented
* Attendees cannot be registered for a non-existent event
* Full events cannot accept additional registrations
* Invalid event or attendee records are handled properly
* Delete operations check whether the requested record exists

---

## API Endpoints

### Events

| Method | Route             | Purpose         |
| ------ | ----------------- | --------------- |
| POST   | `/api/events`     | Add a new event |
| GET    | `/api/events`     | Get all events  |
| DELETE | `/api/events/:id` | Delete an event |

### Attendees

| Method | Route                | Purpose              |
| ------ | -------------------- | -------------------- |
| GET    | `/api/attendees`     | Get all attendees    |
| POST   | `/api/attendees`     | Register an attendee |
| DELETE | `/api/attendees/:id` | Delete an attendee   |

### Search

| Method | Route                   | Purpose                           |
| ------ | ----------------------- | --------------------------------- |
| GET    | `/api/attendees/search` | Search attendees by name or event |

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/niha904/Event-Management-System.git
cd Event-Management-System
```

### 2. Run the Node.js backend

```bash
cd backend-node
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Run the frontend

Open the `frontend` folder in VS Code and run `index.html` using **Live Server**.

The frontend will normally open at:

```text
http://localhost:5500
```

The frontend communicates with the backend through the API running on port `5000`.

---

## Project Structure

```text
Event-Management-System/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend-node/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── backend-flask/
│   ├── app.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## Testing

The application can be tested using different scenarios:

* Adding a valid event
* Adding an event with missing information
* Registering a valid attendee
* Registering the same attendee twice
* Registering an attendee with an invalid email
* Registering for a non-existent event
* Registering when an event is full
* Searching for an existing attendee
* Searching for an attendee that does not exist
* Deleting an attendee
* Deleting an event
* Checking that records update without a page reload

---

## User Interface

The application uses an **Ocean-inspired theme** with a modern interface designed for simple event and attendee management.

Main sections include:

* Event creation
* Event listing
* Attendee registration
* Attendee listing
* Search
* Event and attendee management actions

---

## Future Enhancements

Possible improvements for future versions include:

* User authentication and login
* Admin dashboard
* Event image uploads
* Email confirmation for registrations
* QR-code based event tickets
* Online ticket payment
* Event analytics and reports
* Export attendee lists to CSV/PDF
* Cloud database integration

---

## Project Repository

GitHub:

https://github.com/niha904/Event-Management-System
