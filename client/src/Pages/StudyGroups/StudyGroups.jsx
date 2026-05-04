import HomeHeader from "../../components/Header/HomeHeader"
import Footer from "../../components/Footer/Footer";
import styles from "./StudyGroups.module.css"
import { Calendar1, Search, Users } from "lucide-react";
import CreateGroupModal from "./Modals/CreateGroupModal";

const StudyGroups = () => {
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
                    <input type="text" placeholder="Search Study Groups..." />
                </div>
                <CreateGroupModal title="Create Groups" />
            </div>
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