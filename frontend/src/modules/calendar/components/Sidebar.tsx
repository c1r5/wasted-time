import { useState } from 'react';
import { type Evento, colorPalette, EventoItem, EventoModal } from '../eventos';

interface SidebarProps {
  onAddTask: (task: Omit<Evento, 'id'>) => Promise<boolean>;
  tasks: Evento[];
  onDeleteTask: (index: number) => Promise<boolean>;
  onUpdateTask?: (id: string, task: Partial<Evento>) => Promise<boolean>;
  isLoading?: boolean;
  error?: string | null;
}

export default function Sidebar({ 
  onAddTask, 
  tasks, 
  onDeleteTask, 
  onUpdateTask,
  isLoading = false,
  error 
}: SidebarProps) {
  const [formData, setFormData] = useState<Omit<Evento, 'id'>>({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    color: colorPalette[0].value,
    isDaily: false,
    weekDays: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValidTask = formData.title && formData.startTime && formData.endTime && 
      (formData.isDaily || (formData.startDate && formData.endDate));
    
    if (isValidTask) {
      setSubmitError(null);
      const success = await onAddTask(formData);
      
      if (success) {
        setFormData({
          title: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          color: colorPalette[0].value,
          isDaily: false,
          weekDays: []
        });
      } else {
        setSubmitError('Erro ao adicionar evento. Verifique os dados e tente novamente.');
      }
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvent(evento);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (eventoData: Omit<Evento, 'id'>) => {
    if (editingEvent && onUpdateTask) {
      const success = await onUpdateTask(editingEvent.id!, eventoData);
      if (success) {
        setIsModalOpen(false);
        setEditingEvent(null);
      }
    }
  };

  const handleDelete = async (index: number) => {
    const success = await onDeleteTask(index);
    if (!success) {
      setSubmitError('Erro ao excluir evento. Tente novamente.');
    }
  };

  const handleInputChange = (field: keyof Omit<Evento, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 w-96 flex flex-col`}>
        <div className="px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Gerenciador de Tarefas</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Formulário Nova Tarefa */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Tarefa</h3>
            
            {/* Feedback de erro */}
            {(error || submitError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error || submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o nome da tarefa"
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
                <label className={`block text-sm font-medium mb-1 text-gray-700`}>
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
                  onChange={(e) => setFormData(prev => ({ ...prev, isDaily: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Tarefa diária (repetir todos os dias do mês)
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
                ].map((day, index) => (
                  <label key={day.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.weekDays?.includes(day.value) || false}
                      onChange={(e) => {
                        const weekDays = formData.weekDays || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, weekDays: [...weekDays, day.value] }));
                        } else {
                          setFormData(prev => ({ ...prev, weekDays: weekDays.filter(d => d !== day.value) }));
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
                Cor da Tarefa
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Tarefa'}
            </button>
            </form>
          </div>

          {/* Lista de Tarefas */}
          <div className="p-6 flex-shrink-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tarefas Criadas</h3>
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma tarefa criada ainda.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                {tasks.map((evento, index) => (
                  <EventoItem
                    key={evento.id || index}
                    evento={evento}
                    index={index}
                    onDelete={handleDelete}
                    onEdit={onUpdateTask ? handleEdit : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <EventoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleModalSubmit}
        evento={editingEvent}
        title="Editar Evento"
      />
    </>
  );
}