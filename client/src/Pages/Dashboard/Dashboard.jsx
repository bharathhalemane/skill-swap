import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './Dashboard.css'
import { FaArrowRight } from "react-icons/fa";
import { LuCoins, LuBookOpen, LuGraduationCap, LuUsers, LuCalendar } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import useScrollReveal from "../../components/Utils/useScrollReveal";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"
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
        icon: LuCoins,
        title: "Credit System",
        description: "Earn credits by teaching, spend them to learn. Fair exchange for everyone.",
    },
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
const Dashboard = () => {
    const navigate = useNavigate();
    const [apiData, setApiData] = useState([])
    const howitworksRef = useScrollReveal();
    const categoriesRef = useScrollReveal();
    const featuresRef = useScrollReveal();
    const spaceRef = useScrollReveal();

    useEffect(() => {
        const jwtToken = Cookies.get("jwtToken");
        if (jwtToken) {
            navigate("/home")
        }

        const getCategoriesCount = async () => {
            const url = `${import.meta.env.VITE_SKILL_API}/categories/count`
            const response = await axios.get(url)
            setApiData(response.data.data)
        }
        getCategoriesCount()
    }, [navigate])

    const mergedData = categories.map(cat => {
        const found = apiData.find(item => item.category === cat.name)
        return {
            name: cat.name,
            icon: cat.icon,
            count: found ? found.count : 0
        }
    })

    return (
        <div className="dashboard-page">
            <Header />
            <section className="banner-section">
                <h1>Learn from <span>Classmates</span>, Teach What You Know</h1>
                <p>Swap skills with fellow students. Get help with calculus, learn guitar, practice coding - all by exchanging what you're good at</p>
                <div className="banner-buttons">
                    <a href="/signup" >
                        <button className='swapping-button'>Join with email <FaArrowRight className="arrow-icon" />
                        </button>
                    </a>
                    <a href="/find-skills" >
                        <button className='browse-skills-button'>Browse Skills</button>
                    </a>
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
                            <div

                                className="categories"
                                keu={category.name}
                            >
                                <span className="">{category.icon}</span>
                                <h3 className="">
                                    {category.name}
                                </h3>
                                <p className="">{category.count} Skills</p>
                            </div>
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
                    <div className="features-list-dashboard">
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
                    <h2>Ready to Start Learning?</h2>
                    <p>Join your campus community. Sign up with your email and start swapping skills today.</p>
                    <a href="/signup" className="get-started-button">Get Started Free</a>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Dashboard;