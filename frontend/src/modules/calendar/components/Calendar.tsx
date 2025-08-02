import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";
import type { Evento } from "../eventos";
import { eventosToCalendarEvents } from "../eventos";
import { findAllGaps, gapsToCalendarEvents } from "../utils/find-gaps";

interface CalendarProps {
  className?: string;
  tasks: Evento[];
}

export default function Calendar({ className = "", tasks }: CalendarProps) {
  const [showGaps, setShowGaps] = useState(false);
  
  // Converte eventos para o formato do FullCalendar
  const userEvents = eventosToCalendarEvents(tasks);

  // Gerar eventos de gaps se showGaps estiver ativo
  const gaps = showGaps ? findAllGaps(tasks) : [];
  const gapEvents = showGaps ? gapsToCalendarEvents(gaps) : [];
  
  // Debug logs
  if (showGaps) {
    console.log('Tasks:', tasks);
    console.log('Gaps found:', gaps);
    console.log('Gap events:', gapEvents);
  }
  
  const allEvents = [...userEvents, ...gapEvents];

  return (
    <div className={`${className} w-full h-full`}>
      <FullCalendar
        plugins={[dayGridPlugin, multiMonthPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={allEvents}
        height="auto"
        locale="pt-br"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'gapsToggle multiMonthYear,dayGridMonth,timeGridDay'
        }}
        customButtons={{
          gapsToggle: {
            text: showGaps ? 'Ocultar Gaps' : 'Visualizar Gaps',
            click: () => setShowGaps(!showGaps)
          }
        }}
        buttonText={{
          year: 'Ano',
          today: 'Hoje',
          month: 'Mês',
          day: 'Dia',
        }}
        dayHeaderFormat={{ weekday: 'short' }}
        eventDisplay="block"
        displayEventTime={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        allDaySlot={false}
        nowIndicator={true}
      />
    </div>
  );
}
