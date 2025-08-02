import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";
import type { TaskData } from "./Sidebar";
import { findAllGaps, gapsToCalendarEvents } from "../utils/find-gaps";

interface CalendarProps {
  className?: string;
  tasks: TaskData[];
}

export default function Calendar({ className = "", tasks }: CalendarProps) {
  const [showGaps, setShowGaps] = useState(false);
  // Função para gerar eventos diários para todo o mês
  const generateDailyEvents = (task: TaskData) => {
    const events = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      events.push({
        title: task.title,
        start: `${dateStr}T${task.startTime}:00`,
        end: `${dateStr}T${task.endTime}:00`,
        backgroundColor: task.color,
        borderColor: task.color
      });
    }
    
    return events;
  };

  const userEvents = tasks.flatMap(task => {
    if (task.isDaily) {
      return generateDailyEvents(task);
    } else {
      return [{
        title: task.title,
        start: `${task.startDate}T${task.startTime}:00`,
        end: `${task.endDate}T${task.endTime}:00`,
        backgroundColor: task.color,
        borderColor: task.color
      }];
    }
  });

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
