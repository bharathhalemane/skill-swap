import { LuCalendar, LuClock } from "react-icons/lu";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"
import axios from "axios";
import AvailabilityEditorModal from "../Modals/AvailabilityEditorModal";
import styles from './Availability.module.css'

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Availability = () => {
    const token = Cookies.get("jwtToken")
    const [availabilityData, setAvailabilityData] = useState([])

    const getAvailabilityData = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/availability/my`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const sorted = response.data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
            setAvailabilityData(sorted)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAvailabilityData()
    }, [])

    return (
        <div className={styles.availabilityEditorSection}>
            <div className={styles.headerSection}>
                <h1><LuCalendar color="#ff7a00" /> My Availability</h1>
                <AvailabilityEditorModal data={availabilityData} setData={setAvailabilityData} />
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