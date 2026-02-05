import './HomeHeader.css'
import { IoMdSwap } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

const HomeHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const navLinks = [
        { href: "/home", label: "Home" },
        { href: "/find-skills", label: "Find Skills" },
        { href: "/study-groups", label: "Study Groups" },
        { href: "/stats", label: "Stats" },
    ];

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
                <li><a href="/profile"><button><IoPersonCircle className="profile-icon" /></button></a></li>
                <li><button className='logout-btn' onClick={onClickLogout}>LogOut</button></li>
            </ul>
        </nav>
    )
}

export default HomeHeader;