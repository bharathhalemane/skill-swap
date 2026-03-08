import { useSearchParams } from 'react-router-dom'
import HomeHeader from '../Header/HomeHeader'
import Footer from '../Footer/Footer'
import './BrowseSkills.css'
import { useState, useEffect } from "react"
import { MdSearch } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import SkillCard from '../Utils/SkillCard/SkillCard';
import Cookies from 'js-cookie'

const categories = [
    { name: "Academics", icon: "📚", count: 312 },
    { name: "Technology", icon: "💻", count: 234 },
    { name: "Languages", icon: "🌍", count: 198 },
    { name: "Career", icon: "💼", count: 156 },
    { name: "Music", icon: "🎵", count: 145 },
]

const levels = [
    { name: "Advanced" },
    { name: "Beginner" },
    { name: "Intermediate" }
]

const skillApi = import.meta.env.VITE_SKILL_API

const BrowseSkills = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const userId = searchParams.get("userId")
    const [category, setCategory] = useState("")
    const [level, setLevel] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [skillData, setSkillData] = useState([])
    const [totalSkills, setTotalSkills] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const lastPage = Math.ceil(totalSkills / 8)

    const onChangeInputValue = e => {
        setInputValue(e.target.value)
    }

    const onChangeCategory = e => {
        setCategory(e.target.value)
    }

    const onChangeLevel = e => {
        setLevel(e.target.value)
    }

    const onClearLevel = () => {
        setLevel("")
    }
    const getSkillData = async () => {
        try {
            const url = `${skillApi}?category=${category}&level=${level}&title=${inputValue}&page=${currentPage}&limit=8`
            console.log(url)
            const option = {
                method: "GET"
            }
            const response = await fetch(url, option)
            if (response.ok) {
                const data = await response.json()
                const formattedSkills = data.skills.map(skill => ({
                    id: skill._id,
                    title: skill.title,
                    description: skill.description,
                    duration: skill.duration,
                    imageUrl: skill.imageUrl,
                    category: skill.category,
                    level: skill.level,
                    user: {
                        name: skill.user.name,
                        profileImage: skill.user.profile?.profile_image
                    }
                }))
                setSkillData(formattedSkills)
                setTotalSkills(data.totalSkills)
            }
        } catch {
            console.log(err)
        }
    }

    useEffect(() => {
        getSkillData()
    }, [inputValue, category, level, currentPage])

    return (
        <>
            <HomeHeader />
            <div className="browse-skill-page">
                <div className="dashboard-section">
                    <h1>Browse Skills</h1>
                    <p>Discover skills from our community of passionate teachers. Filter by category, level, or search for specific skills.</p>
                </div>

                <div className="filter-section">
                    <div className="input-filter-container">
                        <div className="skill-input-container">
                            <MdSearch size={20} />
                            <input type="search" placeholder='Search Skills...' value={inputValue} onChange={onChangeInputValue} />
                        </div>
                        <ul className='categories-filter-list'>
                            <li><button className={`category-filter-btn ${category === "" ? "active" : ""}`} onClick={onChangeCategory} value="">All</button></li>
                            {
                                categories.map(each => (
                                    <li><button className={`category-filter-btn ${category === each.name ? "active" : ""}`} value={each.name} onClick={onChangeCategory}>{each.icon} {each.name}</button></li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="level-filter-container">
                        <HiAdjustmentsHorizontal size={30} color="#a3a2a2" />
                        <ul>
                            {
                                levels.map(each => (
                                    <li><button className={`level-filter-btn ${each.name === level ? "active" : ""}`} value={each.name} onClick={onChangeLevel}>{each.name}</button></li>
                                ))
                            }
                            <li><button className={`level-filter-btn ${level ? "" : "d-none"}`} onClick={onClearLevel}>Clear Filter</button></li>
                        </ul>
                    </div>
                </div>
                <div className="skills-section">
                    <h1 className='skills-length'>{
                        totalSkills > 0 ? `Available ${totalSkills} Skills` : 'No Skill Found'
                    }</h1>
                    <ul className="skills-list">
                        {
                            skillData.map(each => (
                                <li key={each.id}><SkillCard skillsData={each} /></li>
                            ))
                        }
                    </ul>
                    {
                        totalSkills > 8 ? <div className="pagination-button-container">
                        <button className={`prev-button ${currentPage===1 ? "button-disable" : ""}`} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                        <button className={`next-button ${currentPage===lastPage ? "button-disable" : ""}`} disabled={currentPage === lastPage} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                    </div> : null
                    }
                </div>
                <Footer />
            </div>
        </>
    )
}

export default BrowseSkills;