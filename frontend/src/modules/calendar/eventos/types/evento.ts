export interface Evento {
  id?: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  color: string;
  isDaily: boolean;
  description?: string;
  category?: string;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  opacity?: number;
  classNames?: string[];
  display?: string;
}

export interface TimeGap {
  start: string;
  end: string;
  duration: number; // em segundos
  date: string;
}

export interface FiltroEvento {
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
  apenasDiarios?: boolean;
}

export interface EventoFormData extends Omit<Evento, 'id'> {
  // Campos específicos do formulário podem ser adicionados aqui
}

// Cores disponíveis para eventos
export const colorPalette = [
  { name: 'Azul', value: '#3b82f6', border: '#2563eb' },
  { name: 'Verde', value: '#10b981', border: '#059669' },
  { name: 'Amarelo', value: '#f59e0b', border: '#d97706' },
  { name: 'Vermelho', value: '#ef4444', border: '#dc2626' },
  { name: 'Roxo', value: '#8b5cf6', border: '#7c3aed' },
  { name: 'Rosa', value: '#ec4899', border: '#db2777' },
  { name: 'Índigo', value: '#6366f1', border: '#4f46e5' },
  { name: 'Esmeralda', value: '#059669', border: '#047857' }
] as const;

export type ColorOption = typeof colorPalette[number];