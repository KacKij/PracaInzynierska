import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";

import { usePatients } from "../hooks/usePatients";
import { useVisits } from "../hooks/useVisits";
import { NewVisit } from "../api/visits";

import { useAvailability } from "../hooks/useAvailability";
import { Slot } from "../api/availability";
import { useDoctors } from "../hooks/useDoctors";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");

  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");     // YYYY-MM-DD
  const [duration, setDuration] = useState<number>(15);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { slots, loading: slotsLoading, error: slotsError, loadSlots } = useAvailability();
  const { doctors } = useDoctors();

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

  const { patients } = usePatients();
  const { visits, createVisit } = useVisits();

  const [patientId, setPatientId] = useState<number | "">("");

  useEffect(() => {

    const formatted = visits.map((visit) => ({
      id: visit.id.toString(),
      title: `${visit.patientName} - ${visit.reason}`,
      start: visit.visitDateStart,
      end: visit.visitDateEnd,
      extendedProps: {
        calendar: visit.status === "Completed" ? "Success" :
          visit.status === "Cancelled" ? "Danger" : "Primary",
        doctorName: visit.doctorName,
      },
    }));
    setEvents(formatted);
  }, [visits]);

  // Initialize with some events


  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    const d = selectInfo.startStr.split("T")[0];
    setDate(d);
    if (doctorId == null) {
      alert("Please select a doctor");
      return;
    }
    if (doctorId) {
      loadSlots(doctorId as number, d, duration);
    }
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    const startStr = event.start?.toISOString()!;
    const slot = slots.find(s => s.start === startStr) || null;
    setSelectedSlot(slot);
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    // must pick a patient
    if (!patientId) {
      alert("Please select a patient");
      return;
    }

    if (!selectedSlot) {
      alert("Please choose an available time");
      return;
    }

    const payload: NewVisit = {
      patientId,
      doctorId: doctorId as number,
      visitDateStart: selectedSlot.start,
      visitDateEnd: selectedSlot.end,
      reason: eventTitle,
    };

    try {
      await createVisit(payload);
      closeModal();
      resetModalFields();
    } catch (err) {
      console.error(err);
      alert("Error creating visit");
    }
  };

  const resetModalFields = () => {
    setSelectedEvent(null);
    setEventTitle("");
    setDoctorId(1);
    setDate("");
    setDuration(15);
    setSelectedSlot(null);
    setEventLevel("");
    setPatientId("");
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment: schedule or edit an event to stay on
                track
              </p>
            </div>
            <div className="mt-8">
              <div className="mt-6">
                {/* Doctor */}
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Doctor</label>
                <select
                  value={doctorId}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                  onChange={e => {
                    const id = Number(e.target.value);
                    setDoctorId(id);
                    if (date) loadSlots(id, date, duration);
                  }}
                >
                  <option value="">Select doctor…</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.firstname} {d.lastname}
                    </option>
                  ))}
                </select>

                {/* Date */}
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Date</label>
                <input
                  type="date"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                  value={date}
                  onChange={e => {
                    setDate(e.target.value);
                    if (doctorId) loadSlots(doctorId as number, e.target.value, duration);
                  }}
                />

                {/* Duration */}
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Duration</label>
                <select
                  value={duration}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                  onChange={e => {
                    const mins = Number(e.target.value);
                    setDuration(mins);
                    if (doctorId && date) loadSlots(doctorId as number, date, mins);
                  }}
                >
                  {[15, 30, 45, 60].map(m => (
                    <option key={m} value={m}>{m} minutes</option>
                  ))}
                </select>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Available Times</label>
                <select
                  value={selectedSlot ? selectedSlot.start : ""}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                  onChange={e => {
                    const slot = slots.find(s => s.start === e.target.value)!;
                    setSelectedSlot(slot);
                  }}
                  disabled={slotsLoading || !slots.length}
                >
                  <option value="">Select time…</option>
                  {slots.map(s => (
                    <option key={s.start} value={s.start}>
                      {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      –{new Date(s.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </option>
                  ))}
                </select>
                {slotsError && <p className="text-red-500">{slotsError}</p>}
                <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Patient
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(Number(e.target.value))}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                >
                  <option className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                  value="">Select patient…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstname} {p.lastname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Title
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800ff"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div
                        className={`form-check form-check-${value} form-check-inline`}
                      >
                        <label
                          className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-level"
                              value={key}
                              id={`modal${key}`}
                              checked={eventLevel === key}
                              onChange={() => setEventLevel(key)}
                            />
                            <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                              <span
                                className={`h-2 w-2 rounded-full bg-white ${eventLevel === key ? "block" : "hidden"
                                  }`}
                              ></span>
                            </span>
                          </span>
                          {key}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {selectedEvent ? "Update Changes" : "Add Event"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
