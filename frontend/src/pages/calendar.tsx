// CalendarPage.tsx
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { Event as RBCEvent } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ICAL from "ical.js";

const localizer = momentLocalizer(moment);

interface CalendarEvent extends RBCEvent {
  id: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const loadIcs = async () => {
      try {
        // Replace with your own .ics feed URL or static file path
        const proxy = "https://corsproxy.io/?";
        const googleIcsUrl = ""
        const res = await fetch(proxy + encodeURIComponent(googleIcsUrl));
        const icsText = await res.text();
        console.log(icsText);

        const jcalData = ICAL.parse(icsText);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const parsedEvents: CalendarEvent[] = vevents.map((vevent, idx) => {
          const event = new ICAL.Event(vevent);

          return {
            id: event.uid || `event-${idx}`,
            title: event.summary || "Untitled Event",
            start: event.startDate.toJSDate(),
            end: event.endDate.toJSDate(),
            allDay: event.startDate.isDate,
          };
        });

        setEvents(parsedEvents);
      } catch (err) {
        console.error("Error loading ICS:", err);
      }
    };

    loadIcs();
  }, []);

  return (
    <div style={{ height: "100vh", padding: "1rem" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85%" }}
        defaultView="week"
        scrollToTime={new Date() -1000 * 60 * 60 * 1} // Scroll to 1 hours before now
      />
    </div>
  );
};

export default CalendarPage;
