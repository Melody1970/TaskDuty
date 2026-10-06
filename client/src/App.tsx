
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import NewTask from './pages/NewTask'
import EditTask from './pages/EditTask'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
         <Route path="/new-task" element={<NewTask />} /> 
         <Route path="/edit-task/:id" element={<EditTask />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App