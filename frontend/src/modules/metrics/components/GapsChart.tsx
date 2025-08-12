import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useThemeContext } from '../../shared';

interface GapsChartProps {
  dates: string[];
  counts: number[];
  hours: number[];
}

export const GapsChart: React.FC<GapsChartProps> = ({ dates, counts, hours }) => {
  const { theme } = useThemeContext();

  // Debug: verificar se temos dados válidos
  const hasValidData = dates.length > 0 && (counts.some(val => val > 0) || hours.some(val => val > 0));

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme.colors.text.primary],
        fontSize: '12px',
      },
      formatter: (val: number) => {
        return val > 0 ? val.toString() : '';
      }
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
    yaxis: [
      {
        title: {
          text: 'Tempo Livre',
          style: {
            color: theme.colors.text.secondary,
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: theme.colors.text.secondary,
            fontSize: '12px'
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Tempo Total (horas)',
          style: {
            color: theme.colors.text.secondary,
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: theme.colors.text.secondary,
            fontSize: '12px'
          }
        }
      }
    ],
    legend: {
      position: 'top',
      labels: {
        colors: theme.colors.text.primary,
      },
    },
    grid: {
      borderColor: theme.colors.border,
      strokeDashArray: 3,
    },
    colors: ['#ef4444', '#f59e0b'], // Vermelho para quantidade, amarelo para horas
    tooltip: {
      theme: theme.name === 'dark' ? 'dark' : 'light',
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

  const series = [
    {
      name: 'Tempo Livre',
      type: 'column',
      data: counts
    },
    {
      name: 'Total (h)',
      type: 'column',
      yAxisIndex: 1,
      data: hours
    }
  ];

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
            Nenhum tempo livre
          </div>
          <div
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            Gaps são períodos livres entre seus eventos
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
          Gaps de Produtividade
        </h3>
        <p
          className="text-sm mt-1"
          style={{ color: theme.colors.text.secondary }}
        >
          Períodos livres entre eventos - quantidade e tempo total por dia
        </p>
      </div>
      <div className="h-80">
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
