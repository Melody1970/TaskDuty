
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'

function NewTask() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
  })

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      dueDate: '',
      category: '',
    }

    let isValid = true

    if (!title.trim()) {
      newErrors.title = 'Task title is required.'
      isValid = false
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.'
      isValid = false
    }

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

    if (!category) {
      newErrors.category = 'Please select a tag.'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setApiError('')

    if (!validateForm()) return

    const token = sessionStorage.getItem('taskdutyToken')

    if (!token) {
      setApiError(
        'Your login token is missing. Please log in through Postman again and save the new token in this browser session.',
      )
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dueDate,
          category,
          completed: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task.')
      }

      navigate('/tasks')
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Could not create the task. Check that your backend is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toLocaleDateString('en-CA')

  return (
    <div className="min-h-screen bg-[#FAF9FC]">
      <Navbar showAllTasks />

      <main className="mx-auto max-w-[1002px] px-6 py-9">
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

        <form onSubmit={handleSubmit} className="space-y-8">
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

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

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

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>

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

            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-6 z-10 bg-[#FAF9FC] px-1 text-[15px] text-[#A6A6A6]">
              Tags
            </label>

            <div
              className={`relative flex h-[47px] w-full items-center rounded-[4px] border px-6 ${
                errors.category ? 'border-red-400' : 'border-[#D5D5D5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('Urgent')
                    setErrors((current) => ({ ...current, category: '' }))
                  }}
                  className={`rounded-[2px] px-2 py-[2px] text-[12px] font-medium ${
                    category === 'Urgent'
                      ? 'bg-[#F16B6B] text-white'
                      : 'bg-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  Urgent
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('Important')
                    setErrors((current) => ({ ...current, category: '' }))
                  }}
                  className={`rounded-[2px] px-2 py-[2px] text-[12px] font-medium ${
                    category === 'Important'
                      ? 'bg-[#73C3A6] text-white'
                      : 'bg-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  Important
                </button>
              </div>

              <ChevronDown
                size={23}
                strokeWidth={2}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8C8C8C]"
              />
            </div>

            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {apiError && (
            <p role="alert" className="text-sm text-red-600">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 h-[46px] w-full rounded-[4px] bg-[#9747D7] text-[16px] font-medium text-white transition hover:bg-[#8235C2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving Task...' : 'Done'}
          </button>
        </form>

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
