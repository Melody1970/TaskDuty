import Task from '../models/Task.js'

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body

    if (!title || !description || !dueDate || !category) {
      return res.status(400).json({
        message: 'Title, description, due date and category are required',
      })
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      category,
      completed: completed || false,
      userId: req.userId,
    })

    res.status(201).json({
      message: 'Task created successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// GET ALL MY TASKS
export const getTasks = async (req, res) => {
  try {
    const { category, completed } = req.query

    const filter = {
      userId: req.userId,
    }

    if (category) {
      filter.category = category
    }

    if (completed !== undefined) {
      filter.completed = completed === 'true'
    }

    const tasks = await Task.find(filter).sort({
      createdAt: -1,
    })

    res.json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// GET ONE OF MY TASKS
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json({
      message: 'Task retrieved successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// UPDATE ONE OF MY TASKS
export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        title,
        description,
        dueDate,
        category,
        completed,
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json({
      message: 'Task updated successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// DELETE ONE OF MY TASKS
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}