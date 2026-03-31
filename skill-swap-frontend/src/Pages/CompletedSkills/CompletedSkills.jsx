import HomeHeader from "../../components/Header/HomeHeader";
import Footer from "../../components/Footer/Footer";
import { completedSkills, getAnySkills } from "./CompletedApi";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SkillCard from "../../components/Utils/SkillCard/SkillCard";
import './CompletedSkills.css'

const CompletedSkills = () => {
    const [skills, setSkills] = useState([])
    const [etcSkills, setEtcSkills] = useState([])
    const { learned, taught, swaps } = skills

    useEffect(() => {
        const getCompletedSkills = async () => {
            const response = await completedSkills()
            setSkills(response.data.data)
        }

        const getEtcSkills = async () => {
            const response = await getAnySkills()
            setEtcSkills(response)
        }

        getCompletedSkills()
        getEtcSkills()
    }, [])
    return (
        <>
            <HomeHeader />
            <div className="completed-skills-container">
                {
                    learned?.length > 0 && <div className="completed-section">
                        <h2>Skills Learned</h2>
                        <div className="completed-skills-grid">
                            {learned.map((item) => {
                                return (
                                    <div className="completed-card" key={item._id}>
                                        <img src={item.skill.imageUrl} alt="skill" className="completed-img" />
                                        <div className="completed-info">
                                            <h3>{item.skill.title}</h3>
                                            <p>with {item.receiver.name}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
                {                    taught?.length > 0 && <div className="completed-section">
                        <h2>Skills Taught</h2>
                    <div className="completed-skills-grid">
                        {taught.map((item) => {
                            return (
                                <div className="completed-card" key={item._id}>
                                    <img src={item.skill.imageUrl} alt="skill" className="completed-img" /> 
                                    <div className="completed-info">
                                        <h3>{item.skill.title}</h3>
                                        <p>to {item.receiver.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>}
                {swaps?.length > 0 && <div className="completed-section">
                    <h2>Swaps Completed</h2>
                    <div className="completed-skills-grid">
                        {swaps.map((item) => {                            
                            const userId = Cookies.get('userId')
                            let skill = {
                                imageUrl:'', title:'', name:''
                            }
                            if (userId === item.receiver._id) {
                                skill.imageUrl = item.swapSkill.imageUrl,
                                skill.title = item.swapSkill.title,
                                skill.name = item.sender.name
                            } else {
                                skill.imageUrl = item.skill.imageUrl,
                                skill.title = item.skill.title,
                                skill.name = item.receiver.name
                            }
                            return (
                                <div className="completed-card" key={item._id}>
                                    <img src={skill.imageUrl} alt="skill" className="completed-img" />
                                    <div className="completed-info">
                                        <h3>{skill.title}</h3>
                                        <p>with {skill.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>}
                {etcSkills?.data?.data?.length > 0 && <div className="completed-section">   
                    <h2>Other Skills</h2>
                    <div className="completed-skills-grid">
                        {etcSkills.data.data.map((item) => {
                            return (
                                <SkillCard
                                    key={item._id}
                                    skillsData={item}
                                />
                            )
                        })}
                    </div>
                </div>}

            </div>
            <Footer />
        </>
    )
}

export default CompletedSkills;