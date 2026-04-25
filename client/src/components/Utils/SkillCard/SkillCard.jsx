import { Link } from "react-router-dom"
import styles from './SkillCard.module.css'
import { BsPersonCircle } from "react-icons/bs";

const SkillCard = ({ skillsData }) => {
    const {
        id,
        title,
        imageUrl,
        category,
        level,
        description,
        user
    } = skillsData;
    const { name, profileImage, userId, profile } = user
    let profile_image
    if (profile) {
        profile_image = profile.profile_image
    }

    return (
        <Link
            to={`/skill/${id}/${userId}`}
            className={styles.skillsCard}
        >
            <div className={styles.skillCardContainer}>
                <img
                    src={imageUrl}
                    alt={title}
                    className={styles.skillImage}
                />
                <div className={styles.categoryBadgeContainer}>
                    <div className={styles.categoryBadge}>{category}</div>
                </div>
                <div className={styles.skillLevelBadgeContainer}>
                    <div className={`${styles.levelBadge} ${styles[`level${level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}`]}`}>
                        {level}
                    </div>
                </div>
            </div>

            <div className={styles.skillDetailSection}>
                <h3 className={styles.skillTitle}>
                    {title}
                </h3>
                <p className={styles.skillDescription}>
                    {description}
                </p>
                <div className={styles.instructorInfo}>
                    {
                        profileImage || profile_image ? <img
                            src={profileImage || profile_image}
                            alt={name}
                            className={styles.instructorAvatar}
                        /> : <BsPersonCircle className={styles.profile} />
                    }
                    <span className={styles.instructorName}>
                        {name}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default SkillCard;