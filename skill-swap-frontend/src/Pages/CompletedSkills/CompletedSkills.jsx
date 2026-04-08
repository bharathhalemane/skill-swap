import HomeHeader from "../../components/Header/HomeHeader";
import Footer from "../../components/Footer/Footer";
import { completedSkills, getAnySkills } from "./CompletedApi";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SkillCard from "../../components/Utils/SkillCard/SkillCard";
import styles from './CompletedSkills.module.css';

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
            let data = []
            if (window.innerWidth <= 768) {
                data = response.data.data.slice(0, 2)
            }
            else {
                data = response.data.data
            }
            setEtcSkills(data)
        }

        getCompletedSkills()
        getEtcSkills()
    }, [])

    return (
        <>
            <HomeHeader />
            <div className={styles.completedSkillsContainer}>

                {learned?.length > 0 && (
                    <div className={styles.completedSection}>
                        <h2>Skills Learned</h2>
                        <div className={styles.completedSkillsGrid}>
                            {learned.map((item) => (
                                <div className={styles.completedCard} key={item._id}>
                                    <img src={item.skill.imageUrl} alt="skill" className={styles.completedImg} />
                                    <div className={styles.completedInfo}>
                                        <h3>{item.skill.title}</h3>
                                        <p>by {item.receiver.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {taught?.length > 0 && (
                    <div className={styles.completedSection}>
                        <h2>Skills Taught</h2>
                        <div className={styles.completedSkillsGrid}>
                            {taught.map((item) => (
                                <div className={styles.completedCard} key={item._id}>
                                    <img src={item.skill.imageUrl} alt="skill" className={styles.completedImg} />
                                    <div className={styles.completedInfo}>
                                        <h3>{item.skill.title}</h3>
                                        <p>to {item.sender.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {swaps?.length > 0 && (
                    <div className={styles.completedSection}>
                        <h2>Swaps Completed</h2>
                        <div className={styles.completedSkillsGrid}>
                            {swaps.map((item) => {
                                const userId = Cookies.get('userId')
                                let skill = { imageUrl: '', title: '', name: '' }
                                if (userId === item.receiver._id) {
                                    skill.imageUrl = item.swapSkill.imageUrl
                                    skill.title = item.swapSkill.title
                                    skill.name = item.sender.name
                                } else {
                                    skill.imageUrl = item.skill.imageUrl
                                    skill.title = item.skill.title
                                    skill.name = item.receiver.name
                                }
                                return (
                                    <div className={styles.completedCard} key={item._id}>
                                        <img src={skill.imageUrl} alt="skill" className={styles.completedImg} />
                                        <div className={styles.completedInfo}>
                                            <h3>{skill.title}</h3>
                                            <p>with {skill.name}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {etcSkills?.length > 0 && (
                    <div className={styles.completedSection}>
                        <h2>Other Skills</h2>
                        <div className={styles.etcSkillsGrid}>
                            {etcSkills.map((item) => (
                                <SkillCard
                                    key={item._id}
                                    skillsData={item}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </>
    )
}

export default CompletedSkills;