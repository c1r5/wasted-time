import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useThemeContext } from '../../shared';
import { categoriasPredefinidas } from '../../calendar/eventos';

interface CategoryTimeChartProps {
  labels: string[];
  series: number[];
}

export const CategoryTimeChart: React.FC<CategoryTimeChartProps> = ({ labels, series }) => {
  const { theme } = useThemeContext();
  
  // Debug: verificar se temos dados válidos
  const hasValidData = labels.length > 0 && series.length > 0 && series.some(val => val > 0);
  
  // Mapear cores das categorias
  const getCategoryColors = (labels: string[]) => {
    return labels.map(label => {
      const categoria = categoriasPredefinidas.find(cat => 
        cat.value === label || cat.name.toLowerCase() === label.toLowerCase()
      );
      return categoria?.color || '#6b7280'; // cor padrão se não encontrar
    });
  };
  
  const categoryColors = getCategoryColors(labels);

  // Se não há dados válidos, mostrar gráfico vazio
  const displayLabels = hasValidData ? labels : ['Sem dados'];
  const displaySeries = hasValidData ? series : [1];
  const displayColors = hasValidData ? categoryColors : ['#e5e7eb'];

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'inherit',
    },
    labels: displayLabels,
    colors: displayColors,
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
            total: {
              show: true,
              label: 'Total',
              color: theme.colors.text.primary,
              formatter: () => {
                const total = displaySeries.reduce((acc, val) => {
                  const num = Number(val);
                  return acc + (isNaN(num) ? 0 : num);
                }, 0);
                return hasValidData ? `${total.toFixed(1)}h` : '0h';
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
        formatter: (val: number) => `${val.toFixed(1)} horas`,
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

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: theme.colors.text.primary }}
        >
          Tempo Gasto por Categoria
        </h3>
        <p 
          className="text-sm mt-1"
          style={{ color: theme.colors.text.secondary }}
        >
          Distribuição do tempo total em horas por categoria de atividade
        </p>
      </div>
      <div className="h-80 relative">
        <Chart
          options={options}
          series={displaySeries}
          type="donut"
          height="100%"
        />
        {!hasValidData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white bg-opacity-90 p-4 rounded">
              <div 
                className="text-sm font-medium"
                style={{ color: theme.colors.text.secondary }}
              >
                Adicione eventos para ver as métricas
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};