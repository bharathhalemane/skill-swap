import { useState, useEffect } from "react"
import { LuGraduationCap, LuX, LuClock } from "react-icons/lu";
import axios from "axios"
import Cookies from "js-cookie"
import CommonModal from "../../Utils/CommonModal";
import { TailSpin } from "react-loader-spinner"
import { toast } from "react-toastify";
import styles from './ClassSchedule.module.css'
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, fetchSkillsTitles } from "../../../redux/features/scheduleAndAvailability/scheduleAndAvailabilityActions";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

const apiProgress = {
    success: "SUCCESS",
    loading: "LOADING"
}

const ClassSchedule = () => {
    const dispatch = useDispatch()
    const token = Cookies.get("jwtToken")
    const userId = Cookies.get("userId")
    const classSchedule = useSelector(state => state.scheduleAndAvailability.schedule)
    const { titles } = useSelector(state => state.scheduleAndAvailability)
    const [isOpen, setIsOpen] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [formData, setFormData] = useState({
        day: "",
        title: "",
        startTime: "",
        endTime: "",
        location: ""
    })

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    useEffect(() => {
        if (classSchedule.length === 0) {
            dispatch(fetchScheduleData())
        }
        if (titles.length === 0) {
            dispatch(fetchSkillsTitles())
        }
    }, [dispatch])

    const removeClassScheduleData = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/classes/delete/${id}`
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.warning("Removed your class schedule!")
            dispatch(fetchScheduleData())
        } catch (err) {
            toast.error("Unable to remove your class schedule.")
        }
    }

    const onSubmit = async e => {
        e.preventDefault()
        try {
            setApiStatus(apiProgress.loading)
            const url = `${import.meta.env.VITE_BACKEND_API}/classes/create`
            await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setApiStatus(apiProgress.success)
            setFormData({ day: "", title: "", startTime: "", endTime: "", location: "" })
            toast.success("Scheduled Successfully!")
            setIsOpen(false)
            dispatch(fetchScheduleData())
        } catch (err) {
            toast.error("Unable to scheduled your class!")
            setIsOpen(false)
        }
    }

    const createModal = () => (
        <CommonModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Add a Class"
            width="550px"
        >
            <form className={styles.modernForm} onSubmit={onSubmit}>
                <div className={styles.formGroup}>
                    <label>Class Name</label>
                    <select name="title" value={formData.title} onChange={handleChange} required>
                        <option value="" disabled>Select Title</option>
                        {titles.map(title => (
                            <option key={title} value={title}>{title}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Day</label>
                    <select name="day" value={formData.day} onChange={handleChange} required>
                        <option value="" disabled>Select day</option>
                        {DAYS.map(day => (
                            <option key={day} value={day.slice(0, 3)}>{day}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Start Time</label>
                        <select name="startTime" value={formData.startTime} onChange={handleChange} required>
                            <option value="" disabled>Start</option>
                            {TIMES.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>End Time</label>
                        <select name="endTime" value={formData.endTime} onChange={handleChange} required>
                            <option value="" disabled>End</option>
                            {TIMES.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Location (Optional)</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Library"
                    />
                </div>

                <div className={styles.modalButtons}>
                    <button type="button" className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveBtn}>
                        {apiStatus === apiProgress.loading
                            ? <TailSpin width={20} height={20} color="#fff" />
                            : "Create"
                        }
                    </button>
                </div>
            </form>
        </CommonModal>
    )

    const groupedByDay = DAYS.reduce((acc, day) => {
        acc[day] = classSchedule.filter((c) => c.day === day.slice(0, 3))
        return acc
    }, {})

    return (
        <div className={styles.classScheduleSection}>
            <div className={styles.sectionHeaderContainer}>
                <div className={styles.classScheduleHeading}>
                    <h1><LuGraduationCap size={25} color="#e76f51" /> My Class Schedule</h1>
                    <p>Set your class times to automatically block unavailable hours</p>
                </div>
                <button className={styles.classAddButton} onClick={() => setIsOpen(true)}>
                    + Add Class
                </button>
            </div>

            {createModal()}

            <div className={styles.classesScheduleTable}>
                {DAYS.map((day) => (
                    <div key={day} className={styles.daySchedule}>
                        <h4>{day.slice(0, 3)}</h4>
                        {groupedByDay[day].length > 0 ? (
                            groupedByDay[day].slice(0, 3).map((cls) => (
                                <div key={cls.id} className={styles.classDetails}>
                                    <button
                                        onClick={() => removeClassScheduleData(cls._id)}
                                        className={styles.editBtn}
                                    >
                                        <LuX />
                                    </button>
                                    <p>{cls.title}</p>
                                    <p>
                                        <LuClock />
                                        {cls.startTime} - {cls.endTime}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div key={day} className={styles.noClassSchedule} onClick={() => setIsOpen(true)}>
                                <span>No classes</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ClassSchedule