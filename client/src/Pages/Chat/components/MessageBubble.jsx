import {Check, CheckCheck} from "lucide-react"
import styles from "./MessageBubble.module.css"

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
}

const MessageBubble = ({ message, isMine }) => {
    return (
        <div className={`${styles.row} ${isMine ? styles.mine : styles.theirs}`}>
            message.text
        </div>
    )
}

export default MessageBubble