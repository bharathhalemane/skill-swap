import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "./Pages/Dashboard/Dashboard"
import BrowseSkills from './Pages/BrowseSkills/BrowseSkills'
import Login from './components/Auth/Login/Login'
import Signup from './components/Auth/Signup/Signup'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import ResetPassword from './components/Auth/ResetPassword/ResetPassword'
import Home from './Pages/Home/Home'
import Profile from './components/Profile/Profile'
import { ToastContainer } from 'react-toastify'
import SkillPage from './components/Skill/SkillPage'
import StudyGroups from './Pages/StudyGroups/StudyGroups'
import "react-toastify/dist/ReactToastify.css"
import './App.css'
import { useEffect } from "react"
import Cookies from "js-cookie"
import socket from './Socket'
import CompletedSkills from './Pages/CompletedSkills/CompletedSkills'


function App() {

  useEffect(() => {
    const userId = Cookies.get("userId")

    if (!userId) return

    const handleConnect = () => {      
      console.log("Socket ID:", socket.id);
      socket.emit("register", userId);
    };

    if (socket.connected) {
      handleConnect()
    } else {
      socket.on("connect", handleConnect)
    }
    return () => {
      socket.off("connect", handleConnect)
    }

  }, [])

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2500} theme='dark' />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/find-skills" element={<ProtectedRoute>
            <BrowseSkills />
          </ProtectedRoute>} />
          <Route path="/skill/:skillId/:userId" element={<ProtectedRoute>
            <SkillPage />
          </ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute>
            <Home />
          </ProtectedRoute>} />
          <Route path="/study-groups" element={<ProtectedRoute>
            <StudyGroups />
          </ProtectedRoute>} />
          <Route path="/completed-skills" element={<ProtectedRoute>
            <CompletedSkills />
          </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
