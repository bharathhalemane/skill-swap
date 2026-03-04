import CreateSkillModal from "./CreateSkillModal"
import { useState, useEffect } from "react"
import { SlBadge } from "react-icons/sl";
import { HiMiniPencil } from "react-icons/hi2";
import { BsTrash } from "react-icons/bs";
import axios from "axios"
import Cookies from "js-cookie"
const SkillDetails = () => {
    const [teachingSkillData, setTeachingSkillData] = useState([])
    const userId = Cookies.get("userId")
    const token = Cookies.get("jwtToken")
    const getUserSkillData = async () => {
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/user/${userId}`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.skills)
            setTeachingSkillData(response.data.skills)
        } catch (err) {
            console.log(err)
        }
    }

    const deleteSkill = async (skillId) => {
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/delete/${skillId}`
            console.log(url)
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getUserSkillData()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUserSkillData()
    }, [])

    return <div className="skills-details-list">
        <h1><SlBadge color="#f08a24" />Skills I'm Teaching</h1>
        <ul>
            {
                teachingSkillData.map(each => (
                    <li key={each.id}>
                        <div className="user-skill-card">
                            <div className="skill-details">
                                <h1>{each.title}</h1>
                                <div className="skill-category-details">
                                    <div className="category-badge">{each.category}</div>
                                    <div className={`level-badge level-${each.level.toLowerCase()}`}>{each.level}</div>
                                </div>
                            </div>
                            <div className="skill-operation-container">
                                <HiMiniPencil size={20}/>
                                <BsTrash size={25} color="#ff0000" onClick={()=>deleteSkill(each.id)}/>
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul>
        {
            teachingSkillData.length > 0 ?
                <CreateSkillModal buttonTitle="Add Skill" /> : <CreateSkillModal buttonTitle="Create Skill" />
        }
    </div>
}

export default SkillDetails