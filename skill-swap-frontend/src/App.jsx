import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "./components/Dashboard/Dashboard"
import BrowseSkills from './components/BrowseSkills/BrowseSkills'
import Login from './components/Auth/Login/Login'
import Signup from './components/Auth/Signup/Signup'
import ResetPassword from './components/Auth/ResetPassword/ResetPassword'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/find-skills" element={<ProtectedRoute>
          <BrowseSkills />
        </ProtectedRoute>} />    
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
