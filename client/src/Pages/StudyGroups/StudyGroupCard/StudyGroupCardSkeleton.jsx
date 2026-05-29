import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./StudyGroupCard.module.css"

const StudyGroupCardSkeleton = () => {
    return (
        <div className={styles.groupCardContainer}>
            <div className={styles.linkContainer}>

                {/* Title */}
                <div className={styles.titleCon}>
                    <Skeleton width={180} height={28} />
                    <Skeleton circle width={28} height={28} />
                </div>

                {/* Description */}
                <p className={styles.description}>
                    <Skeleton count={2} />
                </p>

                {/* Mode */}
                <p className={styles.mode}>
                    <Skeleton width={80} height={24} borderRadius={20} />
                </p>

                {/* Members */}
                <div className={styles.groupInfo}>
                    <Skeleton circle width={20} height={20} />
                    <Skeleton width={160} height={18} />
                </div>

                {/* Time */}
                <div className={styles.timeInfo}>
                    <Skeleton circle width={18} height={18} />
                    <Skeleton width={120} height={18} />
                </div>
            </div>

            {/* Meeting link / location */}
            <div style={{ marginTop: "10px" }}>
                <Skeleton width={220} height={20} />
            </div>

            <hr className={styles.hr} />

            {/* Bottom section */}
            <div className={styles.controlGroupRequest}>

                {/* Host info */}
                <div className={styles.hostInfo}>
                    <Skeleton circle width={45} height={45} />
                    <Skeleton width={120} height={18} />
                </div>

                {/* Button */}
                <Skeleton
                    width={100}
                    height={40}
                    borderRadius={8}
                />
            </div>
        </div>
    )
}

export default StudyGroupCardSkeleton