import React from 'react';
import { useThemeContext } from '../../shared';

interface CalendarDay {
  date: string;
  day: number;
  taskCount: number;
  isToday: boolean;
  isSelected: boolean;
}

interface CalendarSelectorProps {
  monthData: { [date: string]: { count: number, occupiedMinutes: number } };
  selectedDate: string;
  onDaySelect: (date: string) => void;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({ 
  monthData, 
  selectedDate, 
  onDaySelect 
}) => {
  const { theme } = useThemeContext();

  // Gerar dados do calendário
  const generateCalendarData = (): CalendarDay[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = domingo, 1 = segunda...

    const days: CalendarDay[] = [];
    
    // Adicionar dias vazios do início
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: '',
        day: 0,
        taskCount: 0,
        isToday: false,
        isSelected: false
      });
    }
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = monthData[dateStr] || { count: 0, occupiedMinutes: 0 };
      
      const isToday = 
        day === today.getDate() && 
        month === today.getMonth() && 
        year === today.getFullYear();

      days.push({
        date: dateStr,
        day,
        taskCount: dayData.count,
        isToday,
        isSelected: dateStr === selectedDate
      });
    }

    return days;
  };

  const calendarDays = generateCalendarData();
  const monthName = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getIntensityColor = (taskCount: number) => {
    if (taskCount === 0) return theme.colors.border;
    if (taskCount === 1) return '#ddd6fe'; // Roxo muito claro
    if (taskCount === 2) return '#c4b5fd'; // Roxo claro
    if (taskCount >= 3) return '#8b5cf6'; // Roxo médio
    return '#6d28d9'; // Roxo escuro para 5+
  };

  const getTextColor = (taskCount: number, isSelected: boolean, isToday: boolean) => {
    if (isSelected) return '#ffffff';
    if (isToday) return theme.colors.primary;
    if (taskCount >= 3) return '#ffffff';
    return theme.colors.text.primary;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          Calendário de Tarefas - {monthName}
        </h3>
        <p 
          className="text-sm mt-1"
          style={{ color: theme.colors.text.secondary }}
        >
          Clique em um dia para ver detalhes de ocupação. Cores mais escuras = mais tarefas.
        </p>
      </div>

      {/* Headers dos dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div 
            key={day}
            className="text-center text-xs font-medium py-2"
            style={{ color: theme.colors.text.secondary }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => {
          if (!dayData.date) {
            // Dia vazio
            return (
              <div 
                key={index}
                className="aspect-square flex items-center justify-center"
              />
            );
          }

          return (
            <button
              key={dayData.date}
              onClick={() => onDaySelect(dayData.date)}
              className="aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: dayData.isSelected ? theme.colors.primary : getIntensityColor(dayData.taskCount),
                color: getTextColor(dayData.taskCount, dayData.isSelected, dayData.isToday),
                border: dayData.isSelected ? `2px solid ${theme.colors.primary}` : (dayData.isToday ? `1px solid ${theme.colors.primary}` : 'none')
              }}
              title={`${dayData.day} - ${dayData.taskCount} tarefa${dayData.taskCount !== 1 ? 's' : ''}`}
            >
              <span className="text-sm font-medium">
                {dayData.day}
              </span>
              {dayData.taskCount > 0 && (
                <span className="text-xs opacity-80">
                  {dayData.taskCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span style={{ color: theme.colors.text.secondary }}>Menos</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 5].map(count => (
            <div
              key={count}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getIntensityColor(count) }}
              title={`${count} tarefa${count !== 1 ? 's' : ''}`}
            />
          ))}
        </div>
        <span style={{ color: theme.colors.text.secondary }}>Mais</span>
      </div>
    </div>
  );
};