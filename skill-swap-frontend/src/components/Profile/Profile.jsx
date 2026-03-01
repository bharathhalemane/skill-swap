import './Profile.css'
import HomeHeader from '../Header/HomeHeader'
import Footer from '../Footer/Footer'
import { useState } from "react"
import EditProfileModal from "./EditProfileModel"

const Profile = () => {
    
    return <>
        <HomeHeader />
        <div className='profile-page'>
            <EditProfileModal/>
        </div>
        <Footer/>
    </>
}

export default Profile