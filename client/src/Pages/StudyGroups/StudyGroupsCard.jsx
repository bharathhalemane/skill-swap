import { Calendar, Cookie, Link, Locate, Map, Users } from "lucide-react"
import styles from "./StudyGroupCard.module.css"
import Cookies from "js-cookie"

const StudyGroupsCard = ({ data }) => {
    const userId = Cookies.get("userId")
    const { title, description, mode, membersCount, maxMembers, date, time, joinLink, location, host } = data
    const { name, profile, _id } = host
    const modifiedDate = date.split("T")[0]
    return <>
        <div className={styles.groupCardContainer}>
            <h3 className={styles.title}>{title}</h3>
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

            {
                mode === "online" ? (

                    <a href={joinLink} target="_blank" className={styles.joinLink}><Link/>Meeting Link</a>
                ) : (
                    <p className={styles.location}><Map color="#555" /> {location}</p>
                )
            }
            <hr className={styles.hr} />
            <div className={styles.hostInfo}>
                <img src={profile.profile_image} alt="profile" className={styles.profileImage} />

                {
                    userId === _id ? <p className={styles.hostSame}>You're hosting</p>
                        :
                        <p className={styles.hostName}>{name}</p>
                }
            </div>
        </div>
    </>
}

export default StudyGroupsCard