import mongoose from 'mongoose'
import Task from '../models/Task.js'

// CREATE A NEW TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body

    if (
      !title?.trim() ||
      !description?.trim() ||
      !dueDate ||
      !category?.trim()
    ) {
      return res.status(400).json({
        message: 'Title, description, due date and category are required',
      })
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      category: category.trim(),
      completed: completed ?? false,
      userId: req.userId,
    })

    return res.status(201).json({
      message: 'Task created successfully',
      task,
    })
  } catch (error) {
    console.error('Create task error:', error)
    return res.status(500).json({
      message: 'Failed to create task',
      error: error.message,
    })
  }
}

// GET ALL TASKS BELONGING TO THE LOGGED-IN USER
export const getTasks = async (req, res) => {
  try {
    const filter = { userId: req.userId }

    if (req.query.category) {
      filter.category = req.query.category
    }

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true'
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 })

    return res.status(200).json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks,
    })
  } catch (error) {
    console.error('Get tasks error:', error)
    return res.status(500).json({
      message: 'Failed to retrieve tasks',
      error: error.message,
    })
  }
}

// GET ONE TASK
export const getTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    return res.status(200).json({
      message: 'Task retrieved successfully',
      task,
    })
  } catch (error) {
    console.error('Get task error:', error)
    return res.status(500).json({
      message: 'Failed to retrieve task',
      error: error.message,
    })
  }
}

// UPDATE A TASK
export const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }

    const { title, description, dueDate, category, completed } = req.body
    const updates = {}

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' })
      }
      updates.title = title.trim()
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          message: 'Description cannot be empty',
        })
      }
      updates.description = description.trim()
    }

    if (dueDate !== undefined) updates.dueDate = dueDate

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          message: 'Category cannot be empty',
        })
      }
      updates.category = category.trim()
    }

    if (completed !== undefined) updates.completed = completed

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    return res.status(200).json({
      message: 'Task updated successfully',
      task,
    })
  } catch (error) {
    console.error('Update task error:', error)
    return res.status(500).json({
      message: 'Failed to update task',
      error: error.message,
    })
  }
}

// DELETE A TASK
export const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    console.error('Delete task error:', error)
    return res.status(500).json({
      message: 'Failed to delete task',
      error: error.message,
    })
  }
}

// SEARCH TASKS BY TITLE, DESCRIPTION OR CATEGORY
export const searchTasks = async (req, res) => {
  try {
    const searchTerm = req.query.q?.trim()

    if (!searchTerm) {
      return res.status(400).json({
        message: 'Please enter a search term',
      })
    }

    const escapedTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    )

    const searchRegex = new RegExp(escapedTerm, 'i')

    const tasks = await Task.find({
      userId: req.userId,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      message: 'Tasks searched successfully',
      count: tasks.length,
      tasks,
    })
  } catch (error) {
    console.error('Search tasks error:', error)
    return res.status(500).json({
      message: 'Failed to search tasks',
      error: error.message,
    })
  }
}