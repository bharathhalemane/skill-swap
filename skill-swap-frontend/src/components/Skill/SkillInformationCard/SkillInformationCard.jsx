import RequestModel from "../Modals/RequestModel"
import RequestWithSwap from "../Modals/RequestWithSwap"
import styles from './SkillInformationCard.module.css'

const SkillInformationCard = ({ data }) => {
    const { _id, category, level, title, imageUrl, description, user } = data
    const { name,email, profile, userId } = user || {}
    const { profile_image } = profile || {}

    return (
        <div className={styles.skillsInformation}>
            <div className={styles.skillLeft}>
                <div className={styles.tags}>
                    <span className={styles.category}>{category}</span>
                    <span className={styles.level}>{level}</span>
                </div>

                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>

                <div className={styles.skillUserInfo}>
                    <img src={profile_image} alt="user" />
                    <div className={styles.userInformation}>
                        <h4>{name}</h4>
                        <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                            {email}
                        </a>
                    </div>
                </div>

                <div className={styles.actions}>
                    <RequestModel skillId={_id} />
                    <RequestWithSwap skillId={_id} />
                </div>
            </div>

            <div className={styles.skillRight}>
                <img src={imageUrl} alt="skill" />
            </div>
        </div>
    )
}

export default SkillInformationCard