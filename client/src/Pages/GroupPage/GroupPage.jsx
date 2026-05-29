import HomeHeader from "../../components/Header/HomeHeader"
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import styles from "./GroupPage.module.css"
import { BiLeftArrow } from "react-icons/bi";
import { ArrowLeft, Bell, BookOpen, Share2, Clock, Users, Mail, Phone, SquarePen, Calendar, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { getGroupData } from "./GroupPageApi";
import Cookies from "js-cookie";
import AboutGroup from "./AboutGroup/AboutGroup";
import CoverPoints from "./CoverPoints/CoverPoints";
import { useDispatch } from "react-redux";
import ManageModal from "./modal/ManageModal.jsx";
import { socket } from "../../Socket"
import { sendRequest, leaveGroup } from "../StudyGroups/studyGroupsApi.js";
import { TailSpin } from "react-loader-spinner";
import GroupPageSkeleton from "./GroupPageSkeleton.jsx";

const GroupPage = () => {
    const dispatch = useDispatch()
    const { groupId } = useParams()
    const userId = Cookies.get("userId")
    const [openModal, setOpenModal] = useState(true)
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(false)
    const [groupData, setGroupData] = useState({
        host: {
            email: "",
            phoneNumber: "",
            profile: {
                profile_image: "img.png",
            },
            _id: ""
        },
        joinRequests: [],
        members: [],
        title: "",
        maxMembers: 0,
        location: "",
        time: "",
        mode: "",
        joinLink: "",
        date: ""
    })

    const getGroupInfo = async () => {
        const response = await getGroupData(groupId)
        setGroupData(response)
        setLoading(false)
    }

    useEffect(() => {
        getGroupInfo()
        socket.on("render_new_member", () => {
            getGroupInfo()
        })
        socket.on("member_left_group", () => {
            getGroupInfo()
        })
        return () => {
            socket.off("render_new_member")
            socket.off("member_left_group")
        }
    }, [])

    const handleShare = async () => {
        const shareData = {
            title: groupData.title,
            text: groupData.description,
            url: `${window.location.origin}/study-group/${groupData._id}`
        }
        try {
            await navigator.share(shareData)
        } catch (err) {
            console.log(err)
        }
    }
    const onHandleSendRequest = async (groupId) => {
        const response = await sendRequest(dispatch, groupId, setRequestLoading)
    }

    const onHandleLeaveGroup = async (groupId) => {
        const response = await leaveGroup(dispatch, groupId, setRequestLoading)
    }

    const { host, joinRequests, members, membersCount, title, maxMembers, location, time, mode, joinLink, date } = groupData
    const { email: hostEmail, name: hostName, phoneNumber: hostPhoneNumber, profile: hostProfile, _id: hostId } = host
    const requestsUser = joinRequests.map(
        request => request.user
    )
    return <>
        <HomeHeader />
        {
            loading ? <GroupPageSkeleton /> : <>

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
                            <button className={styles.button} onClick={handleShare}><Share2 size={20} /> Share</button>
                            {hostId === userId ? <ManageModal dispatch={dispatch} title={groupData.title} host={groupData.host} groupId={groupData._id} /> : <>
                                {
                                    requestsUser.includes(userId) ? <>
                                        <button className={styles.manageRequestButton} disabled>requested</button>
                                    </> : <>
                                        <button className={`${members.some(member => member.user === userId) ? styles.leaveButton : styles.joinRequestButton}`}
                                            onClick={() => {
                                                { members.some(member => member.user === userId) ? onHandleLeaveGroup(groupData._id) : onHandleSendRequest(groupData._id) }
                                            }}
                                        >
                                            {
                                                requestLoading ? <TailSpin width={20} height={20} color="#fff" /> :
                                                    members.some(member => member.user === userId) ? "Leave" : "Join"

                                            }
                                        </button></>
                                }
                            </>}
                        </div>
                    </div>
                </div>
                <hr className={styles.hr} />
                <div className={styles.groupInfoContainer}>
                    <div className={styles.infoCards}>
                        <AboutGroup data={groupData} groupId={groupId} />
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
                                                <p>{host._id === each.user._id ? "host" : "member"}</p>
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
                    <div className={`${styles.infoCard} ${styles.sessionCard}`}>
                        <h1>Session Details</h1>
                        <div className={styles.detailsContainer}>
                            <Calendar className={styles.icon} />
                            <div>
                                <p>When</p>
                                <h1>
                                    <h1>
                                        {new Date(`${date.split("T")[0]}T${time.split(" ")[0]}`).toLocaleString("en-US", {
                                            weekday: "short",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </h1>
                                </h1>
                            </div>
                        </div>
                        <div className={styles.detailsContainer}>
                            <MapPin className={styles.icon} />
                            <div>
                                <p>Where</p>
                                {
                                    mode === "online" ? <><a href={joinLink} target="_blank">Online Link</a></> : <><h1>{location}</h1></>
                                }
                            </div>
                        </div>
                        <div className={styles.detailsContainer}>
                            <Users className={styles.icon} />
                            <div>
                                <p>Spots</p>
                                <h1>{maxMembers - members.length} left</h1>
                            </div>
                        </div>
                        {

                        }
                    </div>

                </div>
            </>}
        <Footer />
    </>
}

export default GroupPage