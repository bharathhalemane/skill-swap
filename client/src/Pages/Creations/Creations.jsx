import HomeHeader from '../../components/Header/HomeHeader'
import Footer from '../../components/Footer/Footer'
import SkillCardSkeleton from '../../components/Utils/SkillCard/SkillCardSkeleton'
import StudyGroupsCardSkeleton from '../StudyGroups/StudyGroupCard/StudyGroupCardSkeleton'
import styles from './Creations.module.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCreatedContent } from '../../redux/features/creations/createdContentSlice'
import Cookies from 'js-cookie'
import SkillCard from '../../components/Utils/SkillCard/SkillCard'
import StudyGroupsCard from '../StudyGroups/StudyGroupCard/StudyGroupCard'

const Creations = () => {
    const dispatch = useDispatch()
    const { skills, groups, loading } = useSelector(state => state.createdContent)
    const userId = Cookies.get("userId")

    useEffect(() => {
        const getCreatedContent = async () => {
            if (skills.length === 0) {
                await dispatch(fetchCreatedContent(userId))
            }
        }
        getCreatedContent()
    }, [dispatch, skills.length])

    console.log("Created Skills:", skills)
    console.log("Created Groups:", groups)

    return (
        <>
            <HomeHeader />
            <div className={styles.container}>
                <h2>Created Skills</h2>
                <ul className={styles.skillsList}>
                    {
                        loading ?
                            <>
                                {
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <li key={index} className={styles.skeletonListItem}>
                                            <SkillCardSkeleton />
                                        </li>
                                    ))
                                }
                            </>
                            : <>
                                {skills.map((skill) => (
                                    <li key={skill.id} className={styles.skillListItem}>
                                        <SkillCard  skillsData={skill} creationPage={true} />
                                    </li>))
                                }
                            </>
                    }
                </ul>
                <h2>Created Groups</h2>
                <ul className={styles.groupsList}>
                    {
                        loading ? <>
                            {
                                Array.from({ length: 3 }).map((_, index) => (
                                    <li key={index} className={styles.skeletonListItem}>
                                        <StudyGroupsCardSkeleton />
                                    </li>
                                ))
                            }
                        </> : <>
                                 {groups.map((group) => (
                            <li key={group.id}><StudyGroupsCard data={group} creationPage={true}/></li>
                        ))}                       
                            </>
                    }
                </ul>                
            </div>
            <Footer />
        </>
    )
}

export default Creations