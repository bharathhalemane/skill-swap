import './LearningSkills.css'
import { learningSkills, endLearning } from '../requestAPi'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie"
const LearningSkills = () => {
    const [skillsData, setSkillsData] = useState([])

    const fetchData = async () => {
        const response = await learningSkills()
        setSkillsData(response.data.data)
    }
    
    useEffect(() => {        
        fetchData()
    }, [])
    
    const handleLearning = async (id) => {
        await endLearning(id)
        fetchData()
    }
    const userId = Cookies.get("userId")
    return <>
        {
            skillsData.length > 0 && <>
                <hr />
                <div className="learning-container">
                    <h2>Currently Learning</h2>

                    <div className="learning-grid">
                        {skillsData.map((item) => {
                            const skill = item.skill 

                            const otherUser = item.sender._id === userId ? item.receiver : item.sender
                            
                            return (
                                <div className="learning-card" key={item._id}>
                                    <img src={item.skill?.imageUrl} alt="profile" className="learning-img" />

                                    <div className="learning-info">
                                        <h3>{skill?.title}</h3>
                                        <p>with {otherUser?.name}</p>

                                        <div className="learning-actions">
                                            <span className="status">In Progress</span>                            
                                            <button className="complete-btn" onClick={() => handleLearning(item._id)}>
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