import taskDutylogo from '../assets/Group 1.svg'
import profileImage from '../assets/Group 7.svg'
import { Link } from 'react-router-dom'



interface NavbarProps {
  showNewTask?: boolean
  showAllTasks?: boolean
}



function Navbar({
  showNewTask = false,
  showAllTasks = false,
}: NavbarProps) {
  return (
    <nav className="w-full border-b-[0.5px] border-[#B8B6B6] bg-white">
      <div className="mx-auto flex h-[92px] max-w-[1002px] items-center justify-between">

        {/* TaskDuty Logo and Name */}
        <Link
        to="/"
        className="flex items-center gap-2"
        >
       <img
       src={taskDutylogo}
       alt="TaskDuty logo"
      className="h-[34px] w-auto"
      />

      <span className="font-['Signika_Negative'] text-[27.37px] font-semibold leading-none text-[#2D0050]">
      TaskDuty
     </span>
     </Link>

        {/* Navigation and Profile */}
        <div
          className={`flex items-center gap-10 ${
            showNewTask && !showAllTasks ? 'ml-auto' : ''
          }`}
        >
          {showNewTask && (
             <Link
              to="/new-task"
              className="text-sm font-medium text-[#292929] hover:text-[#9747D7]"
            >
              New Task
            </Link>
          )}

          {showAllTasks && (
             <Link
              to="/tasks"
              className="text-sm font-medium text-[#292929] hover:text-[#9747D7]"
            >
              All Tasks
            </Link>
          )}

          {/* Profile Image */}
          <img
            src={profileImage}
            alt="User profile"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>

      </div>
    </nav>
  )
}

export default Navbar