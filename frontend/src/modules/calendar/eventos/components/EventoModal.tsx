import { useState, useEffect } from 'react';
import type { Evento, EventoFormData } from '../types/evento';
import { colorPalette } from '../types/evento';
import { useThemeContext } from '../../../shared';

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evento: EventoFormData) => void;
  evento?: Evento | null;
  title?: string;
}

export default function EventoModal({
  isOpen,
  onClose,
  onSubmit,
  evento = null,
  title = "Novo Evento"
}: EventoModalProps) {
  const { theme } = useThemeContext();

  const [formData, setFormData] = useState<EventoFormData>({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    color: colorPalette[0].value,
    isDaily: false,
    weekDays: [],
    description: '',
    category: ''
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        title: evento.title,
        startDate: evento.startDate,
        startTime: evento.startTime,
        endDate: evento.endDate,
        endTime: evento.endTime,
        color: evento.color,
        isDaily: evento.isDaily,
        weekDays: evento.weekDays || [],
        description: evento.description || '',
        category: evento.category || ''
      });
    } else {
      // Reset form para novo evento
      setFormData({
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        color: colorPalette[0].value,
        isDaily: false,
        weekDays: [],
        description: '',
        category: ''
      });
    }
  }, [evento, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (field: keyof EventoFormData, value: string | boolean | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: `0 10px 25px ${theme.colors.shadow}`
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              color: theme.colors.text.secondary,
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.colors.text.secondary }}
            >
              Nome do Evento
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border}`,
              }}
              placeholder="Digite o nome do evento"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.text.secondary }}
              >
                Hora Início
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                }}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.text.secondary }}
              >
                Hora Fim
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.colors.text.secondary }}
              >
                Data Início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                }}
                required={!formData.isDaily}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{
                  color: formData.isDaily
                    ? theme.colors.text.secondary + '80'
                    : theme.colors.text.secondary
                }}
              >
                Data Fim
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none"
                style={{
                  backgroundColor: formData.isDaily ? theme.colors.border : theme.colors.background,
                  color: formData.isDaily ? theme.colors.text.secondary + '80' : theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                  cursor: formData.isDaily ? 'not-allowed' : 'auto'
                }}
                disabled={formData.isDaily}
                required={!formData.isDaily}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isDaily}
                onChange={(e) => handleInputChange('isDaily', e.target.checked)}
                className="rounded"
                style={{
                  accentColor: theme.colors.primary,
                  borderColor: theme.colors.border
                }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Evento diário (repetir todos os dias do mês)
              </span>
            </label>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: theme.colors.text.secondary }}
            >
              Dias da semana
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 1, label: 'Seg' },
                { value: 2, label: 'Ter' },
                { value: 3, label: 'Qua' },
                { value: 4, label: 'Qui' },
                { value: 5, label: 'Sex' },
                { value: 6, label: 'Sáb' },
                { value: 0, label: 'Dom' }
              ].map((day) => (
                <label key={day.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.weekDays?.includes(day.value) || false}
                    onChange={(e) => {
                      const weekDays = formData.weekDays || [];
                      if (e.target.checked) {
                        handleInputChange('weekDays', [...weekDays, day.value]);
                      } else {
                        handleInputChange('weekDays', weekDays.filter(d => d !== day.value));
                      }
                    }}
                    className="rounded"
                    style={{
                      accentColor: theme.colors.primary,
                      borderColor: theme.colors.border
                    }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {day.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: theme.colors.text.secondary }}
            >
              Cor do Evento
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  className="w-12 h-12 rounded-md border-2 hover:scale-105 transition-transform"
                  style={{
                    borderColor: formData.color === color.value
                      ? theme.colors.text.primary
                      : theme.colors.border,
                    boxShadow: formData.color === color.value
                      ? `0 4px 6px ${theme.colors.shadow}`
                      : 'none'
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.colors.text.secondary }}
            >
              Descrição (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border}`,
              }}
              placeholder="Adicione uma descrição..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 px-4 py-2 rounded-md focus:outline-none font-medium"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2 px-4 rounded-md focus:outline-none font-medium"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.surface,
                border: `1px solid ${theme.colors.primary}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
                e.currentTarget.style.borderColor = theme.colors.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
            >
              {evento ? 'Atualizar' : 'Criar'} Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}