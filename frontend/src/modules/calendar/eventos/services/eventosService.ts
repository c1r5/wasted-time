import type { Evento, FiltroEvento } from '../types/evento';

/**
 * Serviço para operações de eventos
 * Atualmente usando localStorage, mas pode ser facilmente adaptado para API
 */
class EventosService {
  private readonly STORAGE_KEY = 'time-manager-eventos';

  /**
   * Carrega eventos do localStorage
   */
  async carregarEventos(): Promise<Evento[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      return [];
    }
  }

  /**
   * Salva eventos no localStorage
   */
  async salvarEventos(eventos: Evento[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventos));
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
      throw new Error('Não foi possível salvar os eventos');
    }
  }

  /**
   * Adiciona um novo evento
   */
  async adicionarEvento(evento: Omit<Evento, 'id'>): Promise<Evento> {
    const eventos = await this.carregarEventos();
    const novoEvento: Evento = {
      ...evento,
      id: crypto.randomUUID()
    };
    
    eventos.push(novoEvento);
    await this.salvarEventos(eventos);
    
    return novoEvento;
  }

  /**
   * Atualiza um evento existente
   */
  async atualizarEvento(id: string, dadosAtualizados: Partial<Evento>): Promise<Evento> {
    const eventos = await this.carregarEventos();
    const index = eventos.findIndex(evento => evento.id === id);
    
    if (index === -1) {
      throw new Error('Evento não encontrado');
    }
    
    eventos[index] = { ...eventos[index], ...dadosAtualizados };
    await this.salvarEventos(eventos);
    
    return eventos[index];
  }

  /**
   * Remove um evento
   */
  async removerEvento(id: string): Promise<void> {
    const eventos = await this.carregarEventos();
    const eventosFiltrados = eventos.filter(evento => evento.id !== id);
    
    if (eventosFiltrados.length === eventos.length) {
      throw new Error('Evento não encontrado');
    }
    
    await this.salvarEventos(eventosFiltrados);
  }

  /**
   * Busca um evento por ID
   */
  async buscarEventoPorId(id: string): Promise<Evento | null> {
    const eventos = await this.carregarEventos();
    return eventos.find(evento => evento.id === id) || null;
  }

  /**
   * Filtra eventos
   */
  async filtrarEventos(filtro: FiltroEvento): Promise<Evento[]> {
    const eventos = await this.carregarEventos();
    
    return eventos.filter(evento => {
      if (filtro.categoria && evento.category !== filtro.categoria) {
        return false;
      }
      
      if (filtro.apenasDiarios !== undefined && evento.isDaily !== filtro.apenasDiarios) {
        return false;
      }
      
      if (filtro.dataInicio && !evento.isDaily && evento.startDate < filtro.dataInicio) {
        return false;
      }
      
      if (filtro.dataFim && !evento.isDaily && evento.endDate > filtro.dataFim) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Exporta eventos para JSON
   */
  async exportarEventos(): Promise<string> {
    const eventos = await this.carregarEventos();
    return JSON.stringify(eventos, null, 2);
  }

  /**
   * Importa eventos de JSON
   */
  async importarEventos(jsonData: string): Promise<Evento[]> {
    try {
      const eventos: Evento[] = JSON.parse(jsonData);
      
      // Validação básica
      if (!Array.isArray(eventos)) {
        throw new Error('Dados inválidos: esperado um array de eventos');
      }
      
      // Adiciona IDs se não existirem
      const eventosComId = eventos.map(evento => ({
        ...evento,
        id: evento.id || crypto.randomUUID()
      }));
      
      await this.salvarEventos(eventosComId);
      return eventosComId;
    } catch (error) {
      console.error('Erro ao importar eventos:', error);
      throw new Error('Não foi possível importar os eventos');
    }
  }
}

// Instância singleton do serviço
export const eventosService = new EventosService();