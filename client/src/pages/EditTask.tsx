import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Navbar from '../components/Navbar'

interface Task {
  _id: string
  title: string
  description: string
  dueDate: string
  category: string
  completed: boolean
}

const API_URL = 'http://localhost:5000/api/tasks'

function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('Urgent')
  const [completed, setCompleted] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // LOAD THE SELECTED TASK FROM THE BACKEND
  useEffect(() => {
    const loadTask = async () => {
      if (!id) {
        setError('Task ID is missing.')
        setLoading(false)
        return
      }

      const token = sessionStorage.getItem('taskdutyToken')

      if (!token) {
        setError('Your session has expired. Please log in again.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load this task.')
        }

        const task: Task = data.task

        setTitle(task.title)
        setDescription(task.description)
        setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '')
        setCategory(task.category)
        setCompleted(task.completed)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading the task.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [id])

  // SAVE CHANGES TO THE BACKEND
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!title.trim() || !description.trim() || !dueDate || !category) {
      setError('Please complete all fields.')
      return
    }

    const token = sessionStorage.getItem('taskdutyToken')

    if (!token) {
      setError('Your login session is missing. Please log in again.')
      return
    }

    if (!id) {
      setError('Task ID is missing.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dueDate,
          category,
          completed,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update the task.')
      }

      navigate('/tasks')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving your changes.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9FC]">
      <Navbar showAllTasks />

      <main className="mx-auto w-full max-w-[1002px] px-4 py-8 sm:px-8 sm:py-9 lg:px-0">
        <div className="mb-8 flex items-center gap-2 sm:mb-10">
          <Link
            to="/tasks"
            aria-label="Back to My Tasks"
            className="shrink-0 text-[#292929] transition hover:text-[#9747D7]"
          >
            <ChevronLeft size={30} strokeWidth={2} />
          </Link>

          <h1 className="text-[26px] font-medium text-[#292929] sm:text-[30px]">
            Edit Task
          </h1>
        </div>

        {loading ? (
          <p className="py-10 text-center text-[#777777]">
            Loading task...
          </p>
        ) : error && !title && !description ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p>{error}</p>
            <Link
              to="/tasks"
              className="mt-4 inline-block font-medium text-[#9747D7] hover:underline"
            >
              Return to My Tasks
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="relative">
              <label
                htmlFor="title"
                className="absolute -top-2 left-5 z-10 bg-[#FAF9FC] px-1 text-sm text-[#777777]"
              >
                Task Title
              </label>

              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-[51px] w-full rounded-[4px] border border-[#D5D5D5] bg-transparent px-5 text-sm text-[#292929] outline-none focus:border-[#9747D7] sm:px-6"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="description"
                className="absolute -top-2 left-5 z-10 bg-[#FAF9FC] px-1 text-sm text-[#777777]"
              >
                Description
              </label>

              <textarea
                id="description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-[146px] w-full resize-y rounded-[4px] border border-[#D5D5D5] bg-transparent px-5 py-5 text-sm leading-relaxed text-[#292929] outline-none focus:border-[#9747D7] sm:px-6"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="dueDate"
                className="absolute -top-2 left-5 z-10 bg-[#FAF9FC] px-1 text-sm text-[#777777]"
              >
                Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                required
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="h-[51px] w-full rounded-[4px] border border-[#D5D5D5] bg-transparent px-5 text-sm text-[#292929] outline-none focus:border-[#9747D7] sm:px-6"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="category"
                className="absolute -top-2 left-5 z-10 bg-[#FAF9FC] px-1 text-sm text-[#777777]"
              >
                Category
              </label>

              <select
                id="category"
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-[51px] w-full rounded-[4px] border border-[#D5D5D5] bg-transparent px-5 text-sm text-[#292929] outline-none focus:border-[#9747D7] sm:px-6"
              >
                <option value="Urgent">Urgent</option>
                <option value="Important">Important</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-3 h-[50px] w-full rounded-[4px] bg-[#9747D7] text-base font-medium text-white transition hover:bg-[#8235C2] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
              {saving ? 'Saving Changes...' : 'Done'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="#top"
            className="text-sm text-[#9747D7] hover:underline"
          >
            Back To Top
          </a>
        </div>
      </main>
    </div>
  )
}

export default EditTask