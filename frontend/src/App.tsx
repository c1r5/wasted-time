import { useState } from 'react'
import Calendar from './components/Calendar'
import Sidebar, { type TaskData } from './components/Sidebar'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<TaskData[]>([])

  const handleAddTask = (task: TaskData) => {
    setTasks(prev => [...prev, task])
  }

  const handleDeleteTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        onAddTask={handleAddTask}
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
      />
      
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Wasted Time</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Calendar tasks={tasks} />
        </main>
      </div>
    </div>
  )
}

export default App
