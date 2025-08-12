import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useThemeContext } from '../../shared';
import { categoriasPredefinidas } from '../../calendar/eventos';

interface DayOccupationChartProps {
  selectedDate: string;
  occupiedHours: number;
  freeHours: number;
  taskCount: number;
  categoryTime: { [key: string]: number };
}

export const DayOccupationChart: React.FC<DayOccupationChartProps> = ({ 
  selectedDate, 
  occupiedHours, 
  freeHours,
  taskCount,
  categoryTime
}) => {
  const { theme } = useThemeContext();

  const totalHours = occupiedHours + freeHours;
  // const hasValidData = totalHours > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit',
      month: 'long'
    });
  };

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  // Preparar dados do gráfico baseado nas categorias
  const getCategoryColor = (categoryName: string) => {
    const categoria = categoriasPredefinidas.find(cat => cat.name === categoryName);
    return categoria ? categoria.color : '#6b7280';
  };

  const chartLabels: string[] = [];
  const chartSeries: number[] = [];
  const chartColors: string[] = [];
  
  // Adicionar categorias com tempo > 0
  Object.entries(categoryTime).forEach(([categoryName, minutes]) => {
    if (minutes > 0) {
      chartLabels.push(categoryName);
      chartSeries.push(minutes / 60); // Converter para horas
      chartColors.push(getCategoryColor(categoryName));
    }
  });
  
  // Adicionar tempo livre
  if (freeHours > 0) {
    chartLabels.push('Tempo Livre');
    chartSeries.push(freeHours);
    chartColors.push('#04ffb4ff');
  }

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'inherit',
    },
    labels: chartLabels,
    colors: chartColors,
    legend: {
      position: 'bottom',
      labels: {
        colors: theme.colors.text.primary,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              color: theme.colors.text.primary,
              fontSize: '14px'
            },
            value: {
              show: true,
              color: theme.colors.text.primary,
              fontSize: '16px',
              fontWeight: 'bold',
              formatter: (val: string) => {
                const hours = parseFloat(val);
                const totalMinutes = hours * 60;
                return formatTime(totalMinutes);
              }
            },
            total: {
              show: true,
              label: '24 horas',
              color: theme.colors.text.primary,
              fontSize: '14px',
              formatter: () => {
                const occupationRate = totalHours > 0 ? (occupiedHours / 24 * 100) : 0;
                return `${occupationRate.toFixed(1)}%`;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        colors: ['#ffffff'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      theme: theme.name === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => {
          const totalMinutes = val * 60;
          return formatTime(totalMinutes);
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const series = chartSeries;

  if (!selectedDate) {
    return (
      <div 
        className="h-80 rounded-lg border-2 border-dashed flex items-center justify-center"
        style={{ 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background 
        }}
      >
        <div className="text-center">
          <div 
            className="text-lg font-medium mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            Selecione um dia
          </div>
          <div 
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            Clique em uma barra do gráfico acima para ver detalhes
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          Grafico do Dia
        </h3>
        <p 
          className="text-sm mt-1"
          style={{ color: theme.colors.text.secondary }}
        >
          {formatDate(selectedDate)} - {taskCount} tarefa{taskCount !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Estatísticas por categoria */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        {Object.entries(categoryTime).map(([categoryName, minutes]) => {
          const color = getCategoryColor(categoryName);
          const categoria = categoriasPredefinidas.find(cat => cat.name === categoryName);
          
          return (
            <div 
              key={categoryName}
              className="p-2 rounded-lg text-center"
              style={{ 
                backgroundColor: color + '20',
                border: `1px solid ${color}`
              }}
            >
              <div className="text-lg font-bold" style={{ color: color }}>
                {categoria?.icon} {formatTime(minutes)}
              </div>
              <div style={{ color: theme.colors.text.secondary }}>
                {categoryName}
              </div>
            </div>
          );
        })}
        
        <div 
          className="p-2 rounded-lg text-center"
          style={{ 
            backgroundColor: theme.colors.border + '40',
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="text-lg font-bold" style={{ color: theme.colors.text.primary }}>
            {formatTime(freeHours * 60)}
          </div>
          <div style={{ color: theme.colors.text.secondary }}>
            Livre
          </div>
        </div>
      </div>

      <div className="h-80">
        <Chart
          options={options}
          series={series}
          type="donut"
          height="100%"
        />
      </div>
    </div>
  );
};