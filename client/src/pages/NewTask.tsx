import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  category: string
  completed: boolean
}

function NewTask() {
  // =========================
  // FORM STATE
  // =========================

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')

  // =========================
  // VALIDATION ERRORS
  // =========================

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
  })

  // =========================
  // TASK STATE
  // =========================

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    return []
  })

  const navigate = useNavigate()

  // =========================
  // USE EFFECT
  // Saves tasks to localStorage
  // whenever the tasks change
  // =========================

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      dueDate: '',
      category: '',
    }

    let isValid = true

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Task title is required.'
      isValid = false
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = 'Description is required.'
      isValid = false
    }

    // Validate due date
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.'
      isValid = false
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const selectedDate = new Date(`${dueDate}T00:00:00`)

      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past.'
        isValid = false
      }
    }

    // Validate category
    if (!category) {
      newErrors.category = 'Please select a tag.'
      isValid = false
    }

    setErrors(newErrors)

    return isValid
  }

  // =========================
  // DONE BUTTON
  // =========================

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Check all fields before saving
    const isValid = validateForm()

    // Stop here if validation fails
    if (!isValid) {
      return
    }

    // Create the new task
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      category,
      completed: false,
    }

    // Add the new task to our task state
    setTasks((currentTasks) => [...currentTasks, newTask])

    // Go to My Tasks after creating the task
    navigate('/tasks')
  }

  // =========================
  // GET TODAY'S DATE
  // Used to prevent past dates
  // =========================

  const today = new Date().toISOString().split('T')[0]

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-[#FAF9FC]">
      <Navbar showAllTasks />

      <main className="mx-auto max-w-[1002px] px-6 py-9">
        {/* =========================
            PAGE HEADING
        ========================= */}

        <div className="mb-10 flex items-center gap-2">
          <Link
            to="/tasks"
            className="text-[#292929] transition hover:text-[#9747D7]"
          >
            <ChevronLeft size={30} strokeWidth={2} />
          </Link>

          <h1 className="text-[27px] font-medium text-[#292929]">
            New Task
          </h1>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* =========================
              TASK TITLE
          ========================= */}

          <div className="relative">
            <label
              htmlFor="title"
              className="absolute -top-2 left-6 z-10 bg-[#FAF9FC] px-1 text-[15px] text-[#A6A6A6]"
            >
              Task Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="E.g Project Defense, Assignment ..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={`h-[47px] w-full rounded-[4px] border bg-transparent px-6 text-[14px] text-[#292929] outline-none placeholder:text-[#C7C7C7] ${
                errors.title
                  ? 'border-red-400'
                  : 'border-[#D5D5D5] focus:border-[#9747D7]'
              }`}
            />

            {/* Title error */}
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title}
              </p>
            )}
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="relative">
            <label
              htmlFor="description"
              className="absolute -top-2 left-6 z-10 bg-[#FAF9FC] px-1 text-[15px] text-[#A6A6A6]"
            >
              Description
            </label>

            <textarea
              id="description"
              placeholder="Briefly describe your task..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`h-[133px] w-full resize-none rounded-[4px] border bg-transparent px-6 py-5 text-[14px] text-[#292929] outline-none placeholder:text-[#C7C7C7] ${
                errors.description
                  ? 'border-red-400'
                  : 'border-[#D5D5D5] focus:border-[#9747D7]'
              }`}
            />

            {/* Description error */}
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* =========================
              DUE DATE
          ========================= */}

          <div className="relative">
            <label
              htmlFor="dueDate"
              className="absolute -top-2 left-6 z-10 bg-[#FAF9FC] px-1 text-[15px] text-[#A6A6A6]"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              type="date"
              min={today}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={`h-[47px] w-full rounded-[4px] border bg-transparent px-6 text-[14px] text-[#292929] outline-none ${
                errors.dueDate
                  ? 'border-red-400'
                  : 'border-[#D5D5D5] focus:border-[#9747D7]'
              }`}
            />

            {/* Due date error */}
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.dueDate}
              </p>
            )}
          </div>

          {/* =========================
              TAGS
          ========================= */}

          <div className="relative">
            <label
              className="absolute -top-2 left-6 z-10 bg-[#FAF9FC] px-1 text-[15px] text-[#A6A6A6]"
            >
              Tags
            </label>

            <div
              className={`relative flex h-[47px] w-full items-center rounded-[4px] border px-6 ${
                errors.category
                  ? 'border-red-400'
                  : 'border-[#D5D5D5]'
              }`}
            >
              {/* Tag buttons */}
              <div className="flex items-center gap-3">
                {/* Urgent */}
                <button
                  type="button"
                  onClick={() => {
                    setCategory('Urgent')
                    setErrors((currentErrors) => ({
                      ...currentErrors,
                      category: '',
                    }))
                  }}
                  className={`rounded-[2px] px-2 py-[2px] text-[12px] font-medium ${
                    category === 'Urgent'
                      ? 'bg-[#A6A6A6] text-white'
                      : 'bg-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  Urgent
                </button>

                {/* Important */}
                <button
                  type="button"
                  onClick={() => {
                    setCategory('Important')
                    setErrors((currentErrors) => ({
                      ...currentErrors,
                      category: '',
                    }))
                  }}
                  className={`rounded-[2px] px-2 py-[2px] text-[12px] font-medium ${
                    category === 'Important'
                      ? 'bg-[#A6A6A6] text-white'
                      : 'bg-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  Important
                </button>
              </div>

              {/* Dropdown arrow */}
              <ChevronDown
                size={23}
                strokeWidth={2}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8C8C8C]"
              />
            </div>

            {/* Category error */}
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {/* =========================
              DONE BUTTON
          ========================= */}

          <button
            type="submit"
            className="mt-3 h-[46px] w-full rounded-[4px] bg-[#9747D7] text-[16px] font-medium text-white transition hover:bg-[#8235C2]"
          >
            Done
          </button>
        </form>

        {/* =========================
            BACK TO TOP
        ========================= */}

        <div className="mt-6 text-center">
          <a
            href="#top"
            className="text-[14px] text-[#9747D7] hover:underline"
          >
            Back To Top
          </a>
        </div>
      </main>
    </div>
  )
}

export default NewTask