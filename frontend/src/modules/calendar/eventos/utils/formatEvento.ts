import type { Evento, CalendarEvent } from '../types/evento';

/**
 * Converte Evento em eventos do calendário
 */
export function eventosToCalendarEvents(eventos: Evento[]): CalendarEvent[] {
  return eventos.flatMap(evento => {
    if (evento.isDaily) {
      return generateDailyCalendarEvents(evento);
    } else {
      // Verificar se é um evento que passa da meia-noite
      const startTime = evento.startTime;
      const endTime = evento.endTime;
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
      const isOvernightEvent = endMinutes < startMinutes;

      if (isOvernightEvent) {
        // Criar dois eventos: um no dia atual até 24:00 e outro no próximo dia de 00:00 até o horário final
        const events = [];
        
        // Evento único: do horário inicial no primeiro dia até o horário final no segundo dia
        events.push({
          title: evento.title,
          start: `${evento.startDate}T${evento.startTime}:00`,
          end: `${evento.endDate}T${evento.endTime}:00`,
          backgroundColor: evento.color,
          borderColor: evento.color
        });

        return events;
      } else {
        return [{
          title: evento.title,
          start: `${evento.startDate}T${evento.startTime}:00`,
          end: `${evento.endDate}T${evento.endTime}:00`,
          backgroundColor: evento.color,
          borderColor: evento.color
        }];
      }
    }
  });
}

/**
 * Gera eventos do calendário para todos os dias do mês
 */
export function generateDailyCalendarEvents(evento: Evento): CalendarEvent[] {
  const events = [];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Verificar se é um evento que passa da meia-noite
  const startTime = evento.startTime;
  const endTime = evento.endTime;
  const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
  const isOvernightEvent = endMinutes < startMinutes;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, etc.
    const dateStr = date.toISOString().split('T')[0];

    // Se weekDays estiver definido, verificar se o dia da semana está incluído
    if (evento.weekDays && evento.weekDays.length > 0) {
      if (!evento.weekDays.includes(dayOfWeek)) {
        continue; // Pular este dia se não estiver nos dias da semana selecionados
      }
    }

    if (isOvernightEvent) {
      // Criar dois eventos para eventos que passam da meia-noite
      
      // Evento único que atravessa a meia-noite
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateStr = nextDate.toISOString().split('T')[0];
      
      events.push({
        title: evento.title,
        start: `${dateStr}T${evento.startTime}:00`,
        end: `${nextDateStr}T${evento.endTime}:00`,
        backgroundColor: evento.color,
        borderColor: evento.color
      });
    } else {
      events.push({
        title: evento.title,
        start: `${dateStr}T${evento.startTime}:00`,
        end: `${dateStr}T${evento.endTime}:00`,
        backgroundColor: evento.color,
        borderColor: evento.color
      });
    }
  }

  return events;
}

/**
 * Formata duração em texto amigável
 */
export function formatDuration(durationInSeconds: number): string {
  const totalMinutes = Math.floor(durationInSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Formata horário para exibição
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Formata data para exibição
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

/**
 * Valida se um evento é válido
 */
export function validateEvento(evento: Partial<Evento>): string[] {
  const errors: string[] = [];

  if (!evento.title?.trim()) {
    errors.push('Título é obrigatório');
  }

  if (!evento.startTime) {
    errors.push('Hora de início é obrigatória');
  }

  if (!evento.endTime) {
    errors.push('Hora de fim é obrigatória');
  }

  if (!evento.isDaily && (!evento.startDate || !evento.endDate)) {
    errors.push('Datas são obrigatórias para eventos não diários');
  }

  // if (evento.startTime && evento.endTime && evento.startTime >= evento.endTime) {
  //   errors.push('Hora de início deve ser anterior à hora de fim');
  // }

  return errors;
}