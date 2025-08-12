import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useThemeContext } from '../../shared';

interface FullCalendarSelectorProps {
  monthData: { [date: string]: { count: number, occupiedMinutes: number } };
  selectedDate: string;
  onDaySelect: (date: string) => void;
}

export const FullCalendarSelector: React.FC<FullCalendarSelectorProps> = ({ 
  monthData, 
  selectedDate, 
  onDaySelect 
}) => {
  const { theme } = useThemeContext();
  const calendarRef = useRef<FullCalendar>(null);

  const getIntensityColor = (taskCount: number) => {
    if (taskCount === 0) return 'transparent';
    if (taskCount === 1) return '#ddd6fe';
    if (taskCount === 2) return '#c4b5fd';
    if (taskCount >= 3) return '#8b5cf6';
    return '#6d28d9';
  };

  const getDayEvents = () => {
    const events: any[] = [];
    
    Object.entries(monthData).forEach(([date, data]) => {
      // Evento de fundo para a cor
      events.push({
        id: `bg-${date}`,
        title: '',
        date: date,
        display: 'background',
        backgroundColor: getIntensityColor(data.count),
        borderColor: 'transparent',
        classNames: ['task-density-bg']
      });
    });
    
    return events;
  };

  // Aplicar estilos customizados
  useEffect(() => {
    const style = document.getElementById('fullcalendar-metrics-styles') || document.createElement('style');
    style.id = 'fullcalendar-metrics-styles';
    style.innerHTML = `
      .fc-metrics-calendar {
        --fc-border-color: ${theme.colors.border};
        --fc-button-text-color: ${theme.colors.text.primary};
        --fc-button-bg-color: ${theme.colors.primary};
        --fc-button-border-color: ${theme.colors.primary};
        --fc-button-hover-bg-color: ${theme.colors.primary}dd;
        --fc-today-bg-color: ${theme.colors.primary}20;
        --fc-page-bg-color: ${theme.colors.background};
      }
      
      .fc-metrics-calendar .fc-toolbar-title {
        color: ${theme.colors.text.primary} !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      
      .fc-metrics-calendar .fc-col-header-cell {
        background-color: ${theme.colors.surface} !important;
        border-color: ${theme.colors.border} !important;
      }
      
      .fc-metrics-calendar .fc-col-header-cell-cushion {
        color: ${theme.colors.text.secondary} !important;
        font-weight: 500 !important;
      }
      
      .fc-metrics-calendar .fc-daygrid-day {
        background-color: ${theme.colors.background} !important;
        border-color: ${theme.colors.border} !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      
      .fc-metrics-calendar .fc-daygrid-day:hover {
        background-color: ${theme.colors.border}40 !important;
      }
      
      .fc-metrics-calendar .fc-daygrid-day.fc-day-selected {
        background-color: ${theme.colors.primary}30 !important;
        border: 2px solid ${theme.colors.primary} !important;
      }
      
      .fc-metrics-calendar .fc-daygrid-day-number {
        color: ${theme.colors.text.primary} !important;
        font-weight: 500 !important;
        font-size: 0.875rem !important;
        padding: 4px !important;
      }
      
      .fc-metrics-calendar .fc-daygrid-day-top {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      
      .fc-metrics-calendar .fc-bg-event {
        opacity: 0.6 !important;
      }
      
      .fc-metrics-calendar .task-count-badge {
        background-color: ${theme.colors.primary} !important;
        color: white !important;
        border-radius: 50% !important;
        width: 20px !important;
        height: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 11px !important;
        font-weight: bold !important;
        margin: 2px !important;
      }
      
      .fc-metrics-calendar .fc-daygrid-day-frame {
        min-height: 80px !important;
        position: relative !important;
      }
      
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('fullcalendar-metrics-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme]);

  const handleDateClick = (info: any) => {
    // Remover seleção anterior
    const prevSelected = document.querySelector('.fc-day-selected');
    if (prevSelected) {
      prevSelected.classList.remove('fc-day-selected');
    }
    
    // Adicionar classe de seleção ao dia clicado
    const dayEl = info.dayEl;
    if (dayEl) {
      dayEl.classList.add('fc-day-selected');
    }
    
    // Usar a data clicada
    const clickedDate = info.dateStr;
    onDaySelect(clickedDate);
  };

  const handleDayCellDidMount = (info: any) => {
    const date = info.date.toISOString().split('T')[0];
    const data = monthData[date];
    
    if (data && data.count > 0) {
      // Adicionar badge com número de tarefas
      const badge = document.createElement('div');
      badge.className = 'task-count-badge';
      badge.textContent = data.count.toString();
      badge.title = `${data.count} tarefa${data.count !== 1 ? 's' : ''}`;
      
      const dayTop = info.el.querySelector('.fc-daygrid-day-top');
      if (dayTop) {
        dayTop.appendChild(badge);
      }
    }
    
    // Marcar dia selecionado
    if (date === selectedDate) {
      info.el.classList.add('fc-day-selected');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          Calendário
        </h3>
        <p 
          className="text-sm mt-1"
          style={{ color: theme.colors.text.secondary }}
        >
          Clique em um dia para ver detalhes.
        </p>
      </div>
      
      <div className="fc-metrics-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: ''
          }}
          height="auto"
          events={getDayEvents()}
          dateClick={handleDateClick}
          dayCellDidMount={handleDayCellDidMount}
          dayMaxEvents={false}
          eventDisplay="background"
          locale="pt-br"
          firstDay={0}
          fixedWeekCount={false}
          showNonCurrentDates={false}
        />
      </div>
      
      {/* Legenda */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span style={{ color: theme.colors.text.secondary }}>Menos tarefas</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 5].map(count => (
            <div
              key={count}
              className="w-4 h-4 rounded-sm border"
              style={{ 
                backgroundColor: getIntensityColor(count),
                borderColor: theme.colors.border
              }}
              title={`${count} tarefa${count !== 1 ? 's' : ''}`}
            />
          ))}
        </div>
        <span style={{ color: theme.colors.text.secondary }}>Mais tarefas</span>
      </div>
    </div>
  );
};