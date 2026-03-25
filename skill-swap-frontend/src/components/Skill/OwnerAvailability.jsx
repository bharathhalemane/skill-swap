import { LuCalendar, LuClock } from "react-icons/lu";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const OwnerAvailability = ({availabilityData}) => {
    const sortedAvailability=availabilityData.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));     
    return <div className="availability-editor-section">
        <div className="header-section">            
            <h1><LuCalendar color="#ff7a00"/>Availability</h1>                
        </div>
        <div className="availability-slots">
            <ul className="availability-slots-day-list">
                {
                    sortedAvailability.map(each => (
                        <li key={each.id || each._id} className="day-availability-slots">
                            <h1>{each.day}</h1>                        
                        </li>
                    ))
                }
            </ul>
            {
                availabilityData.length > 0 ? <ul className="availability-each-day-slots-list">
                {
                    sortedAvailability.map(each => (
                        <ul className="day-slots-list">
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
                <h1>No availability slots are available.</h1>
            </div>
            }
        </div>
    </div>

}

export default OwnerAvailability