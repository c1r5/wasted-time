import { useState } from 'react';
import type { Evento } from '../../calendar/eventos';
import { categoriasPredefinidas } from '../../calendar/eventos';
// import { findAllGaps, tasksToEvents } from '../../calendar/utils/find-gaps';

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
  const calculateTotalTime = (events: Evento[]) => {
    // Implementação futura
    console.log('Events:', events);
    return 0;
  };

  const calculateProductivityGaps = (events: Evento[]) => {
    // Implementação futura
    console.log('Events:', events);
    return [];
  };

  const calculateTimeByCategory = (events: Evento[]) => {
    console.log('=== CALCULATE TIME BY CATEGORY ===');
    console.log('Events recebidos:', events);
    const categoryTime: { [key: string]: number } = {};
    
    events.forEach((event, index) => {
      console.log(`Processando evento ${index}:`, event);
      
      // Encontrar a categoria predefinida ou usar 'Sem categoria'
      const categoriaEncontrada = categoriasPredefinidas.find(cat => cat.value === event.category);
      const categoryName = categoriaEncontrada ? categoriaEncontrada.name : 'Sem categoria';
      
      console.log(`Categoria encontrada:`, categoriaEncontrada);
      console.log(`Nome da categoria:`, categoryName);
      
      // Para eventos de um dia só, usar a mesma data de início para o fim
      const endDateToUse = event.endDate || event.startDate;
      
      const startDateTime = new Date(`${event.startDate}T${event.startTime}`);
      const endDateTime = new Date(`${endDateToUse}T${event.endTime}`);
      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60); // em minutos
      
      console.log(`Start: ${event.startDate}T${event.startTime} -> ${startDateTime}`);
      console.log(`End: ${endDateToUse}T${event.endTime} -> ${endDateTime}`);
      console.log(`Duration: ${duration} minutos`);
      
      if (duration > 0) { // Só adicionar se a duração for positiva
        if (categoryTime[categoryName]) {
          categoryTime[categoryName] += duration;
        } else {
          categoryTime[categoryName] = duration;
        }
        console.log(`Adicionado à categoria ${categoryName}: ${duration} minutos`);
      } else {
        console.log(`Duração inválida (${duration}), evento ignorado`);
      }
    });
    
    console.log('Resultado categoryTime:', categoryTime);
    return categoryTime;
  };

  const calculateTasksByDay = (events: Evento[]) => {
    console.log('=== CALCULATE TASKS BY DAY ===');
    
    // Obter todos os dias do mês atual
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const tasksData: { [date: string]: { count: number, occupiedMinutes: number } } = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Filtrar eventos do dia
      const dayEvents = events.filter(event => {
        if (event.isDaily) {
          return true; // Eventos diários aparecem todos os dias
        }
        return event.startDate === dateStr || 
               (event.startDate <= dateStr && event.endDate >= dateStr);
      });
      
      // Calcular tempo ocupado
      let occupiedMinutes = 0;
      dayEvents.forEach(event => {
        const endDateToUse = event.endDate || event.startDate;
        const startDateTime = new Date(`${event.startDate}T${event.startTime}`);
        const endDateTime = new Date(`${endDateToUse}T${event.endTime}`);
        const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        
        if (duration > 0) {
          occupiedMinutes += duration;
        }
      });
      
      tasksData[dateStr] = {
        count: dayEvents.length,
        occupiedMinutes: Math.min(occupiedMinutes, 24 * 60) // Máximo 24h por dia
      };
    }
    
    console.log('Tasks data:', tasksData);
    return tasksData;
  };

  const generateChartData = (events: Evento[]) => {
    const tasksData = calculateTasksByDay(events);
    
    // Preparar dados para gráfico de tarefas por dia
    const dates = Object.keys(tasksData);
    const taskCounts = dates.map(date => tasksData[date].count);
    const formattedDates = dates.map(date => {
      const d = new Date(date);
      return d.getDate().toString(); // Apenas o número do dia
    });
    
    return {
      tasksByDay: {
        dates: formattedDates,
        rawDates: dates, // Para uso interno
        taskCounts,
        tasksData // Dados completos para cálculos
      }
    };
  };
  
  const getDayOccupationData = (events: Evento[], selectedDate: string) => {
    console.log('=== GET DAY OCCUPATION DATA ===');
    console.log('Selected date:', selectedDate);
    console.log('All events:', events);
    
    // Filtrar eventos do dia específico
    const dayEvents = events.filter(event => {
      if (event.isDaily) {
        return true; // Eventos diários aparecem todos os dias
      }
      return event.startDate === selectedDate || 
             (event.startDate <= selectedDate && event.endDate >= selectedDate);
    });
    
    console.log('Day events:', dayEvents);
    
    // Calcular tempo por categoria
    const categoryTime: { [key: string]: number } = {};
    let totalOccupiedMinutes = 0;
    
    dayEvents.forEach((event, index) => {
      console.log(`Processando evento do dia ${index}:`, event);
      
      // Encontrar a categoria predefinida ou usar 'Sem categoria'
      const categoriaEncontrada = categoriasPredefinidas.find(cat => cat.value === event.category);
      const categoryName = categoriaEncontrada ? categoriaEncontrada.name : 'Sem categoria';
      const categoryColor = categoriaEncontrada ? categoriaEncontrada.color : '#6b7280';
      
      console.log(`Categoria: ${categoryName}, Cor: ${categoryColor}`);
      
      // Para eventos de um dia só, usar a mesma data de início para o fim
      const endDateToUse = event.endDate || event.startDate;
      
      const startDateTime = new Date(`${event.startDate}T${event.startTime}`);
      const endDateTime = new Date(`${endDateToUse}T${event.endTime}`);
      const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60); // em minutos
      
      console.log(`Duração: ${duration} minutos`);
      
      if (duration > 0) {
        if (categoryTime[categoryName]) {
          categoryTime[categoryName] += duration;
        } else {
          categoryTime[categoryName] = duration;
        }
        totalOccupiedMinutes += duration;
        console.log(`Total ocupado: ${totalOccupiedMinutes} minutos`);
      }
    });
    
    // Limitar a 24h por dia
    totalOccupiedMinutes = Math.min(totalOccupiedMinutes, 24 * 60);
    const occupiedHours = totalOccupiedMinutes / 60;
    const freeHours = 24 - occupiedHours;
    
    console.log('Category time:', categoryTime);
    console.log(`Horas ocupadas: ${occupiedHours}, Horas livres: ${freeHours}`);
    
    return {
      occupiedHours,
      freeHours,
      taskCount: dayEvents.length,
      categoryTime: categoryTime // Novo campo com tempo por categoria
    };
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    getMetricsButton,
    calculateTotalTime,
    calculateProductivityGaps,
    calculateTimeByCategory,
    generateChartData,
    getDayOccupationData
  };
};