import "./LoadingPage.css";
import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const loadingTexts = [
  "Matching learners with experts...",
  "Finding skill exchange opportunities...",
  "Building your learning network...",
  "Connecting passionate learners...",
];

const LoadingPage = () => {
    const location = useLocation()
    
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = location.state.redirectUrl
        },30000)

        return () => clearTimeout(timer)
    }, [location])
    
  return (
    <div className="loading-page">
      <div className="logo-section">
        <div className="logo-circle">SS</div>
        <h1>Skill Swap</h1>
        <p>Learn. Teach. Grow Together.</p>
      </div>

      <div className="swap-animation">
        <div className="skill-card card-1">React</div>
        <div className="skill-card card-2">UI Design</div>

        <div className="exchange-icon">
          ↔
        </div>
      </div>

      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>

      <p className="loading-text">
        {loadingTexts[Math.floor(Date.now() / 3000) % loadingTexts.length]}
      </p>
    </div>
  );
}

export default LoadingPage;