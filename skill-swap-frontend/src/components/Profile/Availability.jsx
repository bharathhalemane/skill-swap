import { LuCalendar, LuClock } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import './CssClasses.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie"
import axios from "axios";
import AvailabilityEditorModal from "./AvailabilityEditorModal";
import {toast} from 'react-toastify'

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
            const sorted=response.data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));            
            setAvailabilityData(sorted)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getAvailabilityData()
    },[])

    return <div className="availability-editor-section">
        <div className="header-section">            
            <h1><LuCalendar color="#ff7a00"/> My Availability</h1>                
            <AvailabilityEditorModal data={availabilityData} setData={setAvailabilityData} />
        </div>
        <div className="availability-slots">
            <ul className="availability-slots-day-list">
                {
                    availabilityData.map(each => (
                        <li key={each.id || each._id} className="day-availability-slots">
                            <h1>{each.day}</h1>                        
                        </li>
                    ))
                }
            </ul>
            {
                availabilityData.length > 0 ? <ul className="availability-each-day-slots-list">
                {
                    availabilityData.map(each => (
                        <ul className="day-slots-list" key={each.id}>
                            {
                                each.slots.map(slot => (
                                    <div className="day-slots" key={slot.id || slot._id}>
                                        <LuClock size={13} />  {slot.startTime}
                                    </div>
                                ))
                            }
                        </ul>
                    ))
                }
            </ul> : <div className="no-slots-container">
                <h1>No availability set. Click Edit to add your available time slots.</h1>
            </div>
            }
        </div>
    </div>

}

export default Availability