import { useState } from 'react';

interface SidebarProps {
  onAddTask: (task: TaskData) => void;
  tasks: TaskData[];
  onDeleteTask: (index: number) => void;
}

export interface TaskData {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  color: string;
  isDaily: boolean;
}

const colorPalette = [
  { name: 'Azul', value: '#3b82f6', border: '#2563eb' },
  { name: 'Verde', value: '#10b981', border: '#059669' },
  { name: 'Amarelo', value: '#f59e0b', border: '#d97706' },
  { name: 'Vermelho', value: '#ef4444', border: '#dc2626' },
  { name: 'Roxo', value: '#8b5cf6', border: '#7c3aed' },
  { name: 'Rosa', value: '#ec4899', border: '#db2777' },
  { name: 'Índigo', value: '#6366f1', border: '#4f46e5' },
  { name: 'Esmeralda', value: '#059669', border: '#047857' }
];

export default function Sidebar({ onAddTask, tasks, onDeleteTask }: SidebarProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    color: colorPalette[0].value,
    isDaily: false
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidTask = formData.title && formData.startTime && formData.endTime && 
      (formData.isDaily || (formData.startDate && formData.endDate));
    
    if (isValidTask) {
      onAddTask(formData);
      setFormData({
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        color: colorPalette[0].value,
        isDaily: false
      });
    }
  };

  const handleInputChange = (field: keyof TaskData, value: string) => {
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${formData.isDaily ? 'text-gray-400' : 'text-gray-700'}`}>
                  Data Início
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    formData.isDaily 
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                  disabled={formData.isDaily}
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              Adicionar Tarefa
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
                {tasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          {task.isDaily && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Diária
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {task.startDate} {task.startTime} - {task.endDate} {task.endTime}
                        </p>
                        <div 
                          className="w-4 h-4 rounded mt-2"
                          style={{ backgroundColor: task.color }}
                        />
                      </div>
                      <button
                        onClick={() => onDeleteTask(index)}
                        className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Excluir tarefa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}