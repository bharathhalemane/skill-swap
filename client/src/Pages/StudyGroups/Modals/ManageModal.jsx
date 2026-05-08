import CommonModal from "../../../components/Utils/CommonModal";
import styles from "./styles/manageModal.module.css"
import { TailSpin } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { getJoinRequests } from "../studyGroupsApi";

const ManageModal = ({title, host, groupId}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [requests, setRequests] = useState([])

    useEffect(() => {
        const getRequests = async () => {
            const response = await getJoinRequests(groupId)
            setRequests(response.data.data)
        }
        getRequests()
    },[])

    const requestCard = (data) => {
        return (
            <div className={styles.requestCard}>
                <div className={styles.requestCardHeader}>
                    <img src={data.profile.profile_image} alt="" />
                    <h1>{data.name}</h1>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.declineButton}> <X /> Decline</button>
                    <button className={styles.buttonAccept}>
                        <Check/> Accept
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <button onClick={(e) => {
                setIsOpen(true)
                e.stopPropagation()
                e.preventDefault()
            }} className={styles.manageButton}>
                Manage
            </button>

            <CommonModal title="Join Requests" isOpen={isOpen} onClose={() => setIsOpen(false)} width="550px">
                <p className={styles.description}>Manage Requests to join " {title}"</p>
                {/* {requestCard(host)} */}
                <ul className={styles.requestsList}>
                    {
                        requests.map(data => (
                            <li key={data._id}>
                                {requestCard(data)}
                            </li>
                        ))
                    }
                </ul>
                
            </CommonModal>
        </>
    )
}

export default ManageModal