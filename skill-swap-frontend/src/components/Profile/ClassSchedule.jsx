import { useState, useEffect } from "react"
import { LuGraduationCap, LuX, LuClock } from "react-icons/lu";
import './CssClasses.css'
import axios from "axios"
import Cookies from "js-cookie"
import CommonModal from "../Utils/CommonModal";
import {TailSpin} from "react-loader-spinner"
import { TfiLayoutLineSolid } from "react-icons/tfi";

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
    const token = Cookies.get("jwtToken")
    const userId = Cookies.get("userId")
    const [classSchedule, setClassSchedule] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [titles, setTitles] = useState([])
    const [formData, setFormData] = useState({
        day: "",
        title: "",
        startTime: "",
        endTime: "",
        location: ""
    })

    const handleChange= e => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const getClassScheduleData = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/classes`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setClassSchedule(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getUserSkillTitle = async () => {
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/user/${userId}`
            const response = await axios.get(url, {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })
            const skills = response.data.skills
            const titles = skills.map(skill => skill.title)
            setTitles(titles)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getClassScheduleData()
        getUserSkillTitle()
    }, [])

    const removeClassScheduleData = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/classes/delete/${id}`
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getClassScheduleData()
        } catch (err) {
            console.log(err)
        }
    }

    const onSubmit = async e => {
        e.preventDefault()
        try {
            setApiStatus(apiProgress.loading)
            const url = `${import.meta.env.VITE_BACKEND_API}/classes/create`
            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })            
            setApiStatus(apiProgress.success)
            setFormData({
                day: "",
                title: "",
                startTime: "",
                endTime: "",
                location: ""
            })
            setIsOpen(false)
            getClassScheduleData()
        } catch (err) {
            console.log(err)
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
            <form action="" className="modern-form" onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="">Class Name</label>                   
                    <select name="title" id="" value={formData.title} onChange={handleChange} required>
                        <option value="" disabled>Select Title</option>
                        {
                            titles.map(title => (
                                <option value={title}>{title}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="">Day</label>
                    <select name="day" id="" value={formData.day} onChange={handleChange} required>
                        <option value="" disabled>Select day</option>
                        {
                            DAYS.map(day => (
                                <option value={day.slice(0, 3)}>{day}</option>
                            ))
                        }
                    </select>
                </div>

                <div className="row">
                    <div className="form-group">
                        <label htmlFor="">Start Time</label>
                        <select name="startTime" id="" value={formData.startTime} onChange={handleChange} required>
                            <option value="" disabled>Start</option>
                            {
                                TIMES.map(time => (
                                    <option value={time}>{time}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">End Time</label>
                        <select name="endTime" id="" value={formData.endTime} onChange={handleChange} required>
                            <option value="" disabled>End</option>
                            {
                                TIMES.map(time => (
                                    <option value={time}>{time}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Location (Optional)</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Library" />
                </div>
                <div className="modal-buttons">
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() => setIsOpen(false)}
                            >
                              Cancel
                            </button>
                
                            <button type="submit" className="save-btn">
                              {apiStatus === apiProgress.loading ? (
                                <TailSpin width={20} height={20} color="#fff" />
                              ) : (
                                "Create"
                              )}
                            </button>
                          </div>
            </form>
        </CommonModal>
    )


    const groupedByDay = DAYS.reduce((acc, day) => {
        acc[day] = classSchedule.filter((c) => c.day === day.slice(0, 3))
        return acc
    }, {})


    return <>
        <div className="class-schedule-section">
            <div className="section-header-container">
                <div className="class-schedule-heading">
                    <h1><LuGraduationCap />My Class Schedule</h1>
                    <p>Set your class times to automatically block unavailable hours</p>
                </div>
                <button className="class-add-button" onClick={() => setIsOpen(true)}>+ Add Class</button>
            </div>
            {createModal()}
            <div className="classes-schedule-table">
                {DAYS.map((day) => (
                    <div key={day} className="day-schedule">
                        <h4 className="">
                            {day.slice(0, 3)}
                        </h4>
                        {groupedByDay[day].length > 0 ? (
                            groupedByDay[day].slice(0, 3).map((cls) => (
                                <div
                                    key={cls.id}
                                    className="class-details"
                                >
                                    <button
                                        onClick={() =>removeClassScheduleData(cls._id)}
                                        className="edit-btn"
                                    >
                                        <LuX />
                                    </button>
                                    <p className="">{cls.title}</p>
                                    <p className="">
                                        <LuClock className="h-3 w-3" />
                                        {cls.startTime} - {cls.endTime}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="no-class-schedule">
                                <span className="">No classes</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </>

}

export default ClassSchedule
