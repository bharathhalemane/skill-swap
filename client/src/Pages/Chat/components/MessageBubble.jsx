import {Check, CheckCheck} from "lucide-react"
import styles from "./MessageBubble.module.css"

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
}

const MessageBubble = ({ message, isMine }) => {
    return (
        <div className={`${styles.row} ${isMine ? styles.mine : styles.theirs}`}>
            <div className={styles.bubble}>
                <span className={styles.text}>{message.text}</span>
                <span className={styles.meta}>
                    {formatTime(message.createdAt)}
                    {isMine && (
                        message.status === "read" ?
                            <CheckCheck size={14} className={styles.readTick} /> : <Check size={14} className={styles.sentTick} />
                    )}
                </span>
            </div>
        </div>
    )
}

export default MessageBubble