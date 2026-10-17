
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`${API_URL}/tasks`)

        if (!response.ok) {
          throw new Error('Could not load tasks')
        }

        const data = await response.json()
        setTasks(data)
      } catch {
        setError('Cannot connect to the API. Check whether the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  async function addTask(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle || saving) return

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      })

      if (!response.ok) {
        throw new Error('Could not create task')
      }

      const newTask = await response.json()
      setTasks((currentTasks) => [...currentTasks, newTask])
      setTitle('')
    } catch {
      setError('Could not add task. Check the API connection.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleTask(task) {
    setError('')

    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })

      if (!response.ok) {
        throw new Error('Could not update task')
      }

      const updatedTask = await response.json()

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      )
    } catch {
      setError('Could not update task. Check the API connection.')
    }
  }

  async function deleteTask(id) {
    setError('')

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Could not delete task')
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      )
    } catch {
      setError('Could not delete task. Check the API connection.')
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const remainingCount = tasks.length - completedCount

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </div>
        <span className="version">DEV MODE</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>Make progress,<br />one task at a time.</h1>
        <p className="subtitle">
          Keep things simple. Stay focused. Get things done.
        </p>
      </section>

      <section className="task-panel">
        <div className="panel-heading">
          <div>
            <h2>My Tasks</h2>
            <p>You have {remainingCount} tasks left to do.</p>
          </div>
          <div className="task-count">
            {completedCount}/{tasks.length}
          </div>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to get done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="New task"
          />
          <button type="submit" disabled={saving}>
            {saving ? 'Adding...' : '+ Add Task'}
          </button>
        </form>

        {error && <p role="alert" className="error-message">{error}</p>}

        <div className="task-list">
          {loading ? (
            <div className="empty-state">
              <h3>Loading tasks...</h3>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✦</span>
              <h3>Nothing on your list yet</h3>
              <p>Add your first task and get started.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div className="task-item" key={task.id}>
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span className={task.completed ? 'task-title completed' : 'task-title'}>
                    {task.title}
                  </span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <footer className="panel-footer">
          <span>React + Express API</span>
          <span>{completedCount} completed</span>
        </footer>
      </section>

      <p className="bottom-note">
        Small steps every day lead to big results.
      </p>
    </main>
  )
}

export default App
