import styles from './LearningSkills.module.css'
import { endLearning } from '../requestAPi'
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { fetchLearningSkills } from '../../../redux/features/learningSkills/learningSkillsActions'

const LearningSkills = () => {
    const dispatch = useDispatch()
    const skillsData = useSelector(state => state.learningSkills.learningSkills)

    useEffect(() => {
        if (skillsData.length === 0) {
            dispatch(fetchLearningSkills())
        }
    }, [dispatch])

    const handleLearning = async (id) => {
        await endLearning(dispatch, id)
    }

    if (skillsData.length === 0) return null

    return (
        <>
            <hr />
            <div className={styles.learningContainer}>
                <div className={styles.learningContainerHeader}>
                    <h2>Currently Learning</h2>
                    <Link to="/completed-skills" className={styles.completedPageLink}>
                        Completed
                    </Link>
                </div>

                <div className={styles.learningGrid}>
                    {skillsData.map((item) => (
                        <div className={styles.learningCard} key={item.id}>
                            <img
                                src={item.skill?.imageUrl}
                                alt="profile"
                                className={styles.learningImg}
                            />
                            <div className={styles.learningInfo}>
                                <h3>{item.skill?.title}</h3>
                                <p>with {item.partner?.name}</p>
                                <div className={styles.learningActions}>
                                    <span className={styles.status}>In Progress</span>
                                    <button
                                        className={styles.completeBtn}
                                        onClick={() => handleLearning(item.id)}
                                    >
                                        Completed
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default LearningSkills