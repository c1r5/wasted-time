import Calendar from './modules/calendar/components/Calendar'
import Sidebar from './modules/shared/components/Sidebar'
import { useEventos, type Evento } from './modules/calendar/eventos'
import { ThemeProvider, Header, ThemeWrapper } from './modules/shared'
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
    <ThemeProvider>
      <ThemeWrapper>
        <div className="app-container flex">
          <Sidebar
            onAddTask={handleAddTask}
            tasks={eventos}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
            isLoading={isLoading}
            error={error}
          />
          <div className="flex-1 flex flex-col ml-96">
            <Header />
            <main className="app-main flex-1 p-6">
              <Calendar tasks={eventos} />
            </main>
          </div>
        </div>
      </ThemeWrapper>
    </ThemeProvider>
  )
}

export default App
