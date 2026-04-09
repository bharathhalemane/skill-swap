import styles from './Profile.module.css'
import HomeHeader from '../Header/HomeHeader'
import Footer from '../Footer/Footer'
import { useState, useEffect } from "react"
import EditProfileModal from "./Modals/EditProfileModal"
import Cookies from 'js-cookie'
import axios from "axios"
import { BsPersonCircle } from "react-icons/bs";
import SkillDetails from './Skill/SkillDetails'
import ClassSchedule from './Schedule/ClassSchedule'
import Availability from './Availability/Availability'
import ReceivedRequest from './requests/ReceivedRequests/ReceivedRequest'
import SentRequests from './requests/SentRequests/SentRequests'
import LearningSkills from './LearningSkills/LearningSkills'

const Profile = () => {
    const token = Cookies.get("jwtToken")
    const userId = Cookies.get("userId")
    const [profileData, setProfileData] = useState()

    const getProfileData = async () => {
        try {
            const url = `${import.meta.env.VITE_PROFILE_API}/${userId}`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = response.data.user
            setProfileData({
                email: data.email,
                name: data.name,
                profile: {
                    username: data.profile.username,
                    bio: data.profile.bio,
                    location: data.profile.location,
                    profileImage: data.profile.profile_image
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProfileData()
    }, [])

    const handleProfileEditor = () => {
        return <EditProfileModal profileDetails={profileData} onProfileUpdated={getProfileData} />
    }

    const ProfileDetails = () => {
        const { profile, name } = profileData || {}

        return (
            <div className={styles.profileHeader}>
                <div className={styles.profileCover}></div>
                <div className={styles.profileDetailsContainer}>
                    {profile ? (
                        <>
                            <div className={styles.profileImageContainer}>
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt="profile"
                                        className={styles.profileImage}
                                    />
                                ) : (
                                    <BsPersonCircle className={styles.noProfileImage} />
                                )}
                            </div>

                            <div className={styles.profileDetails}>
                                <h1 className={styles.name}>
                                    {name ? name : "Please edit your profile"}
                                </h1>
                                <h3 className={styles.username}>
                                    {profile.username ? `@${profile.username}` : "username"}
                                </h3>
                                <p className={styles.bio}>
                                    {profile.bio ? profile.bio : "no bio saved"}
                                </p>
                            </div>

                            <div className={styles.editProfileButtonContainer}>
                                <EditProfileModal profileDetails={profileData} onProfileUpdated={getProfileData} />
                            </div>
                        </>
                    ) : (
                        <div className={styles.noProfileWrapper}>
                            <BsPersonCircle size={80} color='#e76f51' className={styles.noProfileImage} />
                            <p>No profile data found</p>
                            <div className={styles.editProfileButtonContainer}>
                                <EditProfileModal profileDetails={profileData} onProfileUpdated={getProfileData} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <HomeHeader />
            <div className={styles.profilePage}>
                {ProfileDetails()}
                <ReceivedRequest />
                <SentRequests />
                <hr />
                <SkillDetails />
                <hr />
                <ClassSchedule />
                <Availability />
                <LearningSkills />
            </div>
            <Footer />
        </>
    )
}

export default Profile