import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./OwnerAvailability.module.css"

const OwnerAvailabilitySkeletonSlots = ({ availabilityData }) => {
    return (
        <ul className={styles.availabilityEachDaySlotsList}>
            {
                availabilityData.map((each) => (
                    <ul className={styles.daySlotsList} key={each.id || each._id}>
                        {Array(3).fill(0).map((_, i) => (
                            <li className={styles.daySlots} key={i}>
                                <Skeleton width={80} height={12}/>
                            </li>
                        ))}
                    </ul>
                ))
            }
        </ul>
    )
}

export default OwnerAvailabilitySkeletonSlots