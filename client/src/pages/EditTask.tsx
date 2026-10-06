import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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

function EditTask() {
  // =========================
  // GET TASK ID FROM URL
  // =========================

  const { id } = useParams()
  const navigate = useNavigate()

  // =========================
  // FORM STATE
  // =========================

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  // =========================
  // LOAD TASKS FROM LOCAL STORAGE
  // =========================

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    return []
  })

  // =========================
  // FIND THE TASK
  // =========================

  const taskToEdit = tasks.find(
    (task) => task.id === Number(id),
  )

  // =========================
  // LOAD TASK INFORMATION
  // =========================

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description)
      setCategory(taskToEdit.category)
    } else {
      // Figma example content
      setTitle('Project Completion')

      setDescription(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sit in aliquam pretium. Diam consectetur at tincidunt sed non tempus faucibus posuere eu. Nisi, luctus turpis pharetra quis nunc nulla. At lectus faucibus mattis ante eleifend ac arcu. Nibh morbi adipiscing leo tempus non dolor viverra cras. Sapien in nulla cum fermentum auctor lectus orci. Felis tincidunt lacus, fermentum laoreet sit sit. Lacus, orci pretium, etiam justo lacus. Amet, ultrices eget auctor euismod vitae diam.',
      )

      setCategory('Urgent')
    }
  }, [taskToEdit])

  // =========================
  // SAVE TASKS TO LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // =========================
  // DONE BUTTON
  // =========================

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // If this task already exists, update it
    if (taskToEdit) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === Number(id)
            ? {
                ...task,
                title: title.trim(),
                description: description.trim(),
                category,
              }
            : task,
        ),
      )
    }

    // Go back to My Tasks
    navigate('/tasks')
  }

  return (
    <div className="min-h-screen bg-[#FAF9FC]">
      <Navbar showAllTasks />

      <main className="mx-auto w-full max-w-[1002px] px-6 py-9 sm:px-8 lg:px-0">

        {/* =========================
            PAGE HEADING
        ========================= */}

        <div className="mb-10 flex items-center gap-2">
          <Link
            to="/tasks"
            className="shrink-0 text-[#292929] transition hover:text-[#9747D7]"
          >
            <ChevronLeft
              size={30}
              strokeWidth={2}
            />
          </Link>

          <h1 className="text-[27px] font-medium text-[#292929] sm:text-[30px]">
            Edit Task
          </h1>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

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
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="h-[51px] w-full rounded-[4px] border border-[#D5D5D5] bg-transparent px-6 text-[14px] text-[#292929] outline-none focus:border-[#9747D7]"
            />
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
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="h-[146px] w-full resize-none rounded-[4px] border border-[#D5D5D5] bg-transparent px-6 py-5 text-[14px] leading-[1.35] text-[#292929] outline-none focus:border-[#9747D7]"
            />
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

            <div className="relative flex h-[51px] w-full items-center rounded-[4px] border border-[#D5D5D5] px-6">

              {/* Urgent */}
              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setCategory('Urgent')
                  }
                  className={`rounded-[2px] px-2 py-[2px] text-[12px] font-medium ${
                    category === 'Urgent'
                      ? 'bg-[#2D2D2D] text-white'
                      : 'bg-[#E5E5E5] text-[#777777]'
                  }`}
                >
                  Urgent
                </button>

                {/* Important */}
                <button
                  type="button"
                  onClick={() =>
                    setCategory('Important')
                  }
                  className={`rounded-[2px] px-2 py-[2px] text-[12px] font-medium ${
                    category === 'Important'
                      ? 'bg-[#2D2D2D] text-white'
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
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#292929]"
              />
            </div>
          </div>

          {/* =========================
              DONE BUTTON
          ========================= */}

          <button
            type="submit"
            className="mt-3 h-[50px] w-full rounded-[4px] bg-[#9747D7] text-[18px] font-medium text-white transition hover:bg-[#8235C2]"
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

export default EditTask