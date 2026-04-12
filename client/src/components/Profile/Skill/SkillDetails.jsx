import CreateSkillModal from "../Modals/CreateSkillModal"
import EditSkillModal from "../Modals/EditSkillModal";
import { useState, useEffect } from "react"
import { SlBadge } from "react-icons/sl";
import { BsTrash } from "react-icons/bs";
import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify";
import styles from './SkillDetails.module.css'

const SkillDetails = () => {
    const [teachingSkillData, setTeachingSkillData] = useState([])
    const [changes, setChanges] = useState(false)
    const [totalSkills, setTotalSkills] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const userId = Cookies.get("userId")
    const token = Cookies.get("jwtToken")
    const lastPage = Math.ceil(totalSkills / 4)

    const getUserSkillData = async () => {
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/user/${userId}?page=${currentPage}&limit=4`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTeachingSkillData(response.data.skills)
            setTotalSkills(response.data.totalSkills)
            setChanges(false)
        } catch (err) {
            console.log(err)
            setChanges(false)
        }
    }

    const deleteSkill = async (skillId) => {
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/delete/${skillId}`
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.warning("Skill Deleted Successfully!")
            getUserSkillData()
        } catch (err) {
            toast.error("Unable to delete Skill Retry!")
        }
    }

    useEffect(() => {
        getUserSkillData()
    }, [changes, currentPage])

    return (
        <div className={styles.skillsDetailsList}>
            <h1 className={styles.skillDetailsListHeader}>
                <SlBadge color="#f08a24" size={30} />
                Skills I'm Teaching
            </h1>

            <ul>
                {teachingSkillData.map(each => (
                    <li key={each.id}>
                        <div className={styles.userSkillCard}>
                            <div className={styles.skillDetails}>
                                <h1>{each.title}</h1>
                                <div className={styles.skillCategoryDetails}>
                                    <div className={styles.categoryBadge}>{each.category}</div>
                                    <div className={`${styles.levelBadge} ${styles[`level${each.level.charAt(0).toUpperCase() + each.level.slice(1).toLowerCase()}`]}`}>
                                        {each.level}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.skillOperationContainer}>
                                <EditSkillModal setChanges={setChanges} skillId={each.id} skillData={each} />
                                <BsTrash size={25} color="#ff0000" onClick={() => deleteSkill(each.id)} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className={styles.createControllerContainer}>
                {teachingSkillData.length > 4
                    ? <CreateSkillModal buttonTitle="Add Skill" setChanges={setChanges} />
                    : <CreateSkillModal buttonTitle="Create Skill" setChanges={setChanges} />
                }
                {totalSkills > 0 && (
                    <div className={styles.paginationButtonContainer}>
                        <button
                            className={`${styles.prevButton} ${currentPage === 1 ? styles.buttonDisable : ''}`}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Prev
                        </button>
                        <button
                            className={`${styles.nextButton} ${currentPage === lastPage ? styles.buttonDisable : ''}`}
                            disabled={currentPage === lastPage}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SkillDetails