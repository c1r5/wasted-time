// Exportações públicas do módulo de eventos

// Types
export type { 
  Evento, 
  CalendarEvent, 
  TimeGap, 
  FiltroEvento, 
  EventoFormData,
  ColorOption 
} from './types/evento';

export { colorPalette } from './types/evento';

// Components
export { default as EventoModal } from './components/EventoModal';
export { default as EventoItem } from './components/EventoItem';

// Hooks
export { useEventos } from './hooks/useEventos';

// Services
export { eventosService } from './services/eventosService';

// Utils
export {
  eventosToCalendarEvents,
  generateDailyCalendarEvents,
  formatDuration,
  formatTime,
  formatDate,
  validateEvento
} from './utils/formatEvento';