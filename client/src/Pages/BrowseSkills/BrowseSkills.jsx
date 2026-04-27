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
import { fetchSkills, updateLimit, updateSearch, updateCategory, updateLevel, updatePage } from '../../redux/features/skills/skillsActions'

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
    const { level } = useSelector((state) => state.skills.filters)
    const [skillData, setSkillData] = useState([])
    const { loading } = useSelector(state => state.skills)
    const { page } = useSelector(state => state.skills)
    const { category } = useSelector((state) => state.skills.filters)
    const { inputValue } = useSelector((state) => state.skills.filters)
    const { limit } = useSelector(state => state.skills.filters)
    const skill = useSelector(state => state)
    const { totalSkills } = useSelector((state) => state.skills)
    const { skills } = useSelector((state) => state.skills)
    const lastPage = Math.ceil(totalSkills / limit)

    // Update limit on window resize and reset to page 1
    useEffect(() => {
        const handleResize = () => {
            const newLimit = getLimit()
            if (limit !== newLimit) {
                dispatch(updatePage(1))
            }
            dispatch(updateLimit(
                newLimit
            ))
            dispatch(fetchSkills())
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const onChangeInputValue = e => {
        dispatch(updateSearch(e.target.value))
        dispatch(updatePage(1))
        dispatch(fetchSkills())
    }
    const onChangeCategory = e => {
        dispatch(updateCategory(e.target.value))
        dispatch(updatePage(1))
        dispatch(fetchSkills())
    }
    const onChangeLevel = e => {
        dispatch(updateLevel(e.target.value))
        dispatch(updatePage(1))
        dispatch(fetchSkills())
    }
    const onClearLevel = () => {
        dispatch(updateLevel(""))
        dispatch(updateSearch(""))
        dispatch(updatePage(1))
        dispatch(fetchSkills())
    }

    useEffect(() => {
        if (searchParams.get("category")) {
            dispatch(updateCategory(searchParams.get("category")))
            dispatch(fetchSkills())
        }
        if (skills.length === 0) {
            dispatch(fetchSkills())
        }
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
                                    className={`${styles.levelFilterBtn} ${level || inputValue ? "" : styles.dNone}`}
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
                            loading ?
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
                                className={`${styles.prevButton} ${page === 1 ? styles.buttonDisable : ""}`}
                                disabled={page === 1}
                                onClick={() => dispatch(updatePage(page - 1))}
                            >
                                Prev
                            </button>
                            <button
                                className={`${styles.nextButton} ${page === lastPage ? styles.buttonDisable : ""}`}
                                disabled={page === lastPage}
                                onClick={() => dispatch(updatePage(page + 1))}
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