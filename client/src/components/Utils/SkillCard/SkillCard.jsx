import { Link } from "react-router-dom"
import styles from './SkillCard.module.css'
import { BsPersonCircle } from "react-icons/bs";
import {Star} from "lucide-react"

const SkillCard = ({ skillsData, creationPage }) => {
    const {
        id,
        title,
        imageUrl,
        category,
        level,
        description,
        user,
        rating
    } = skillsData;
    const { name, profileImage, userId, profile } = user
    let profile_image
    if (profile) {
        profile_image = profile.profile_image
    }
    const avgRating = rating?.avgRating || 0 
    const reviewCount = rating?.reviewCount || 0

    return (
        <Link
            to={`/skill/${id|| skillsData._id}/${userId|| user}`}
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
                {
                    reviewCount > 0 && (
                        <div className={styles.ratingRow}>
                            <Star size={14} className={styles.ratingStar} />
                            <span className={styles.ratingValue}>{avgRating}</span>
                            <span className={styles.ratingCount}>{reviewCount}</span>
                        </div>
                    )
                }
                <div className={styles.instructorInfo}>
                    {
                        profileImage || profile_image ? <img
                            src={profileImage || profile_image}
                            alt={name}
                            className={styles.instructorAvatar}
                        /> : !creationPage && <BsPersonCircle className={styles.profile} />
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