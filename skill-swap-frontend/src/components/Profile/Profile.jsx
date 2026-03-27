import './Profile.css'
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

    const ProfileDetails = () => {
        const { profile, name } = profileData || {};

        return (
            <div className='profile-header'>
                <div className="profile-cover"></div>
                <div className="profile-details-container">
                    {profile ? (
                        <>
                            <div className="profile-image-container">
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt="profile"
                                        className="profile-image"
                                    />
                                ) : (
                                    <BsPersonCircle className="no-profile-image" />
                                )}
                            </div>

                            <div className="profile-details">
                                <h1 className="name">
                                    {name ? name : "Please edit your profile"}
                                </h1>

                                <h3 className="username">
                                    @{profile.username ? profile.username : "username"}
                                </h3>

                                <p className="bio">
                                    {profile.bio ? profile.bio : "no bio saved"}
                                </p>
                            </div>

                            <div className="edit-profile-button-container">
                                <EditProfileModal profileDetails={profileData} onProfileUpdated={getProfileData} />
                            </div>
                        </>
                    ) : (
                        <div className="no-profile-wrapper">
                            <BsPersonCircle size={80} color='#e76f51' className="no-profile-image" />
                            <p>No profile data found</p>
                            <div className="edit-profile-button-container">
                                <EditProfileModal profileDetails={profileData} onProfileUpdated={getProfileData} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <>
        <HomeHeader />
        <div className='profile-page'>
            {ProfileDetails()}
            <ReceivedRequest />
            <SentRequests />
            <hr />
            <SkillDetails />
            <hr />
            <ClassSchedule />
            <hr />
            <Availability />
        </div>
        <Footer />
    </>
}

export default Profile



