import { useState } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

interface Task {
  id: number
  title: string
  description: string
  category: string
}

function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'FinTech Website Update',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
      category: 'Urgent',
    },
    {
      id: 2,
      title: 'Agro Website Update',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
      category: 'Important',
    },
    {
      id: 3,
      title: 'FinTech Website Update',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
      category: 'Urgent',
    },
    {
      id: 4,
      title: 'Agro Website Update',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.',
      category: 'Important',
    },
  ])

  const handleDelete = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    )
  }

  return (
    <>
      <Navbar showNewTask />
      <main className="min-h-screen bg-[#FAF9FC] px-6 py-8">
        <section className="mx-auto max-w-[1100px]">

          {/* Page heading */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-[#292929]">
              My Tasks
            </h1>

           <Link
           to="/new-task"
           className="text-sm font-medium text-[#9747D7] hover:underline"
           >
           + Add New Task
           </Link>
          </div>

          {/* Tasks */}
          <div className="mt-8 space-y-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                category={task.category}
                onEdit={() => navigate(`/edit-task/${task.id}`)}
                onDelete={() => handleDelete(task.id)}
              />
            ))}
          </div>

          {/* Back to top */}
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
    </>
  )
}

export default Tasks