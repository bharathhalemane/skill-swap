import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./GroupPage.module.css"

const GroupPageSkeleton = () => {
    return (
        <>
            {/* Header */}
            <div className={styles.headContainer}>

                <Skeleton width={180} height={20} />

                <div className={styles.infoContainer}>

                    <div className={styles.hostInfoContainer}>

                        <Skeleton
                            width={120}
                            height={28}
                            borderRadius={20}
                        />

                        <Skeleton
                            width={320}
                            height={40}
                            style={{ marginTop: "15px" }}
                        />

                        <div className={styles.hostInfo}>
                            <Skeleton circle width={60} height={60} />

                            <div>
                                <Skeleton width={120} height={15} />
                                <Skeleton
                                    width={180}
                                    height={24}
                                    style={{ marginTop: "8px" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.controlContainer}>
                        <Skeleton
                            width={120}
                            height={45}
                            borderRadius={10}
                        />

                        <Skeleton
                            width={120}
                            height={45}
                            borderRadius={10}
                        />
                    </div>
                </div>
            </div>

            <hr className={styles.hr} />

            {/* Main Content */}
            <div className={styles.groupInfoContainer}>

                {/* Left Side */}
                <div className={styles.infoCards}>

                    {/* About Card */}
                    <div className={styles.infoCard}>
                        <Skeleton width={180} height={30} />

                        <Skeleton
                            count={4}
                            style={{ marginTop: "12px" }}
                        />
                    </div>

                    {/* Cover Points */}
                    <div className={styles.infoCard}>
                        <Skeleton width={200} height={30} />

                        <div style={{ marginTop: "15px" }}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginBottom: "14px",
                                        alignItems: "center",
                                    }}
                                >
                                    <Skeleton
                                        circle
                                        width={18}
                                        height={18}
                                    />

                                    <Skeleton
                                        width="80%"
                                        height={18}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Members */}
                    <div className={styles.infoCard}>

                        <Skeleton width={220} height={30} />

                        <ul className={styles.members}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <li
                                    key={index}
                                    className={styles.membersCard}
                                >
                                    <Skeleton
                                        circle
                                        width={55}
                                        height={55}
                                    />

                                    <div style={{ width: "100%" }}>
                                        <Skeleton
                                            width={140}
                                            height={20}
                                        />

                                        <Skeleton
                                            width={80}
                                            height={15}
                                            style={{ marginTop: "8px" }}
                                        />

                                        <Skeleton
                                            width="90%"
                                            height={15}
                                            style={{ marginTop: "10px" }}
                                        />

                                        <Skeleton
                                            width="70%"
                                            height={15}
                                            style={{ marginTop: "8px" }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Session Details */}
                <div className={`${styles.infoCard} ${styles.sessionCard}`}>

                    <Skeleton width={200} height={30} />

                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className={styles.detailsContainer}
                        >
                            <Skeleton
                                circle
                                width={25}
                                height={25}
                            />

                            <div style={{ width: "100%" }}>
                                <Skeleton
                                    width={80}
                                    height={14}
                                />

                                <Skeleton
                                    width="70%"
                                    height={22}
                                    style={{ marginTop: "8px" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default GroupPageSkeleton