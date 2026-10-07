const API = "http://localhost:5000/api";

// ===============================
// Helper Functions
// ===============================

const $ = (id) => document.getElementById(id);

const msg = (text, error = false) => {
  const messageBox = $("msg");

  messageBox.className = error ? "err" : "ok";
  messageBox.textContent = text;

  setTimeout(() => {
    messageBox.textContent = "";
    messageBox.className = "";
  }, 3500);
};

// Escape HTML
const esc = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

// Format Date
const formatDate = (value) => {
  if (!value) return "";

  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ===============================
// API Helper
// ===============================

async function api(url, options = {}) {
  try {
    const response = await fetch(url, options);

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Request failed (${response.status})`,
      );
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error(
        "Unable to connect to server. Make sure Node.js/Express is running on port 5000.",
      );
    }

    throw error;
  }
}

// ===============================
// Global Data
// ===============================

let events = [];

// ===============================
// Load Events
// ===============================

async function loadEvents() {
  try {
    events = await api(API + "/events");

    $("eventCount").textContent = events.length;

    const totalSeats = events.reduce((sum, event) => {
      return sum + Math.max(0, Number(event.remaining || 0));
    }, 0);

    $("seatCount").textContent = totalSeats;

    renderEvents();
  } catch (error) {
    msg(error.message, true);
  }
}

// ===============================
// Render Events
// ===============================

function renderEvents() {
  const search = $("eventSearch").value.trim().toLowerCase();

  const filteredEvents = events.filter((event) => {
    const text =
      `${event.name || ""} ${event.venue || ""} ${event.date || ""}`.toLowerCase();

    return text.includes(search);
  });

  if (!filteredEvents.length) {
    $("eventsGrid").innerHTML = '<p class="empty">🌊 No events found.</p>';
  } else {
    $("eventsGrid").innerHTML = filteredEvents
      .map((event) => {
        const remaining = Math.max(0, Number(event.remaining || 0));

        const registered = Number(event.registered || 0);

        const capacity = Number(event.capacity || 0);

        const isFull = remaining <= 0;

        return `
                <div class="event">

                    <strong>
                        📅 ${formatDate(event.date)}
                    </strong>

                    <h3>
                        ${esc(event.name)}
                    </h3>

                    <p>
                        📍 ${esc(event.venue)}
                    </p>

                    <span class="${isFull ? "full" : ""}">
                        ${registered}/${capacity} registered
                        •
                        ${isFull ? "EVENT FULL" : `${remaining} seats left`}
                    </span>

                    <button
                        type="button"
                        onclick="delEvent(${event.id})"
                    >
                        Delete
                    </button>

                </div>
            `;
      })
      .join("");
  }

  // Update event dropdown

  const availableEvents = events.filter(
    (event) => Number(event.remaining || 0) > 0,
  );

  $("eventSelect").innerHTML =
    '<option value="">Select available event</option>' +
    availableEvents
      .map((event) => {
        return `
                <option value="${event.id}">
                    ${esc(event.name)} — ${event.remaining} seats
                </option>
            `;
      })
      .join("");
}

// ===============================
// Load Attendees
// ===============================

async function loadAttendees() {
  try {
    const search = $("searchInput").value.trim();

    const url =
      API +
      "/attendees" +
      (search ? `?search=${encodeURIComponent(search)}` : "");

    const attendees = await api(url);

    $("attendeeCount").textContent = attendees.length;

    if (!attendees.length) {
      $("attendeesList").innerHTML =
        '<p class="empty">👥 No attendees found.</p>';

      return;
    }

    $("attendeesList").innerHTML = attendees
      .map((attendee) => {
        return `
                    <div class="attendee">

                        <b>
                            ${esc(attendee.name)}
                        </b>

                        <span>
                            • ${esc(attendee.email)}
                        </span>

                        <span>
                            • ${esc(attendee.event_name)}
                        </span>

                        <span>
                            • ${esc(attendee.ticket_type)}
                        </span>

                        <button
                            type="button"
                            onclick="delAtt(${attendee.id})"
                        >
                            Remove
                        </button>

                    </div>
                `;
      })
      .join("");
  } catch (error) {
    msg(error.message, true);
  }
}

// ===============================
// Create Event
// ===============================

$("eventForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("eventName").value.trim();

  const date = $("eventDate").value;

  const venue = $("eventVenue").value.trim();

  const capacity = Number($("eventCapacity").value);

  // Required field validation

  if (!name || !date || !venue || !capacity) {
    msg("Please fill all event fields.", true);

    return;
  }

  // Capacity validation

  if (capacity < 1) {
    msg("Event capacity must be at least 1.", true);

    return;
  }

  try {
    await api(API + "/events", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        date: date,
        venue: venue,
        capacity: capacity,
      }),
    });

    $("eventForm").reset();

    msg("🌊 Event created successfully!");

    await loadEvents();
  } catch (error) {
    msg(error.message, true);
  }
});

// ===============================
// Register Attendee
// ===============================

$("attendeeForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const eventId = Number($("eventSelect").value);

  const name = $("attendeeName").value.trim();

  const email = $("attendeeEmail").value.trim();

  const ticketType = $("ticketType").value;

  // Event validation

  if (!eventId) {
    msg("Please select an event.", true);

    return;
  }

  // Name validation

  if (!name) {
    msg("Please enter attendee name.", true);

    return;
  }

  // Email validation

  if (!email) {
    msg("Please enter attendee email.", true);

    return;
  }

  // Email format validation

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    msg("Please enter a valid email address.", true);

    return;
  }

  try {
    await api(API + "/attendees", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        event_id: eventId,
        name: name,
        email: email,
        ticket_type: ticketType,
      }),
    });

    $("attendeeForm").reset();

    msg("🎟️ Attendee registered successfully!");

    await loadEvents();

    await loadAttendees();
  } catch (error) {
    /*
                Backend handles:
                - Duplicate registration
                - Event full
                - Non-existent event
                - Invalid data
            */

    msg(error.message, true);
  }
});

// ===============================
// Delete Event
// ===============================

async function delEvent(id) {
  const confirmed = confirm("Delete this event and all its registrations?");

  if (!confirmed) {
    return;
  }

  try {
    await api(API + "/events/" + id, {
      method: "DELETE",
    });

    msg("🗑️ Event deleted successfully!");

    await loadEvents();

    await loadAttendees();
  } catch (error) {
    msg(error.message, true);
  }
}

// ===============================
// Delete Attendee
// ===============================

async function delAtt(id) {
  const confirmed = confirm("Remove this attendee?");

  if (!confirmed) {
    return;
  }

  try {
    await api(API + "/attendees/" + id, {
      method: "DELETE",
    });

    msg("🗑️ Attendee removed successfully!");

    await loadEvents();

    await loadAttendees();
  } catch (error) {
    msg(error.message, true);
  }
}

// ===============================
// Search Events
// ===============================

$("eventSearch").addEventListener("input", renderEvents);

// ===============================
// Search Attendees
// ===============================

$("searchInput").addEventListener("input", loadAttendees);

// ===============================
// Initial Load
// ===============================

loadEvents();

loadAttendees();
