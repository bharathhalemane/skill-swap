import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./SkillCard.module.css";

const SkillCardSkeleton = () => {
  return (
    <div className={styles.skillsCard}>
      
      {/* Image Section */}
      <div className={styles.skillCardContainer}>
        <Skeleton height={180} borderRadius={10} />

        {/* Category Badge */}
        <div className={styles.categoryBadgeContainer}>
          <Skeleton width={80} height={20} borderRadius={20} />
        </div>

        {/* Level Badge */}
        <div className={styles.skillLevelBadgeContainer}>
          <Skeleton width={60} height={20} borderRadius={20} />
        </div>
      </div>

      {/* Details Section */}
      <div className={styles.skillDetailSection}>
        
        {/* Title */}
        <h3 className={styles.skillTitle}>
          <Skeleton width="80%" />
        </h3>

        {/* Description */}
        <p className={styles.skillDescription}>
          <Skeleton count={2} />
        </p>

        {/* Instructor */}
        <div className={styles.instructorInfo}>
          <Skeleton circle width={35} height={35} />
          <span className={styles.instructorName}>
            <Skeleton width={100} />
          </span>
        </div>

      </div>
    </div>
  );
};

export default SkillCardSkeleton;