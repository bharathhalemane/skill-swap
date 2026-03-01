import './Profile.css'
import HomeHeader from '../Header/HomeHeader'
import Footer from '../Footer/Footer'
import { useState, useEffect } from "react"
import EditProfileModal from "./EditProfileModel"
import Cookies from 'js-cookie'
import axios from "axios"

const Profile = () => {
    const token = Cookies.get("jwtToken")
    

    const getProfileData = async () => {
        try {
        const url = `${import.meta.env.VITE_PROFILE_API}/`
        const response = await axios.get(url, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data.user)
        } catch (err) {
        console.log(err)
        }
    }

    useEffect(() => {
        getProfileData()
    },[])

    
    return <>
        <HomeHeader />
        <div className='profile-page'>
            <EditProfileModal/>
        </div>
        <Footer/>
    </>
}

export default Profile