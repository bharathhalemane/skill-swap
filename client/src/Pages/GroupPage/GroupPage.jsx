import HomeHeader from "../../components/Header/HomeHeader"
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css"
import { BiLeftArrow } from "react-icons/bi";
import { ArrowLeft, Bell, BookOpen, Share2, Clock, Users } from "lucide-react";
import { useState } from "react";

const GroupPage = () => {
    const { groupId } = useParams()
    const [state, setState] = useState(true)
    const [points, setPointes] = useState([
        "Review of core concepts and key formulas",
        "Walkthrough of practice problems together",
        "Open Q&A and exam prep tips",
        "Group challenge to test what you've learned"
    ])
    const [members, setMembers] = useState([
        { name: 'Jordan Lee', host: true },
        { name: 'Jordan Lee', host: false },
        { name: 'Jordan Lee', host: false },
        { name: 'Jordan Lee', host: false }
    ])
    return <>
        <HomeHeader />
        <div className={styles.headContainer}>
            <a href="/study-groups" className={styles.previousLink}><ArrowLeft /> Back to Study Groups</a>
            <div className={styles.infoContainer}>
                <div className={styles.hostInfoContainer}>
                    {
                        state &&
                        <div className={styles.hostingBadge}>
                            <p>You're Hosting</p>
                        </div>
                    }
                    <h1 className={styles.groupTitle}>ECON 101 Final Prep
                    </h1>
                    <div className={styles.hostInfo}>
                        <img src="" alt="profile" className={styles.hostProfileImage} />
                        <h1 className={styles.hostName}><span>Hosted By</span><br /> Jordan Lee</h1>
                    </div>
                </div>
                <div className={styles.controlContainer}>
                    <button className={styles.button}><Share2 /> Share</button>
                    {state && <button className={styles.button}><Bell color="#ff7a00" /> Requests <span>2</span></button>}
                </div>
            </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.groupInfoContainer}>
            <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                    <h1><BookOpen color="#ff7a00" /> About this group</h1>
                    <p>Join us for a focused economics study session. We'll work through practice problems, review key concepts, and help each other prepare. Bring your notes, questions, and a willingness to collaborate. All levels welcome.</p>
                </div>
                <div className={styles.infoCard}>
                    <h1><Clock color="#ff7a00" /> What we'll cover</h1>
                    <ul>
                        {
                            points.map((each,index) => (
                                <li key={index}>{each}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className={styles.infoCard}>
                    <h1><Users color="#ff7a00" /> Members(4/8)</h1>
                    <ul className={styles.members}>
                        {
                            members.map((each,index) => (
                                <li key={index} className={styles.membersCard}>
                                    <img src="" alt="" className={styles.profileImage} />
                                    <div>
                                        <h1>
                                            {each.name}
                                        </h1>
                                        <p>{each.host ? "host" : "member"}</p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
        <Footer />
    </>
}

export default GroupPage