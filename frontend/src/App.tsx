import Calendar from './modules/calendar/components/Calendar'
import Sidebar from './modules/calendar/components/Sidebar'
import { useEventos, type Evento } from './modules/calendar/eventos'
import './App.css'

function App() {
  const { 
    eventos, 
    adicionarEvento, 
    removerEvento, 
    atualizarEvento,
    isLoading,
    error 
  } = useEventos()

  const handleAddTask = async (evento: Omit<Evento, 'id'>) => {
    return await adicionarEvento(evento)
  }

  const handleDeleteTask = async (index: number) => {
    return await removerEvento(index)
  }

  const handleUpdateTask = async (id: string, evento: Partial<Evento>) => {
    return await atualizarEvento(id, evento)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        onAddTask={handleAddTask}
        tasks={eventos}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
        isLoading={isLoading}
        error={error}
      />
      
      <div className="flex-1 flex flex-col ml-96">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Wasted Time</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Calendar tasks={eventos} />
        </main>
      </div>
    </div>
  )
}

export default App
