import taskDutyHero from '../assets/Component 1.png'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'



function Home() {
  return (
    <>
      <Navbar showNewTask showAllTasks />
      <main className="min-h-[calc(100vh-92px)] bg-[#FAF9FC]">
        <section className="mx-auto flex min-h-[calc(100vh-92px)] max-w-[1100px] items-center px-6">

          {/* Hero Text */}
          <div className="w-1/2">
            <h1 className="font-['Signika_Negative'] text-[48px] font-semibold leading-[1.05] text-[#2D2D2D]">
              Manage your Tasks on
              <span className="block text-[#9747D7]">
                TaskDuty
              </span>
            </h1>

            <p className="mt-6 max-w-[510px] font-['Signika_Negative'] text-[18px] leading-[1.45] text-[#737373]">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Non tellus, sapien, morbi ante nunc euismod ac
              felis ac. Massa et, at platea tempus duis non eget.
              Hendrerit tortor interdum nibh mi nisl semper
              porttitor. Nec accumsan.
            </p>

           <Link
             to="/tasks"
             className="inline-flex items-center justify-center rounded-[6px] bg-[#9747D7] px-5 py-3 text-white transition hover:bg-[#8235C2]"
            >
             Go to My Tasks
            </Link>
          </div>

          {/* Hero Illustration */}
          <div className="flex w-1/2 justify-end">
            <img
              src={taskDutyHero}
              alt="TaskDuty task management illustration"
              className="w-[460px] object-contain"
            />
          </div>

        </section>
      </main>
    </>
  )
}

export default Home