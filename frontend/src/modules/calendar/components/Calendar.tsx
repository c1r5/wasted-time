import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect } from "react";
import type { Evento } from "../eventos";
import { eventosToCalendarEvents } from "../eventos";
import { findAllGaps, gapsToCalendarEvents } from "../utils/find-gaps";
import { useThemeContext } from "../../shared";

interface CalendarProps {
  className?: string;
  tasks: Evento[];
}

export default function Calendar({ className = "", tasks }: CalendarProps) {
  const { theme } = useThemeContext();
  const [showGaps, setShowGaps] = useState(false);
  
  // Aplica estilos CSS customizados para o tema
  useEffect(() => {
    const style = document.getElementById('calendar-theme-styles') || document.createElement('style');
    style.id = 'calendar-theme-styles';
    style.innerHTML = `
      .fc {
        background-color: ${theme.colors.background};
        color: ${theme.colors.text.primary};
      }
      .fc-toolbar {
        background-color: ${theme.colors.surface};
        border-bottom: 1px solid ${theme.colors.border};
        padding: 1rem;
      }
      .fc-toolbar-title {
        color: ${theme.colors.text.primary} !important;
      }
      .fc-button {
        background-color: ${theme.colors.primary} !important;
        border-color: ${theme.colors.primary} !important;
        color: #ffffff !important;
      }
      .fc-button:hover:not(:disabled) {
        background-color: #475569 !important;
        border-color: #475569 !important;
      }
      .fc-button:disabled {
        opacity: 0.6;
      }
      .fc-col-header {
        background-color: ${theme.colors.surface};
        border-bottom: 1px solid ${theme.colors.border};
      }
      .fc-col-header-cell {
        border-right: 1px solid ${theme.colors.border};
      }
      .fc-col-header-cell-cushion {
        color: ${theme.colors.text.secondary} !important;
        font-weight: 600;
        padding: 0.75rem 0.5rem;
      }
      .fc-daygrid-day {
        border-right: 1px solid ${theme.colors.border};
        border-bottom: 1px solid ${theme.colors.border};
      }
      .fc-daygrid-day-number {
        color: ${theme.colors.text.primary};
        padding: 0.5rem;
      }
      .fc-daygrid-day.fc-day-today {
        background-color: ${theme.colors.primary}20;
      }
      .fc-scrollgrid {
        border: 1px solid ${theme.colors.border};
      }
      .fc-event {
        border-radius: 4px;
      }
      .fc-timegrid-slot {
        border-bottom: 1px solid ${theme.colors.border};
      }
      .fc-timegrid-slot-label {
        color: ${theme.colors.text.secondary};
      }
      .time-gap-event {
        z-index: 1 !important;
      }
      .fc-event:not(.time-gap-event) {
        z-index: 10 !important;
      }
      .fc-multimonth {
        background-color: ${theme.colors.background};
      }
      .fc-multimonth-header {
        background-color: ${theme.colors.surface};
        border-bottom: 1px solid ${theme.colors.border};
      }
      .fc-multimonth-title {
        color: ${theme.colors.text.primary} !important;
      }
      .fc-multimonth-daygrid {
        border: 1px solid ${theme.colors.border};
      }
      .fc-multimonth-daygrid-table {
        background-color: ${theme.colors.background};
      }
      .fc-multimonth-month {
        border: 1px solid ${theme.colors.border};
        background-color: ${theme.colors.background};
      }
      .fc-multimonth-month-title {
        background-color: ${theme.colors.surface};
        color: ${theme.colors.text.primary} !important;
        border-bottom: 1px solid ${theme.colors.border};
      }
      .fc-multimonth-daygrid-table .fc-daygrid-day {
        border-right: 1px solid ${theme.colors.border};
        border-bottom: 1px solid ${theme.colors.border};
        background-color: ${theme.colors.background};
      }
      .fc-multimonth-daygrid-table .fc-daygrid-day-number {
        color: ${theme.colors.text.primary};
      }
      .fc-multimonth-daygrid-table .fc-daygrid-day.fc-day-today {
        background-color: ${theme.colors.primary}20;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('calendar-theme-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme]);
  
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
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        allDaySlot={false}
        nowIndicator={true}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
}
