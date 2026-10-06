import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'TaskDuty API is running',
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message)
  })