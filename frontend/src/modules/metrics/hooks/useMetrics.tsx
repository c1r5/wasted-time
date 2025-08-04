import { useState } from 'react';
import type { Evento } from '../../calendar/eventos';

export const useMetrics = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getMetricsButton = () => ({
    metricsToggle: {
      text: 'Métricas',
      click: openModal
    }
  });

  // Funções futuras para calcular métricas
  const calculateTotalTime = (_events: Evento[]) => {
    // Implementação futura
    return 0;
  };

  const calculateProductivityGaps = (_events: Evento[]) => {
    // Implementação futura
    return [];
  };

  const generateChartData = (_events: Evento[]) => {
    // Implementação futura
    return {};
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    getMetricsButton,
    calculateTotalTime,
    calculateProductivityGaps,
    generateChartData
  };
};