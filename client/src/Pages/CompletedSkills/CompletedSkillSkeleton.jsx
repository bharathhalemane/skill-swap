import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./CompletedSkills.module.css"; 

const CompletedSkillSkeleton = () => {
  return (
    <div className={styles.completedCard}>
      
      {/* Image */}
      <Skeleton
        height={100}
        className={styles.completedImg}
      />

      {/* Info */}
      <div className={styles.completedInfo}>
        <h3>
          <Skeleton width={100} />
        </h3>
        <p>
          <Skeleton width={60} />
        </p>
      </div>

    </div>
  );
};

export default CompletedSkillSkeleton;