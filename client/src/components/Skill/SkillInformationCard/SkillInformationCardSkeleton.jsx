import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./SkillInformationCard.module.css";

const SkillInformationCardSkeleton = () => {
  return (
    <div className={styles.skillsInformation}>
      
      {/* LEFT SECTION */}
      <div className={styles.skillLeft}>
        
        {/* Tags */}
        <div className={styles.tags}>
          <Skeleton width={80} height={25} borderRadius={20} />
          <Skeleton width={60} height={25} borderRadius={20} />
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          <Skeleton width="70%" height={30} />
        </h1>

        {/* Description */}
        <p className={styles.description}>
          <Skeleton count={3} />
        </p>

        {/* User Info */}
        <div className={styles.skillUserInfo}>
          <Skeleton circle width={50} height={50} />
          
          <div className={styles.userInformation}>
            <h4>
              <Skeleton width={120} />
            </h4>

            <div className={styles.contactInformation}>
              <div>
                <Skeleton width={180} />
              </div>
              <div>
                <Skeleton width={120} />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.actions}>
          <Skeleton width={140} height={40} borderRadius={8} />
          <Skeleton width={160} height={40} borderRadius={8} />
        </div>
      </div>

      {/* RIGHT SECTION (IMAGE) */}
      <div className={styles.skillRight}>
        <Skeleton height={250} width={350} borderRadius={12} />
      </div>

    </div>
  );
};

export default SkillInformationCardSkeleton;