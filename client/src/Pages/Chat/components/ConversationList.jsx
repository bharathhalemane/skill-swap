import Cookies from "js-cookie"
import { BsPersonCircle } from "react-icons/bs"
import styles from "./ConversationList.module.css"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import socket from '../../../Socket'


const timeAgo = (date) => {
    if (!date) return ""
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return "now"

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`

    const days = Math.floor(hours / 24)
    return `${days}d`
}

const ConversationList = ({ conversations, loading, activeId, onSelect }) => {
    const myId = Cookies.get("userId")
    const dispatch = useDispatch()


    if (loading && conversations.length === 0) {
        return <div className={styles.state}>Loading conversations...</div>
    }

    if (conversations.length === 0) {
        return (
            <div className={styles.state}>
                No conversations yet. Once a request is accepted, you can message each other here.
            </div>
        )
    }

    return (
        <ul className={styles.list}>
            {conversations.map((conv) => {
                const otherUser = conv.participants?.find(p => p._id !== myId)
                const skillTitle = conv.requestId?.skill?.title

                return (
                    <li className={`${styles.item} ${activeId === conv._id ? styles.active : ""}`} key={conv._id} onClick={() => onSelect(conv._id)}>
                        {otherUser?.profile?.profile_image ? <img src={otherUser.profile.profile_image} alt="" className={styles.avatar} /> : <BsPersonCircle className={styles.avatarFallback} />}
                        <div className={styles.info}>
                            <div className={styles.topRow}>
                                <span className={styles.name}>{otherUser?.name}</span>
                                <span className={styles.time}>{timeAgo(conv.lastMessageAt)}</span>
                            </div>
                            <div className={styles.bottomRow}>
                                <span className={styles.preview}>
                                    {conv.lastMessage || `Say hi to ${otherUser?.name.split(" ")[0]}`}
                                </span>
                                {conv.unreadCount > 0 && (
                                    <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                                )}
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )

}

export default ConversationList