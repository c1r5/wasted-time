import { useState, useEffect } from 'react';
import { type Evento, colorPalette, EventoItem, EventoModal } from '../../calendar/eventos';
import { useThemeContext } from '..';

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
  const { theme } = useThemeContext();

  // Aplica estilos customizados para barras de rolagem
  useEffect(() => {
    const style = document.getElementById('sidebar-scrollbar-styles') || document.createElement('style');
    style.id = 'sidebar-scrollbar-styles';
    style.innerHTML = `
      .sidebar-scroll {
        scrollbar-width: thin;
        scrollbar-color: ${theme.colors.border} ${theme.colors.surface};
      }
      
      .sidebar-scroll::-webkit-scrollbar {
        width: 8px;
      }
      
      .sidebar-scroll::-webkit-scrollbar-track {
        background: ${theme.colors.surface};
        border-radius: 4px;
      }
      
      .sidebar-scroll::-webkit-scrollbar-thumb {
        background: ${theme.colors.border};
        border-radius: 4px;
        border: 1px solid ${theme.colors.surface};
      }
      
      .sidebar-scroll::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.text.secondary};
      }
      
      .sidebar-scroll::-webkit-scrollbar-corner {
        background: ${theme.colors.surface};
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('sidebar-scrollbar-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme]);

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

    // Validação básica de campos obrigatórios
    const isValidTask = formData.title && formData.startTime && formData.endTime &&
      (formData.isDaily || (formData.startDate && formData.endDate));

    // Validação de horário - permitir eventos que cruzam a meia-noite
    const startTime = formData.startTime;
    const endTime = formData.endTime;

    // Converter horários para minutos para comparação
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

    // Se horário de fim for menor que início, assume que passa da meia-noite (ex: 22:00 às 02:00)
    const isOvernightEvent = endMinutes < startMinutes;

    // Validar se é um evento válido (não pode ter duração zero no mesmo dia)
    const isValidTime = isOvernightEvent || endMinutes > startMinutes;

    if (isValidTask && isValidTime) {
      setSubmitError(null);

      // Se for um evento que passa da meia-noite e não for diário, ajustar data de fim
      let adjustedFormData = { ...formData };
      if (isOvernightEvent && !formData.isDaily && formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        adjustedFormData.endDate = nextDay.toISOString().split('T')[0];
      }

      const success = await onAddTask(adjustedFormData);

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
    } else if (!isValidTime) {
      setSubmitError('Horário inválido. O horário de fim deve ser após o horário de início, ou pode ser um evento que passa da meia-noite.');
    } else {
      setSubmitError('Por favor, preencha todos os campos obrigatórios.');
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
      <div
        className="fixed left-0 top-0 h-full shadow-lg transition-all duration-300 z-40 w-96 flex flex-col"
        style={{
          backgroundColor: theme.colors.surface,
          borderRight: `1px solid ${theme.colors.border}`,
          boxShadow: `0 4px 6px ${theme.colors.shadow}`
        }}
      >
        <div
          className="px-6 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${theme.colors.border}` }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Gerenciador de Tarefas
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {/* Formulário Nova Tarefa */}
          <div
            className="p-6"
            style={{ borderBottom: `1px solid ${theme.colors.border}` }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Nova Tarefa
            </h3>

            {/* Feedback de erro */}
            {(error || submitError) && (
              <div className="mb-4 p-3 rounded error" style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626' }}>
                {error || submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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
                  placeholder="Digite o nome da tarefa"
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
                    onChange={(e) => setFormData(prev => ({ ...prev, isDaily: e.target.checked }))}
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
                    Tarefa diária (repetir todos os dias do mês)
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
                  ].map((day, _index) => (
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
                  Cor da Tarefa
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleInputChange('color', color.value)}
                      className="w-12 h-12 rounded-md border-2 hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: color.value,
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2 px-4 rounded-md focus:outline-none font-medium transition-all"
                style={{
                  backgroundColor: isLoading ? theme.colors.text.secondary : theme.colors.primary,
                  color: '#ffffff',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  border: `1px solid ${isLoading ? theme.colors.text.secondary : theme.colors.primary}`,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#475569';
                    e.currentTarget.style.borderColor = '#475569';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
              >
                {isLoading ? 'Adicionando...' : 'Adicionar Tarefa'}
              </button>
            </form>
          </div>

          {/* Lista de Tarefas */}
          <div className="p-6 flex-shrink-0">
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: theme.colors.text.primary }}
            >
              Tarefas Criadas
            </h3>
            {tasks.length === 0 ? (
              <p
                className="text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                Nenhuma tarefa criada ainda.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2 sidebar-scroll">
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