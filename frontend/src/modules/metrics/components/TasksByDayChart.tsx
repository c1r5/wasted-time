import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useThemeContext } from '../../shared';

interface TasksByDayChartProps {
  dates: string[];
  taskCounts: number[];
  onDayClick: (dayIndex: number, date: string) => void;
}

export const TasksByDayChart: React.FC<TasksByDayChartProps> = ({ 
  dates, 
  taskCounts, 
  onDayClick 
}) => {
  const { theme } = useThemeContext();

  const hasValidData = dates.length > 0 && taskCounts.some(count => count > 0);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const dayIndex = config.dataPointIndex;
          const selectedDate = dates[dayIndex];
          onDayClick(dayIndex, selectedDate);
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false, // Desabilitado para não poluir com muitos dias
    },
    xaxis: {
      categories: dates,
      labels: {
        style: {
          colors: theme.colors.text.secondary,
          fontSize: '12px'
        }
      },
      axisBorder: {
        color: theme.colors.border
      },
      axisTicks: {
        color: theme.colors.border
      }
    },
    yaxis: {
      title: {
        text: 'Quantidade de Tarefas',
        style: {
          color: theme.colors.text.secondary,
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          colors: theme.colors.text.secondary,
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: theme.colors.border,
      strokeDashArray: 3,
    },
    colors: ['#3b82f6'], // Azul para as barras
    tooltip: {
      theme: theme.name === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => `${val} tarefa${val !== 1 ? 's' : ''}`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '80%'
            }
          }
        },
      },
    ],
  };

  const series = [{
    name: 'Tarefas',
    data: taskCounts
  }];

  if (!hasValidData) {
    return (
      <div 
        className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center"
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
            Nenhuma tarefa encontrada
          </div>
          <div 
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            Adicione tarefas ao calendário para ver as métricas
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
          Tarefas por Dia - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <p 
          className="text-sm mt-1"
          style={{ color: theme.colors.text.secondary }}
        >
          Clique em um dia para ver detalhes de ocupação de 24h
        </p>
      </div>
      <div className="h-96">
        <Chart
          options={options}
          series={series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};