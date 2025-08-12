import type { Evento } from '../types/evento';
import { formatTime, formatDate } from '../utils/formatEvento';
import { categoriasPredefinidas } from '../types/evento';
import { useThemeContext } from '../../../shared';

interface EventoItemProps {
  evento: Evento;
  index: number;
  onDelete: (index: number) => void;
  onEdit?: (evento: Evento) => void;
}

export default function EventoItem({ evento, index, onDelete, onEdit }: EventoItemProps) {
  const { theme } = useThemeContext();
  
  // Encontrar a categoria predefinida
  const categoria = categoriasPredefinidas.find(cat => cat.value === evento.category);
  
  return (
    <div 
      className="rounded-lg p-3"
      style={{
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 
              className="font-medium text-sm"
              style={{ color: theme.colors.text.primary }}
            >
              {evento.title}
            </h4>
            {evento.isDaily && (
              <span 
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: theme.colors.primary + '20',
                  color: theme.colors.primary
                }}
              >
                Diária
              </span>
            )}
          </div>
          
          <div className="mt-1">
            <p 
              className="text-xs"
              style={{ color: theme.colors.text.secondary }}
            >
              {formatTime(evento.startTime)} - {formatTime(evento.endTime)}
            </p>
            {!evento.isDaily && (
              <p 
                className="text-xs"
                style={{ color: theme.colors.text.secondary }}
              >
                {formatDate(evento.startDate)} até {formatDate(evento.endDate)}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: evento.color }}
              title="Cor do evento"
            />
            {categoria && (
              <span 
                className="text-xs"
                style={{ color: theme.colors.text.secondary }}
              >
                {categoria.icon} {categoria.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          {onEdit && (
            <button
              onClick={() => onEdit(evento)}
              className="p-1 rounded transition-colors"
              style={{ 
                color: theme.colors.text.secondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.text.secondary + '20';
                e.currentTarget.style.color = theme.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.text.secondary;
              }}
              title="Editar evento"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onDelete(index)}
            className="p-1 rounded transition-colors"
            style={{ 
              color: '#ef4444',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef444420';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ef4444';
            }}
            title="Excluir evento"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}