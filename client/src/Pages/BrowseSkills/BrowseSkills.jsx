import { useSearchParams } from 'react-router-dom'
import HomeHeader from '../../components/Header/HomeHeader'
import Footer from '../../components/Footer/Footer'
import styles from './BrowseSkills.module.css'
import { useState, useEffect } from "react"
import { MdSearch } from "react-icons/md";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import SkillCard from '../../components/Utils/SkillCard/SkillCard';
import SkillCardSkeleton from '../../components/Utils/SkillCard/SkillCardSkeleton'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSkills } from '../../redux/features/skills/skillsActions'

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

const apiProgress = {
    loading: 'LOADING',
    success: "SUCCESS"
}

const skillApi = import.meta.env.VITE_SKILL_API

// Returns limit based on current window width:
// mobile (≤768px) → 4  |  tablet (≤1024px) → 6  |  desktop → 8
const getLimit = () => {
    if (window.innerWidth <= 768) return 4
    if (window.innerWidth <= 1024) return 6
    return 8
}

const BrowseSkills = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const userId = searchParams.get("userId")
    const [category, setCategory] = useState(searchParams.get('category') || "")
    const [level, setLevel] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [skillData, setSkillData] = useState([])
    const [skillDataProgress, setSkillDataProgress] = useState(apiProgress.loading)
    const [totalSkills, setTotalSkills] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(getLimit)
    const { skills } = useSelector((state) => state.skills)
    console.log(skills)
    const lastPage = Math.ceil(totalSkills / limit)

    // Update limit on window resize and reset to page 1
    useEffect(() => {
        const handleResize = () => {
            const newLimit = getLimit()
            setLimit(prev => {
                if (prev !== newLimit) {
                    setCurrentPage(1)
                    return newLimit
                }
                return prev
            })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const onChangeInputValue = e => {
        setInputValue(e.target.value)
        setCurrentPage(1)
    }
    const onChangeCategory = e => {
        setCategory(e.target.value)
        setCurrentPage(1)
    }
    const onChangeLevel = e => {
        setLevel(e.target.value)
        setCurrentPage(1)
    }
    const onClearLevel = () => {
        setLevel("")
        setCurrentPage(1)
    }

    const getSkillData = async () => {
        setSkillDataProgress(apiProgress.loading)
        try {
            const url = new URL(window.location.href)
            url.searchParams.set("category", category || "all")
            url.searchParams.set("level", level)
            url.searchParams.set("title", inputValue)
            window.history.pushState({}, "", url)
            const skillUrl = `${skillApi}?category=${category}&level=${level}&title=${inputValue}&page=${currentPage}&limit=${limit}`
            const response = await fetch(skillUrl, { method: "GET" })
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
                        profileImage: skill.user.profile?.profile_image,
                        userId: skill.user._id
                    }
                }))
                setSkillData(formattedSkills)
                setTotalSkills(data.totalSkills)
            }
            setSkillDataProgress(apiProgress.success)
        } catch (err) {
            console.log(err)
        }
    }

    // useEffect(() => {
    //     getSkillData()
    // }, [inputValue, category, level, currentPage, limit])

    useEffect(() => {
        dispatch(fetchSkills())
        setSkillDataProgress(apiProgress.success)
    }, [dispatch])

    return (
        <>
            <HomeHeader />
            <div className={styles.browseSkillPage}>
                {/* ── Hero ── */}
                <div className={styles.dashboardSection}>
                    <h1>Browse Skills</h1>
                    <p>Discover skills from our community of passionate teachers. Filter by category, level, or search for specific skills.</p>
                </div>

                {/* ── Filters ── */}
                <div className={styles.filterSection}>
                    <div className={styles.inputFilterContainer}>
                        <div className={styles.skillInputContainer}>
                            <MdSearch size={20} />
                            <input
                                type="search"
                                placeholder='Search Skills...'
                                value={inputValue}
                                onChange={onChangeInputValue}
                            />
                        </div>
                        <ul className={styles.categoriesFilterList}>
                            <li>
                                <button
                                    className={`${styles.categoryFilterBtn} ${category === "" || category === "all" ? styles.active : ""}`}
                                    onClick={onChangeCategory}
                                    value=""
                                >
                                    All
                                </button>
                            </li>
                            {categories.map(each => (
                                <li key={each.name}>
                                    <button
                                        className={`${styles.categoryFilterBtn} ${category === each.name ? styles.active : ""}`}
                                        value={each.name}
                                        onClick={onChangeCategory}
                                    >
                                        {each.icon} {each.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.levelFilterContainer}>
                        <HiAdjustmentsHorizontal size={30} color="#a3a2a2" />
                        <ul>
                            {levels.map(each => (
                                <li key={each.name}>
                                    <button
                                        className={`${styles.levelFilterBtn} ${each.name === level ? styles.active : ""}`}
                                        value={each.name}
                                        onClick={onChangeLevel}
                                    >
                                        {each.name}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    className={`${styles.levelFilterBtn} ${level ? "" : styles.dNone}`}
                                    onClick={onClearLevel}
                                >
                                    Clear Filter
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ── Skills Grid ── */}
                <div className={styles.skillsSection}>
                    <h1 className={styles.skillsLength}>
                        {totalSkills > 0 ? `Available ${totalSkills} Skills` : 'No Skill Found'}
                    </h1>
                    <ul className={styles.skillsList}>
                        {
                            skillDataProgress === apiProgress.loading ?
                                Array(limit)
                                    .fill(0)
                                    .map((_, i) => <SkillCardSkeleton key={i} />)
                                :
                                skills.map(each => (
                                    <li key={each.id}>
                                        <SkillCard skillsData={each} />
                                    </li>
                                ))

                        }
                    </ul>

                    {totalSkills > limit && (
                        <div className={styles.paginationButtonContainer}>
                            <button
                                className={`${styles.prevButton} ${currentPage === 1 ? styles.buttonDisable : ""}`}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Prev
                            </button>
                            <button
                                className={`${styles.nextButton} ${currentPage === lastPage ? styles.buttonDisable : ""}`}
                                disabled={currentPage === lastPage}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    )
}

export default BrowseSkills;