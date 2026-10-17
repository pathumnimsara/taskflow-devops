

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

let tasks = []
let nextId = 1

app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API is running',
    status: 'OK',
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

app.get('/tasks', (req, res) => {
  res.json(tasks)
})

app.post('/tasks', (req, res) => {
  const title = req.body.title?.trim()

  if (!title) {
    return res.status(400).json({
      error: 'Task title is required',
    })
  }

  const task = {
    id: nextId++,
    title,
    completed: false,
  }

  tasks.push(task)
  res.status(201).json(task)
})

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return res.status(404).json({
      error: 'Task not found',
    })
  }

  if (typeof req.body.completed !== 'boolean') {
    return res.status(400).json({
      error: 'completed must be true or false',
    })
  }

  task.completed = req.body.completed
  res.json(task)
})

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const existingTask = tasks.find((item) => item.id === id)

  if (!existingTask) {
    return res.status(404).json({
      error: 'Task not found',
    })
  }

  tasks = tasks.filter((item) => item.id !== id)
  res.status(204).end()
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TaskFlow API listening on port ${PORT}`)
})
