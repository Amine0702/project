"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/app/calendar/hooks/useModal";
import { Modal } from "@/app/calendar/components/ui/modal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000)
          .toISOString()
          .split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000)
          .toISOString()
          .split("T")[0],
        end: new Date(Date.now() + 259200000)
          .toISOString()
          .split("T")[0],
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md px-6 py-6 sm:px-8 sm:py-8 md:p-10"
      >
        <div className="relative flex flex-col space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title
              </div>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            <div>
              <div className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </div>
              <div className="flex items-center space-x-4">
                {Object.entries(calendarsEvents).map(([key]) => (
                  <div key={key} className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                    <input
                      type="radio"
                      name="event-level"
                      value={key}
                      checked={eventLevel === key}
                      onChange={() => setEventLevel(key)}
                      className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600"
                      style={{
                        WebkitAppearance: "radio",
                        MozAppearance: "radio",
                        appearance: "radio",
                        marginRight: "4px",
                      }}
                    />
                    <span>{key}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter Start Date
              </div>
              <input
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>

            <div>
              <div className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter End Date
              </div>
              <input
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleAddOrUpdateEvent}
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
            >
              {selectedEvent ? "Update Changes" : "Add Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const eventStatus = eventInfo.event.extendedProps.calendar;
  let colorClass = "";

  // Application des couleurs personnalisées
  switch (eventStatus) {
    case "Danger":
      colorClass = "bg-[#bf2b0c]"; // Couleur #c93d39 (rouge)
      break;
    case "Success":
      colorClass = "bg-[#f3bf3d]"; // Couleur #deca4c (jaune)
      break;
    case "Primary":
      colorClass = "bg-[#53c5dc]"; // Couleur #4fa5d3 (bleu)
      break;
    case "Warning":
      colorClass = "bg-[#42c678]"; // Couleur #60d87b (vert)
      break;
    default:
      colorClass = "bg-[#b251e3]"; // Pas de fond (transparent)
  }

  return (
    <div className={`flex items-center p-1 rounded ${colorClass}`}>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
