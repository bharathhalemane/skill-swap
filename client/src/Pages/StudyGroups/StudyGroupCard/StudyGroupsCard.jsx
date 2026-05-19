import { Bell, Calendar, Cookie, Link as MLink, Locate, Map, Users } from "lucide-react"
import styles from "./StudyGroupCard.module.css"
import Cookies from "js-cookie"
import { sendRequest, leaveGroup } from "../studyGroupsApi"
import { useState } from "react"
import { TailSpin } from "react-loader-spinner"
import { Link } from "react-router-dom"
import ManageModal from "../Modals/ManageModal"

const StudyGroupsCard = ({ data, dispatch }) => {
    const userId = Cookies.get("userId")
    const { title, description, mode, membersCount, maxMembers, date, time, joinLink, location, host, joinRequests, members } = data
    const { name, profile, _id } = host
    const [requestLoading, setRequestLoading] = useState(false)
    const modifiedDate = date.split("T")[0]

    const onHandleSendRequest = async (groupId) => {
        const response = await sendRequest(dispatch, groupId, setRequestLoading)
    }

    const onHandleLeaveGroup = async (groupId) => {
        const response = await leaveGroup(dispatch, groupId, setRequestLoading)
    }
    const requestsUser = joinRequests.map(
        request => request.user
    )
    console.log(requestsUser)

    const getTimeAgo = (date) => {
        const now = new Date()
        const seconds = Math.floor((now - new Date(date)) / 1000)
        if (seconds < 60) return `${seconds} sec ago`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes} min ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} hr ago`
        const days = Math.floor(hours / 24)
        if (days < 7) return `${days} days ago`
        const weeks = Math.floor(days / 7)
        if (weeks < 4) return `${weeks} weeks ago`
        const months = Math.floor(days / 30)
        if (months < 12) return `${months} months ago`
        const years = Math.floor(days / 365)
        return `${years} years ago`
    }

    return <>
        <div className={styles.groupCardContainer}>
            <Link to="/home" className={styles.linkContainer}>
                <div className={styles.titleCon}>
                    <h3 className={styles.title}>{title}</h3>
                    {
                        userId === _id && <>
                            <div className={styles.notificationContainer}>
                                <Bell size={28} />
                                {
                                    joinRequests.length > 0 && <span className={styles.badge}>{joinRequests.length}</span>
                                }
                            </div>
                        </>
                    }
                </div>
                <p className={styles.description}>{description}</p>
                <p className={`${styles.mode} ${mode === "online" ? styles.online : styles.offline}`}>
                    {mode}
                </p>

                <div className={styles.groupInfo}>
                    <Users color="#555" />
                    <span>{membersCount}/{maxMembers} members joined</span>
                </div>
                <div className={styles.timeInfo}>
                    <span><Calendar color="#555" /></span>
                    <span>{modifiedDate},</span>
                    <span>{time}</span>
                </div>

            </Link>
            {
                mode === "online" ? (

                    <a href={joinLink} target="_blank" className={styles.joinLink}
                        onClick={(e) => {
                            !members.includes(userId) && e.preventDefault()
                        }}
                    ><MLink />Meeting Link {!members.includes(userId) && "\"only after joining\""}</a>
                ) : (
                    <p className={styles.location}><Map color="#555" /> {location}</p>
                )
            }
            <hr className={styles.hr} />
            <div className={styles.controlGroupRequest}>
                <div className={styles.hostInfo}>
                    <img src={profile.profile_image} alt="profile" className={styles.profileImage} />

                    {
                        userId === _id ? <p className={styles.hostSame}>You're hosting</p>
                            :
                            <p className={styles.hostName}>{name}</p>
                    }
                </div>
                {

                    userId === _id ? <>
                        <ManageModal dispatch={dispatch} title={title} host={host} groupId={data._id} />
                    </> : <>
                        {
                            requestsUser.includes(userId) ? <>
                                <button className={styles.manageRequestButton} disabled>requested</button>
                            </> : <>
                                <button className={`${members.includes(userId) ? styles.leaveButton : styles.joinRequestButton}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        { members.includes(userId) ? onHandleLeaveGroup(data._id) : onHandleSendRequest(data._id) }
                                    }}
                                >
                                    {
                                        requestLoading ? <TailSpin width={20} height={20} color="#fff" /> :
                                            members.includes(userId) ? "Leave" : "Join"

                                    }
                                </button></>
                        }
                    </>
                }
            </div>

        </div>
    </>
}

export default StudyGroupsCard