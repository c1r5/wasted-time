import { useState, useEffect } from 'react';
import type { Evento, EventoFormData } from '../types/evento';
import { colorPalette } from '../types/evento';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Evento
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome do evento"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Início
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Fim
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Data Início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!formData.isDaily}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${formData.isDaily ? 'text-gray-400' : 'text-gray-700'}`}>
                Data Fim
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                  formData.isDaily 
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                }`}
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
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Evento diário (repetir todos os dias do mês)
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {day.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cor do Evento
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  className={`w-12 h-12 rounded-md border-2 hover:scale-105 transition-transform ${
                    formData.color === color.value 
                      ? 'border-gray-800 shadow-lg' 
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adicione uma descrição..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {evento ? 'Atualizar' : 'Criar'} Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}