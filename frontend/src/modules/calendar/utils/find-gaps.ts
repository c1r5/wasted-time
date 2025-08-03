import type { Evento, CalendarEvent, TimeGap } from '../eventos/types/evento';

/**
 * Converte Evento em eventos do calendário
 */
export function tasksToEvents(tasks: Evento[]): CalendarEvent[] {
  return tasks.flatMap(task => {
    if (task.isDaily) {
      return generateDailyEvents(task);
    } else {
      return [{
        title: task.title,
        start: `${task.startDate}T${task.startTime}:00`,
        end: `${task.endDate}T${task.endTime}:00`
      }];
    }
  });
}

/**
 * Gera eventos diários para todo o mês
 */
function generateDailyEvents(task: Evento): CalendarEvent[] {
  const events = [];
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];

    events.push({
      title: task.title,
      start: `${dateStr}T${task.startTime}:00`,
      end: `${dateStr}T${task.endTime}:00`
    });
  }

  return events;
}

/**
 * Converte string de tempo para minutos desde meia-noite
 */
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converte minutos desde meia-noite para string de tempo
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Mescla eventos sobrepostos ou contíguos
 */
function mergeOverlappingEvents(events: { start: number; end: number }[]): { start: number; end: number }[] {
  if (events.length === 0) return [];

  const merged: { start: number; end: number }[] = [];
  let current = events[0];

  for (let i = 1; i < events.length; i++) {
    const next = events[i];

    // Se há sobreposição ou são contíguos (diferença <= 15 minutos)
    if (next.start <= current.end + 15) {
      // Mescla os eventos
      current.end = Math.max(current.end, next.end);
    } else {
      // Não há sobreposição, adiciona o atual e move para o próximo
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
}

/**
 * Encontra lacunas de tempo em um dia específico
 */
export function findGapsForDate(events: CalendarEvent[], targetDate: string): TimeGap[] {
  // Filtra eventos do dia específico
  const dayEvents = events
    .filter(event => event.start.startsWith(targetDate))
    .map(event => {
      const startTime = event.start.split('T')[1].substring(0, 5);
      const endTime = event.end.split('T')[1].substring(0, 5);
      let endMinutes = timeToMinutes(endTime);
      
      // Se o evento termina em 00:00, considerar como 23:59 (1439 minutos)
      if (endMinutes === 0 && endTime === '00:00') {
        endMinutes = 23 * 60 + 59; // 1439 minutos = 23:59
      }
      
      return {
        start: timeToMinutes(startTime),
        end: endMinutes
      };
    })
    .sort((a, b) => a.start - b.start);

  // Mescla eventos sobrepostos ou muito próximos
  const mergedEvents = mergeOverlappingEvents(dayEvents);

  if (mergedEvents.length === 0) {
    // Dia completamente livre
    return [{
      start: `${targetDate}T00:00:00`,
      end: `${targetDate}T24:00:00`,
      duration: 24 * 60 * 60, // 24 horas em segundos
      date: targetDate
    }];
  }

  const gaps: TimeGap[] = [];
  const dayStart = 0 * 60; // 00:00
  const dayEnd = 24 * 60; // 24:00

  // Gap antes do primeiro evento
  if (mergedEvents.length > 0 && mergedEvents[0].start > dayStart) {
    const durationMinutes = mergedEvents[0].start - dayStart;
    if (durationMinutes >= 15) { // >= 15 minutos
      gaps.push({
        start: `${targetDate}T${minutesToTime(dayStart)}:00`,
        end: `${targetDate}T${minutesToTime(mergedEvents[0].start)}:00`,
        duration: durationMinutes * 60, // converter para segundos
        date: targetDate
      });
    }
  }

  // Gaps entre eventos mesclados
  for (let i = 0; i < mergedEvents.length - 1; i++) {
    const currentEnd = mergedEvents[i].end;
    const nextStart = mergedEvents[i + 1].start;
    const durationMinutes = nextStart - currentEnd;

    if (durationMinutes >= 15) { // >= 15 minutos
      gaps.push({
        start: `${targetDate}T${minutesToTime(currentEnd)}:00`,
        end: `${targetDate}T${minutesToTime(nextStart)}:00`,
        duration: durationMinutes * 60, // converter para segundos
        date: targetDate
      });
    }
  }

  // Gap após o último evento
  if (mergedEvents.length > 0) {
    const lastEvent = mergedEvents[mergedEvents.length - 1];
    if (lastEvent.end < dayEnd) {
      const durationMinutes = dayEnd - lastEvent.end;
      if (durationMinutes >= 15) { // >= 15 minutos
        gaps.push({
          start: `${targetDate}T${minutesToTime(lastEvent.end)}:00`,
          end: `${targetDate}T${minutesToTime(dayEnd)}:00`,
          duration: durationMinutes * 60, // converter para segundos
          date: targetDate
        });
      }
    }
  }

  return gaps;
}

/**
 * Encontra todas as lacunas de tempo para um array de tarefas
 */
export function findAllGaps(tasks: Evento[], targetDate?: string): TimeGap[] {
  const events = tasksToEvents(tasks);
  console.log('Converted events:', events);

  if (targetDate) {
    return findGapsForDate(events, targetDate);
  }

  // Se não especificar data, procura gaps para o mês atual
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const allGaps: TimeGap[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayGaps = findGapsForDate(events, dateStr);
    if (dayGaps.length > 0) {
      console.log(`Gaps found for ${dateStr}:`, dayGaps);
    }
    allGaps.push(...dayGaps);
  }

  console.log('Total gaps found:', allGaps.length);
  return allGaps;
}

/**
 * Converte gaps em eventos para exibição no calendário
 */
export function gapsToCalendarEvents(gaps: TimeGap[]): any[] {
  return gaps.map(gap => {
    const totalMinutes = Math.floor(gap.duration / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let durationText = '';
    if (hours > 0) {
      durationText = `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    } else {
      durationText = `${minutes}m`;
    }

    return {
      title: durationText,
      start: gap.start,
      end: gap.end,
      backgroundColor: '#22c55e',
      borderColor: '#16a34a',
      textColor: '#ffffff',
      opacity: 0.7,
      classNames: ['time-gap-event'],
      display: 'background'
    };
  });
}