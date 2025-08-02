import { useState, useCallback, useEffect } from 'react';
import type { Evento, EventoFormData, FiltroEvento } from '../types/evento';
import { validateEvento } from '../utils/formatEvento';
import { eventosService } from '../services/eventosService';

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega eventos do serviço na inicialização
   */
  useEffect(() => {
    const carregarEventosIniciais = async () => {
      setIsLoading(true);
      try {
        const eventosCarregados = await eventosService.carregarEventos();
        setEventos(eventosCarregados);
      } catch (err) {
        setError('Erro ao carregar eventos');
        console.error('Erro ao carregar eventos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEventosIniciais();
  }, []);

  /**
   * Adiciona um novo evento
   */
  const adicionarEvento = useCallback(async (eventoData: EventoFormData): Promise<boolean> => {
    const validationErrors = validateEvento(eventoData);
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return false;
    }

    setIsLoading(true);
    try {
      const novoEvento = await eventosService.adicionarEvento(eventoData);
      setEventos(prev => [...prev, novoEvento]);
      setError(null);
      return true;
    } catch (err) {
      setError('Erro ao adicionar evento');
      console.error('Erro ao adicionar evento:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Remove um evento por índice
   */
  const removerEvento = useCallback(async (index: number): Promise<boolean> => {
    const evento = eventos[index];
    if (!evento?.id) return false;

    setIsLoading(true);
    try {
      await eventosService.removerEvento(evento.id);
      setEventos(prev => prev.filter((_, i) => i !== index));
      setError(null);
      return true;
    } catch (err) {
      setError('Erro ao remover evento');
      console.error('Erro ao remover evento:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [eventos]);

  /**
   * Remove evento por ID
   */
  const removerEventoPorId = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await eventosService.removerEvento(id);
      setEventos(prev => prev.filter(evento => evento.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError('Erro ao remover evento');
      console.error('Erro ao remover evento:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza um evento
   */
  const atualizarEvento = useCallback(async (id: string, eventoData: Partial<Evento>): Promise<boolean> => {
    const validationErrors = validateEvento(eventoData);
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return false;
    }

    setIsLoading(true);
    try {
      const eventoAtualizado = await eventosService.atualizarEvento(id, eventoData);
      setEventos(prev => 
        prev.map(evento => 
          evento.id === id ? eventoAtualizado : evento
        )
      );
      setError(null);
      return true;
    } catch (err) {
      setError('Erro ao atualizar evento');
      console.error('Erro ao atualizar evento:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Filtra eventos
   */
  const filtrarEventos = useCallback((filtro: FiltroEvento): Evento[] => {
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
  }, [eventos]);

  /**
   * Busca evento por ID
   */
  const buscarEventoPorId = useCallback((id: string): Evento | undefined => {
    return eventos.find(evento => evento.id === id);
  }, [eventos]);

  /**
   * Limpa todos os eventos
   */
  const limparEventos = useCallback(() => {
    setEventos([]);
  }, []);

  /**
   * Limpa erro
   */
  const limparError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    eventos,
    isLoading,
    error,
    
    // Ações
    adicionarEvento,
    removerEvento,
    removerEventoPorId,
    atualizarEvento,
    filtrarEventos,
    buscarEventoPorId,
    limparEventos,
    limparError
  };
}