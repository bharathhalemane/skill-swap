import './LearningSkills.css'
import { learningSkills, endLearning } from '../requestAPi'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import {Link} from "react-router-dom"
const LearningSkills = () => {
    const [skillsData, setSkillsData] = useState([])

    const fetchData = async () => {
        const response = await learningSkills()
        setSkillsData(response.data.data)
        console.log(response.data.data)
    }
    useEffect(() => {        
        fetchData()
    }, [])
    
    const handleLearning = async (id) => {        
        await endLearning(id)
        fetchData()
    }
    
    return <>
        {
            skillsData.length > 0 && <>
                <hr />
                <div className="learning-container">
                    <div className="learning-container-header">
                        <h2>Currently Learning</h2>
                        <Link to="/completed-skills" className='completed-page-link'>Completed</Link>
                    </div>

                    <div className="learning-grid">
                        {skillsData.map((item) => {                            
                            return (
                                <div className="learning-card" key={item.id}>
                                    <img src={item.skill?.imageUrl} alt="profile" className="learning-img" />

                                    <div className="learning-info">
                                        <h3>{item.skill?.title}</h3>
                                        <p>with {item.partner?.name}</p>

                                        <div className="learning-actions">
                                            <span className="status">In Progress</span>                            
                                            <button className="complete-btn" onClick={() => handleLearning(item.id)}>
                                            Completed</button>                
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        }
    </>
}

export default LearningSkills