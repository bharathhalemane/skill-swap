import HomeHeader from "../../components/Header/HomeHeader"
import Footer from "../../components/Footer/Footer";
import styles from "./StudyGroups.module.css"
import { Calendar1, Search, Users } from "lucide-react";
import CreateGroupModal from "./Modals/CreateGroupModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../redux/features/groups/groupsActions";
import { socket } from "../../Socket"
import StudyGroupsCard from "./StudyGroupCard/StudyGroupCard";
import StudyGroupCardSkeleton from "./StudyGroupCard/StudyGroupCardSkeleton";


const StudyGroups = () => {
    const dispatch = useDispatch()
    const { groups } = useSelector(state => state.groups)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    useEffect(() => {

        const getGroups = async () => {
            if (groups.length === 0) {
                setLoading(true)

                await dispatch(fetchGroups())

                setLoading(false)
            }
        }

        getGroups()

        const refreshGroups = () => {
            dispatch(fetchGroups())
        }

        socket.on("new_group_join_request", refreshGroups)
        socket.on("request_rejected", refreshGroups)
        socket.on("request_accepted", refreshGroups)
        socket.on("member_left_group", refreshGroups)

        return () => {
            socket.off("new_group_join_request", refreshGroups)
            socket.off("request_rejected", refreshGroups)
            socket.off("request_accepted", refreshGroups)
            socket.off("member_left_group", refreshGroups)
        }
    }, [dispatch, groups.length])

    const onChangeSearch = e => {
        setSearch(e.target.value)
    }

    const filteredGroups = groups.filter((group) =>
        group.title.toLowerCase().includes(search.toLowerCase()) || group.description.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            <HomeHeader />
            <div className={styles.dashboardSection}>
                <div className={styles.dashboardSectionCon}>
                    <Users size={15} />
                    <h1>Collaborative Learning</h1>
                </div>
                <h1>Study Groups</h1>
                <p>Find or create study sessions with classmates. Learn better together.</p>
            </div>
            <div className={styles.searchBarContainer}>
                <div className={styles.inputSection}>
                    <Search size={20} color="#7b7b7b" />
                    <input type="text" placeholder="Search Study Groups..." value={search} onChange={onChangeSearch} />
                </div>
                <CreateGroupModal title="Create Groups" />
            </div>
            <ul className={styles.groupsListContainer}>
                {loading ? <>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <li key={index}>
                            <StudyGroupCardSkeleton />
                        </li>
                    ))}
                </> : <>
                    {
                        filteredGroups.map(group => (
                            <li key={group._id}>
                                <StudyGroupsCard dispatch={dispatch} data={group} />
                            </li>
                        ))
                    }
                </>}

            </ul>
            <div className={styles.createSection}>
                <Calendar1 size={35} color="#ff7a59" />
                <h1>Can't Find What You Need?</h1>
                <p>Start your own study group and invite classmates to join. Set the topic, time, and location.</p>
                <CreateGroupModal title="Create a Study Groups" />
            </div>
            <Footer />
        </>
    )
}

export default StudyGroups