import { useState, useEffect } from 'react'

const EventsSection = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // This will be connected to backend API later
    setEvents([])
  }, [])

  return (
    <div className="events-section">
      <div className="container">
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
          <p>No upcoming events at this time.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-details">
                  <time>{new Date(event.date).toLocaleDateString()}</time>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsSection