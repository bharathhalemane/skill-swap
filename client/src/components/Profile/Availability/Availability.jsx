import { LuCalendar, LuClock } from "react-icons/lu";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"
import axios from "axios";
import AvailabilityEditorModal from "../Modals/AvailabilityEditorModal";
import styles from './Availability.module.css'
import { useDispatch, useSelector } from "react-redux";
import { fetchAvailabilityData } from "../../../redux/features/scheduleAndAvailability/scheduleAndAvailabilityActions";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Availability = () => {
    const dispatch = useDispatch()
    const token = Cookies.get("jwtToken")
    const availabilityData = useSelector(state => state.scheduleAndAvailability.availability)

    useEffect(() => {
        if (availabilityData.length === 0) {
            dispatch(fetchAvailabilityData())
        }
    }, [dispatch])

    return (
        <div className={styles.availabilityEditorSection}>
            <div className={styles.headerSection}>
                <h1><LuCalendar color="#ff7a00" /> My Availability</h1>
                <AvailabilityEditorModal data={availabilityData} />
            </div>

            <div className={styles.availabilitySlots}>
                <ul className={styles.availabilitySlotsDayList}>
                    {availabilityData.map(each => (
                        <li key={each.id || each._id} className={styles.dayAvailabilitySlots}>
                            <h1>{each.day}</h1>
                        </li>
                    ))}
                </ul>

                {availabilityData.length > 0 ? (
                    <ul className={styles.availabilityEachDaySlotslist}>
                        {availabilityData.map(each => (
                            <ul className={styles.daySlotsList} key={each.id || each._id}>
                                {each.slots.map(slot => (
                                    <div className={styles.daySlots} key={slot.id || slot._id}>
                                        <LuClock size={13} /> {slot.startTime}
                                    </div>
                                ))}
                            </ul>
                        ))}
                    </ul>
                ) : (
                    <div className={styles.noSlotsContainer}>
                        <h1>No availability set. Click Edit to add your available time slots.</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Availability