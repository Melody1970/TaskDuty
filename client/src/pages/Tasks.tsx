import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import { useNavigate, Link } from 'react-router-dom'
import { Search } from 'lucide-react'

interface Task {
  _id: string
  title: string
  description: string
  category: string
  dueDate: string
  completed: boolean
}

interface TasksResponse {
  message: string
  count: number
  tasks: Task[]
}

const API_URL = 'http://localhost:5000/api/tasks'

function Tasks() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // LOAD TASKS AND SEARCH THE BACKEND
  useEffect(() => {
    const token = sessionStorage.getItem('taskdutyToken')

    if (!token) {
      setError('Authentication token not found. Please log in again.')
      setTasks([])
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const loadTasks = async () => {
      setLoading(true)
      setError('')

      try {
        const search = searchTerm.trim()

        const url = search
          ? `${API_URL}/search?q=${encodeURIComponent(search)}`
          : API_URL

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        const data: TasksResponse = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load tasks.')
        }

        setTasks(data.tasks ?? [])
      } catch (err) {
        if (controller.signal.aborted) return

        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while loading tasks.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadTasks()

    return () => controller.abort()
  }, [searchTerm, reloadKey])

  // DELETE A TASK FROM THE BACKEND
  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem('taskdutyToken')

    if (!token) {
      setActionError('Authentication token not found. Please log in again.')
      return
    }

    setActionError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete task.')
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id),
      )
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while deleting the task.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9FC]">
      <Navbar showNewTask />

      <main className="px-4 py-8 sm:px-6">
        <section className="mx-auto w-full max-w-[1100px]">
          {/* PAGE HEADING */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-[#292929] sm:text-3xl">
              My Tasks
            </h1>

            <Link
              to="/new-task"
              className="text-sm font-medium text-[#9747D7] hover:underline"
            >
              + Add New Task
            </Link>
          </div>

          {/* SEARCH INPUT */}
          <div className="mt-6 flex items-center gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3 shadow-sm">
            <Search
              size={18}
              className="shrink-0 text-[#7A7A7A]"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, description or category..."
              aria-label="Search tasks by title, description or category"
              className="w-full min-w-0 border-none bg-transparent text-sm text-[#292929] outline-none placeholder:text-[#8A8A8A]"
            />
          </div>

          {/* DELETE ERROR */}
          {actionError && (
            <p
              role="alert"
              className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600"
            >
              {actionError}
            </p>
          )}

          {/* TASK LIST */}
          <div className="mt-8 space-y-6">
            {loading ? (
              <p className="py-10 text-center text-sm text-[#737171]">
                Loading tasks...
              </p>
            ) : error ? (
              <div className="py-10 text-center">
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>

                <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="mt-3 text-sm font-medium text-[#9747D7] hover:underline"
>
              Try again
              </button>
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  title={task.title}
                  description={task.description}
                  category={task.category}
                  onEdit={() => navigate(`/edit-task/${task._id}`)}
                  onDelete={() => void handleDelete(task._id)}
                />
              ))
            ) : (
              <p className="py-10 text-center text-sm text-[#737171]">
                {searchTerm.trim()
                  ? 'No tasks found. Try another search.'
                  : 'You have no tasks yet.'}
              </p>
            )}
          </div>

          {/* BACK TO TOP */}
          <div className="py-10 text-center">
            <a
              href="#top"
              className="text-sm text-[#9747D7] hover:underline"
            >
              Back To Top
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Tasks