import React, { useState } from 'react';
import { useThemeContext } from '../../shared';
import { useEventos } from '../../calendar/eventos';
import { useMetrics } from '../hooks/useMetrics';
import { FullCalendarSelector } from './FullCalendarSelector';
import { DayOccupationChart } from './DayOccupationChart';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useThemeContext();
  const { eventos } = useEventos();
  const { generateChartData, getDayOccupationData } = useMetrics();
  const [selectedDate, setSelectedDate] = useState<string>('');

  if (!isOpen) return null;

  const chartData = generateChartData(eventos);

  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
  };

  const dayOccupationData = selectedDate ?
    getDayOccupationData(eventos, selectedDate) :
    { occupiedHours: 0, freeHours: 24, taskCount: 0, categoryTime: {} };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="rounded-lg p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: `0 10px 25px ${theme.colors.shadow}`
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-2xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Métricas
          </h2>
          <button
            onClick={onClose}
            style={{
              color: theme.colors.text.secondary,
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendário de seleção */}
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <FullCalendarSelector
              monthData={chartData.tasksByDay.tasksData}
              selectedDate={selectedDate}
              onDaySelect={handleDaySelect}
            />
          </div>

          {/* Gráfico de ocupação do dia selecionado */}
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <DayOccupationChart
              selectedDate={selectedDate}
              occupiedHours={dayOccupationData.occupiedHours}
              freeHours={dayOccupationData.freeHours}
              taskCount={dayOccupationData.taskCount}
              categoryTime={dayOccupationData.categoryTime}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
