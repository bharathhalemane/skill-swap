import styles from "./TypingIndicator.module.css"

const TypingIndicator = () => {
    return (
        <div className={styles.row}>
            <div className={styles.bubble}>
                <span className={styles.dot}/>
                <span className={styles.dot}/>
                <span className={styles.dot}/>
            </div>
        </div>
    )
}

export default TypingIndicator