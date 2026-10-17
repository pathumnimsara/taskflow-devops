
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()
const PORT = process.env.PORT || 3001
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const MONGO_DB = process.env.MONGO_DB || 'taskflow'

app.use(cors())
app.use(express.json())

let tasksCollection

app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API is running',
    status: 'OK',
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await tasksCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray()

    res.json(tasks)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const title = req.body.title?.trim()

    if (!title) {
      return res.status(400).json({
        error: 'Task title is required',
      })
    }

    const lastTask = await tasksCollection.findOne(
      {},
      { sort: { id: -1 }, projection: { id: 1 } },
    )

    const task = {
      id: (lastTask?.id || 0) + 1,
      title,
      completed: false,
    }

    await tasksCollection.insertOne(task)
    res.status(201).json(task)
  } catch (error) {
    console.error('Failed to create task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

app.patch('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }

    if (typeof req.body.completed !== 'boolean') {
      return res.status(400).json({
        error: 'completed must be true or false',
      })
    }

    const result = await tasksCollection.updateOne(
      { id },
      { $set: { completed: req.body.completed } },
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const updatedTask = await tasksCollection.findOne(
      { id },
      { projection: { _id: 0 } },
    )

    res.json(updatedTask)
  } catch (error) {
    console.error('Failed to update task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }

    const result = await tasksCollection.deleteOne({ id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(204).end()
  } catch (error) {
    console.error('Failed to delete task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

async function startServer() {
  const client = new MongoClient(MONGO_URL)

  try {
    await client.connect()

    const db = client.db(MONGO_DB)
    tasksCollection = db.collection('tasks')

    await tasksCollection.createIndex({ id: 1 }, { unique: true })

    console.log(`Connected to MongoDB database: ${MONGO_DB}`)

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`TaskFlow API listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    await client.close().catch(() => {})
    process.exit(1)
  }
}

startServer()
