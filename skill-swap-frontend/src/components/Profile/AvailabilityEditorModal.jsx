import { FaRegEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import CommonModal from "../Utils/CommonModal";
import { LuX, LuClock } from "react-icons/lu";

const apiProgress = {
    loading: "LOADING",
    success: "SUCCESS"
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_OPTIONS = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

const AvailabilityEditorModal = ({ data, setData }) => {
    const token = Cookies.get("jwtToken")
    const [isOpen, setIsOpen] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [daySlot, setDaySlot] = useState({
        day: "Monday",
        startTime: "8:00 AM"
    })

    const handleChange = e => {
        setDaySlot(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const createSlot = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/availability/create`
            const response = await axios.post(url, daySlot, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(response.data)
            const sorted = response.data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
            setData(sorted)
        } catch (err) {
            console.log(err)
        }
    }

    const onDelete = async (id) => {
        try{
            const url = `${import.meta.env.VITE_BACKEND_API}/availability/delete/${id}`
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })            
            const sorted = response.data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
            setData(sorted)
        }catch(err){
            console.log(err)
        }
    }

    const clearAll = async (dayId) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/availability/delete/all/${dayId}`
            const response = await axios.delete(url, {
                headers: {
                    Authorization:  `Bearer ${token}`
                }
            })
            const sorted = response.data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
            setData(sorted)
        }catch(err){
            console.log(err)
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        createSlot()
    }


    return (
        <>
            <button onClick={() => setIsOpen(true)}><FaRegEdit color="#ff7a00" /> Edit</button>

            <CommonModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Availability" width="550px">
                <form className="modern-form" onSubmit={onSubmit}>
                    <h1>Add Time Slot</h1>
                    <div className="row">
                        <div className="form-group">
                            <select name="day" id="" value={daySlot.day} onChange={handleChange}
                            >
                                {
                                    DAYS.map(day => (
                                        <option key={day}>{day}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <select name="startTime" id="" value={daySlot.startTime} onChange={handleChange}
                            >
                                {
                                    TIME_OPTIONS.map(time => (
                                        <option key={time}>{time}</option>
                                    ))
                                }
                            </select>
                        </div>
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
                                "Add Slot"
                            )}
                        </button>
                    </div>
                </form>

                <div className="availability-slots-modal">
                    <h1>Current Availability</h1>
                    {
                        data.length > 0 ? <ul className="slots-list-modal">
                            {
                                data.map(each => (
                                    <li key={each.id}>
                                        <div className="slot-day">
                                            <h1>{each.day}</h1>
                                            <button onClick={()=>clearAll(each._id)}>clear all</button>
                                        </div>
                                        <ul>
                                            {
                                                each.slots.map(slot => (
                                                    <li className="day-slots" key={slot._id}>
                                                        <LuClock size={13} />  {slot.startTime}
                                                        <LuX onClick={() => onDelete(slot._id)} />
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </li>
                                ))
                            }
                        </ul> : <div className="no-slot-container-modal">
                            <h1>Not time slots added yet</h1>
                        </div>
                    }
                </div>

            </CommonModal>
        </>
    )
}

export default AvailabilityEditorModal