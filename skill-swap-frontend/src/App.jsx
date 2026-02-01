import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "./components/Dashboard/Dashboard"
import BrowseSkills from './components/BrowseSkills/BrowseSkills'
import HowItWorks from './components/HowItWorks/HowItWorks'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/browse-skills" element={<BrowseSkills />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </Router>
  )
}

export default App
