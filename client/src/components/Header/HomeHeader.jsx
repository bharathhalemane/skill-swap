import styles from './HomeHeader.module.css'
import { IoMdSwap } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { useState, useEffect } from 'react';
import axios from "axios"
import { Menu, X, Download } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux"
import { fetchProfileData } from '../../redux/features/profile/ProfileActions';
import { fetchUnreadTotal } from "../../redux/features/chat/chatActions"
import { useInstallPrompt } from "../../hooks/useInstallPrompt"
import socket from "../../Socket"

const HomeHeader = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const { canInstall, promptInstall } = useInstallPrompt()
    const [menuOpen, setMenuOpen] = useState(false)
    const { profileImage } = useSelector(state => state.profile)
    const unreadTotal = useSelector(state => state.chat.unreadTotal)
    const unreadCount = useSelector(state => state.notifications.unreadCount)

    const navLinks = [
        { href: "/home", label: "Home" },
        { href: "/find-skills", label: "Find Skills" },
        { href: "/chat", label: "Chat", badge: unreadTotal},
        { href: "/study-groups", label: "Study Groups" },
        { href: "/completed-skills", label: "Completed Skills" },
        { href: "/creations", label: "Creations" },
        { href: "/feedback", label: "Feedback" }
    ];

    useEffect(() => {
        if (!profileImage) {
            dispatch(fetchProfileData())
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchUnreadTotal())
        const handleIncoming = () => dispatch(fetchUnreadTotal())
        socket.on("chat:message", handleIncoming)
        return () => socket.off("chat:message", handleIncoming)
    },[dispatch])

    const isActive = (path) => location.pathname === path ? styles.active : ""

    const closeMenu = () => setMenuOpen(false)

    const onClickLogout = () => {
        Cookies.remove("jwtToken")
        Cookies.remove("userId")
        navigate("/")
    }

    return (
        <nav className={styles.header}>

            {/* LOGO */}
            <div className={styles.logo}>
                <div className={styles.iconBox}>
                    <IoMdSwap className={styles.icon} />
                </div>
                <h1>Skill<span>Swap</span></h1>
            </div>

            {/* ── DESKTOP: Nav links ── */}
            <ul className={styles.navLinks}>
                {navLinks.map(link => (
                    <li key={link.href}>
                        <Link
                            to={link.href}
                            className={`${styles.link} ${isActive(link.href)}`}
                        >
                            {link.label}
                            {!!link.badge && <span className={styles.navBadge}>{link.badge}</span>}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* ── DESKTOP: Auth (profile + logout) ── */}
            <ul className={styles.authLinks}>
                <li>
                    <Link to="/profile">
                        <div className={styles.profileBox}>
                            {profileImage
                                ? <img src={profileImage} alt="Profile" className={styles.profileImg} />
                                : <IoPersonCircle className={styles.profileIcon} />
                            }
                            {unreadCount > 0 && <span className={styles.notifDot} />}
                        </div>
                    </Link>
                </li>
                {canInstall && (
                    <li>
                        <button className={styles.installBtn} onClick={promptInstall}>
                            <Download size={20} />
                        </button>
                    </li>
                )}
                <li>
                    <button className={styles.logoutBtn} onClick={onClickLogout}>
                        Logout
                    </button>
                </li>
            </ul>

            {/* ── MOBILE: Hamburger ── */}
            <div
                className={styles.hamburger}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
            >
                {menuOpen ? <X /> : <Menu />}
                {unreadCount > 0 && <span className={styles.notifDot} />}
            </div>

            {/* ── MOBILE: Single unified menu ── */}
            <ul className={`${styles.mobileMenu} ${menuOpen ? styles.show : ''}`}>

                {/* Nav links */}
                {navLinks.map(link => (
                    <li key={link.href}>
                        <Link
                            to={link.href}
                            className={`${styles.link} ${isActive(link.href)}`}
                            onClick={closeMenu}
                        >
                            {link.label}
                            {!!link.badge && <span className={styles.navBadge}>{link.badge}</span>}
                        </Link>
                    </li>
                ))}
                {
                    canInstall && (
                        <li>
                            <button className={styles.installBtnMobile} onClick={() => { promptInstall(); closeMenu(); }}>
                                <Download size={20} />
                                Install App
                            </button>
                        </li>
                    )
                }

                {/* Profile row */}
                <li className={styles.profileLogout}>
                    <Link
                        to="/profile"
                        className={styles.mobileProfileRow}
                        onClick={closeMenu}
                    >
                        <div className={styles.profileBox}>
                            {profileImage
                                ? <img src={profileImage} alt="Profile" className={styles.profileImg} />
                                : <IoPersonCircle className={styles.profileIcon} />
                            }
                            {unreadCount > 0 && <span className={styles.notifDot} />}
                        </div>
                        <span className={styles.mobileProfileLabel}>My Profile</span>
                    </Link>
                    <button className={styles.logoutBtn} onClick={onClickLogout}>
                        Logout
                    </button>
                </li>


            </ul>
        </nav>
    )
}

export default HomeHeader;