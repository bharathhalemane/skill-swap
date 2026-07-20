import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, UserPlus, CheckCircle2, XCircle, Ban, Star, GraduationCap } from "lucide-react"
import styles from "./NotificationsPanel.module.css"
import { fetchNotifications, markAllNotificationsRead } from "../../redux/features/notifications/notificationsActions";

const ICONS = {
    REQUEST_RECEIVED: UserPlus, 
    REQUEST_ACCEPTED: CheckCircle2, 
    REQUEST_REJECTED: XCircle, 
    REQUEST_CANCELLED: Ban,
    SESSION_COMPLETED: GraduationCap
}

const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
}

const NotificationsPanel = () => {
    const dispatch = useDispatch() 
    const { list, loading } = useSelector(state => state.notifications)
    
    useEffect(() => {
        dispatch(fetchNotifications())
    },[dispatch])

    useEffect(() => {
        dispatch(markAllNotificationsRead())
    },[])

    if (!loading && list.length === 0) return null 
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Bell size={20} />
                <h2>Notifications</h2>
            </div>

            {loading && list.length === 0 ? (
                <p className={styles.empty}>Loading...</p>
            ) : (
                    <div className={styles.list}>
                        {list.map((n) => {
                            const Icon = ICONS[n.type] || Bell 

                            return (
                                <div className={`${styles.item} ${!n.read ? styles.unread : ""}`} key={n._id}>
                                    <div className={styles.iconWrap}>
                                        <Icon size={18}/>
                                    </div>
                                    <div className={styles.content}>
                                        <p className={styles.message}>{n.message}</p>
                                        <span className={styles.time}>{getTimeAgo(n.createdAt)}</span>
                                    </div>
                                    {!n.read && <span className={styles.dot}/>}
                                </div>
                            )
                        })}
                    </div>
            )}
        </div>
    )
}

export default NotificationsPanel