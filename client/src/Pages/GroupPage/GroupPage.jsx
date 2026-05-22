import HomeHeader from "../../components/Header/HomeHeader"
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css"
import { BiLeftArrow } from "react-icons/bi";
import { ArrowLeft, Bell, BookOpen, Share2, Clock, Users, Mail, Phone, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { getGroupData } from "./GroupPageApi";
import Cookies from "js-cookie";
import AboutGroup from "./AboutGroup/AboutGroup";
import CoverPoints from "./CoverPoints/CoverPoints";

const GroupPage = () => {
    const { groupId } = useParams()
    const userId = Cookies.get("userId")
    const [state, setState] = useState(true)
    const [groupData, setGroupData] = useState({
        host: {
            email: "",
            phoneNumber: "",
            profile: {
                profile_image: "",
            },
            _id: ""
        },
        joinRequests: [],
        members: [],
        title: "",
        maxMembers: 0,
        location: "",
        time: "",
        mode: ""
    })
    const [points, setPointes] = useState([
        "Review of core concepts and key formulas",
        "Walkthrough of practice problems together",
        "Open Q&A and exam prep tips",
        "Group challenge to test what you've learned"
    ])

    const getGroupInfo = async () => {
        const response = await getGroupData(groupId)
        setGroupData(response)
    }

    useEffect(() => {
        getGroupInfo()
    }, [])

    const { host, joinRequests, members, membersCount, title, maxMembers, location, time, mode } = groupData
    const { email: hostEmail, name: hostName, phoneNumber: hostPhoneNumber, profile: hostProfile, _id: hostId } = host


    return <>
        <HomeHeader />
        <div className={styles.headContainer}>
            <a href="/study-groups" className={styles.previousLink}><ArrowLeft /> Back to Study Groups</a>
            <div className={styles.infoContainer}>
                <div className={styles.hostInfoContainer}>
                    {
                        userId === host._id &&
                        <div className={styles.hostingBadge}>
                            <p>You're Hosting</p>
                        </div>
                    }
                    <h1 className={styles.groupTitle}>{title}
                    </h1>
                    <div className={styles.hostInfo}>
                        <img src={hostProfile.profile_image} alt="profile" className={styles.hostProfileImage} />
                        <h1 className={styles.hostName}><span>Hosted By</span><br /> {hostName}</h1>
                    </div>
                </div>
                <div className={styles.controlContainer}>
                    <button className={styles.button}><Share2 /> Share</button>
                    {state && <button className={styles.button}><Bell color="#ff7a00" /> Requests</button>}
                </div>
            </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.groupInfoContainer}>
            <div className={styles.infoCards}>                
                <AboutGroup data={groupData} groupId={groupId}/>
                <CoverPoints data={groupData} groupId={groupId} />
                <div className={styles.infoCard}>
                    <h1><Users color="#ff7a00" /> Members({membersCount}/{maxMembers})</h1>
                    <ul className={styles.members}>
                        {
                            members.map((each) => (
                                <li key={each._id} className={styles.membersCard}>
                                    <img src={each.user.profile.profile_image} alt="" className={styles.profileImage} />
                                    <div>
                                        <h1>
                                            {each.user.name}
                                        </h1>
                                        <p>{userId === each.user._id ? "host" : "member"}</p>
                                        <div className={styles.emailAndPhone}>
                                            <a href={`mailto:${each.user.email}`} target="_blank" rel="noopener noreferrer"><Mail size={13} /> {each.user.email}</a>
                                            <a href={`tel:${each.user.phoneNumber}`}><Phone size={13} />{each.user.phoneNumber}</a>
                                        </div>
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