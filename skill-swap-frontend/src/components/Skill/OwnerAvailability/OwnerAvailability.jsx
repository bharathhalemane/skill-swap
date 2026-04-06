import { LuCalendar, LuClock } from "react-icons/lu";
import styles from "./OwnerAvailability.module.css"
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const OwnerAvailability = ({availabilityData}) => {
    const sortedAvailability=availabilityData.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));     
    return <div className={styles.availabilityEditorSection}>
        <div className={styles.headerSection}>            
            <h1><LuCalendar color="#ff7a00"/>Availability</h1>                
        </div>
        <div className={styles.availabilitySlots}>
            <ul className={styles.availabilitySlotsDayList}>
                {
                    sortedAvailability.map(each => (
                        <li key={each.id || each._id} className={styles.dayAvailabilitySlots}>
                            <h1>{each.day}</h1>                        
                        </li>
                    ))
                }
            </ul>
            {
                availabilityData.length > 0 ? <ul className={styles.availabilityEachDaySlotsList}>
                {
                    sortedAvailability.map(each => (
                        <ul className={styles.daySlotsList}>
                            {
                                each.slots.map(slot => (
                                    <div className={styles.daySlots} key={slot.id || slot._id}>
                                        <LuClock size={13} />  {slot.startTime}
                                    </div>
                                ))
                            }
                        </ul>
                    ))
                }
            </ul> : <div className={styles.noSlotsContainer}>
                <h1>No availability slots are available.</h1>
            </div>
            }
        </div>
    </div>

}

export default OwnerAvailability