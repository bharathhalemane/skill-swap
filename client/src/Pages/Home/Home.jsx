import HomeHeader from "../../components/Header/HomeHeader";
import Footer from "../../components/Footer/Footer";
import './Home.css'
import { FaArrowRight } from "react-icons/fa";
import { LuCoins, LuBookOpen, LuGraduationCap, LuUsers, LuCalendar } from "react-icons/lu";
import { Link } from 'react-router-dom';
import useScrollReveal from "../../components/Utils/useScrollReveal";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import PhoneUpdateModal from "./PhoneUpdateModal";

const categories = [
    { name: "Academics", icon: "📚", count: 312 },
    { name: "Technology", icon: "💻", count: 234 },
    { name: "Languages", icon: "🌍", count: 198 },
    { name: "Career", icon: "💼", count: 156 },
    { name: "Music", icon: "🎵", count: 145 },
    { name: "Wellness", icon: "🧘", count: 123 },
    { name: "Design", icon: "🎨", count: 98 },
    { name: "Others", icon: "⚽", count: 87 },
];


const features = [
    {
        icon: LuUsers,
        title: "Study Groups",
        description: "Join or create study groups for collaborative learning with classmates.",
    },
    {
        icon: LuCalendar,
        title: "Schedule Sync",
        description: "Set availability around your class schedule. No conflicts, just learning.",
    },
    {
        icon: LuGraduationCap,
        title: "Campus Only",
        description: "Connect exclusively with students from your university. Safe & verified.",
    },
];


const howItWorksSteps = [
    {
        step: "01",
        title: "Teach What You Know",
        description: "Share your skills—tutor a subject, teach guitar, help with essays. Earn credits for every session.",
        icon: LuBookOpen,
    },
    {
        step: "02",
        title: "Earn Credits",
        description: "Get 1-4 credits per session based on duration and complexity. Build up your balance.",
        icon: LuCoins,
    },
    {
        step: "03",
        title: "Learn Something New",
        description: "Spend credits to learn from other students. Python, Spanish, photography—anything!",
        icon: LuGraduationCap,
    },
]
const Home = () => {
    const [apiData, setApiData] = useState([])
    const [showPhoneUpdateModal, setShowPhoneUpdateModal] = useState(false)
    const howitworksRef = useScrollReveal();
    const categoriesRef = useScrollReveal();
    const featuresRef = useScrollReveal();
    const spaceRef = useScrollReveal();
    const userId = Cookies.get("userId")
    const token = Cookies.get("jwtToken")

    useEffect(() => {
        const getCategoriesCount = async () => {
            const url = `${import.meta.env.VITE_SKILL_API}/categories/count`
            const response = await axios.get(url)
            setApiData(response.data.data)
        }

        const getUserData = async () => {
            const url = `${import.meta.env.VITE_PROFILE_API}/${userId}`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const user = response.data.user
            if (!user.phoneNumber ) {
                setShowPhoneUpdateModal(true)
            }
        }
        getUserData()
        getCategoriesCount()
    }, [])

    const mergedData = categories.map(cat => {
        const found = apiData.find(item => item.category === cat.name)
        return {
            name: cat.name,
            icon: cat.icon,
            count: found ? found.count : 0
        }
    })

    return (<>
        {
            showPhoneUpdateModal && <PhoneUpdateModal showModal={showPhoneUpdateModal} setShowModal={setShowPhoneUpdateModal} />
        }

        <div className="dashboard-page">
            <HomeHeader />
            <section className="banner-section">
                <h1>Your Campus is a <span>Classroom</span> Without Walls</h1>
                <p>Every student knows something you don't. Swap skills with classmates—teach what you love, learn what you need. Zero cost, all community.</p>
                <div className="banner-buttons">
                    <a href="/find-skills" ><button className='swapping-button'>Start Swapping<FaArrowRight className="arrow-icon" /></button></a>
                </div>
            </section>

            <section className="how-it-works-section reveal" ref={howitworksRef}>
                <div className="container">
                    <div className="head-section">
                        <h2 className="">How SkillSwap Works</h2>
                        <p>No money needed. Teach to earn credits, spend credits to learn new skills. It's that simple.</p>
                    </div>
                    <div className="how-it-works-steps">
                        {
                            howItWorksSteps.map(({ step, title, description, icon: Icon }) => (
                                <div key={step} className="how-it-works-step">
                                    <div className="step-icon">
                                        <Icon className="step-icon-svg" />
                                    </div>
                                    <div className="step-details">
                                        <h3 className="step-title"> {title}</h3>
                                        <p className="step-description">{description}</p>
                                    </div>
                                    <h1 className="step-num">{step}</h1>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            <section className="categories-section reveal" ref={categoriesRef}>
                <div className="container">
                    <div className="head-section">
                        <h2 className="">Explore Categories</h2>
                        <p className="">
                            Discover skills across various categories and find the perfect match for your learning journey.
                        </p>
                    </div>
                    <div className="categories-list">
                        {mergedData.map((category) => (
                            <Link
                                key={category.name}
                                to={`/find-skills?category=${category.name}`}
                                className="categories"
                            >
                                <span className="">{category.icon}</span>
                                <h3 className="">
                                    {category.name}
                                </h3>
                                <p className="">{category.count} Skills</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="features-section reveal" ref={featuresRef}>
                <div className="container">
                    <div className="head-section">
                        <h2 className="">Platform Features</h2>
                        <p className="">
                            Designed for students, by students. Everything you need to learn and teach on campus.
                        </p>
                    </div>
                    <div className="features-list">
                        {features.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="feature-card">
                                <div className="feature-icon">
                                    <Icon className="feature-icon-svg" />
                                </div>
                                <h3 className="feature-title">{title}</h3>
                                <p className="feature-description">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="spacer-section reveal" ref={spaceRef}>
                <div className="container">
                    <h2>Your Next Skill is One Swap Away</h2>
                    <p>Join our community learn together and grow together</p>
                    <a href="/find-skills" className="get-started-button">Browse here</a>
                </div>
            </section>
            <Footer />
        </div>
    </>
    )
}

export default Home;