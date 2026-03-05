import './HomeHeader.css'
import { IoMdSwap } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useState, useEffect } from 'react';
import axios from "axios"

const HomeHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const navLinks = [
        { href: "/home", label: "Home" },
        { href: "/find-skills", label: "Find Skills" },
        { href: "/study-groups", label: "Study Groups" },
        { href: "/stats", label: "Stats" },
    ];

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
                    profileImage : data.profile.profile_image
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProfileData()
    }, [])

    const isActive = (path) => {
        return location.pathname === path ? "active-link" : "";
    }

    const onClickLogout = () => {
        Cookies.remove("jwtToken")
        navigate("/")
    }

    return (
        <nav className="header">
            <div className="logo"><div className='swap-icon-con'><IoMdSwap className="swap-icon" /></div><h1>Skill<span>Swap</span></h1></div>
            <ul>
                {
                    navLinks.map((link, index) => (
                        <li key={index}>
                            <Link to={link.href} className={`nav-link ${isActive(link.href)}`}>{link.label}</Link>
                        </li>
                    ))
                }
            </ul>
            <ul className="auth-links">
                <li><a href="/profile"><button>
                    {
                        profileData?.profile?.profileImage ? <img src={profileData.profile.profileImage} className='profile-image-icon' /> : <IoPersonCircle className="profile-icon" />
                    }
                </button></a></li>
                <li><button className='logout-btn' onClick={onClickLogout}>LogOut</button></li>
            </ul>
        </nav>
    )
}

export default HomeHeader;