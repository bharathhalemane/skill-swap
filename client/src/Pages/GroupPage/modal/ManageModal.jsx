import CommonModal from "../../../components/Utils/CommonModal";
import styles from "./ManageModal.module.css"
import { TailSpin } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { Check, X, Bell } from "lucide-react";
import { acceptRequest, rejectRequest } from "../../StudyGroups/StudyGroupsApi";
import { socket } from "../../../Socket"
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_API
const ManageModal = ({ dispatch, title, host, groupId }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [requests, setRequests] = useState([])

    const getJoinRequests = async (groupId) => {
        try {
            const token = Cookies.get("jwtToken")
            const response = await axios.get(
                `${API}/groups/${groupId}/requests`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            setRequests(response.data.data)
        } catch (err) {
            err.response?.data?.message || "Failed to fetch requests"

        }
    }

    useEffect(() => {
        getJoinRequests(groupId)
        socket.on("new_group_join_get_request", () => {
            getJoinRequests(groupId)
        })
        return () => {
            socket.off("new_group_join_get_request")
        }
    }, [groupId])

    const onClickAccept = async (senderId) => {
        await acceptRequest(dispatch, groupId, senderId)
        getJoinRequests(groupId)
    }

    const onClickReject = async (senderId) => {
        await rejectRequest(dispatch, groupId, senderId)
        getJoinRequests(groupId)
    }

    const getTimeAgo = (date) => {
        const now = new Date()
        const seconds = Math.floor((now - new Date(date)) / 1000)
        if (seconds < 60) return `${seconds} sec ago`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes} min ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} hr ago`
        const days = Math.floor(hours / 24)
        if (days < 7) return `${days} days ago`
        const weeks = Math.floor(days / 7)
        if (weeks < 4) return `${weeks} weeks ago`
        const months = Math.floor(days / 30)
        if (months < 12) return `${months} months ago`
        const years = Math.floor(days / 365)
        return `${years} years ago`
    }

    const requestCard = (data) => {
        console.log(data)
        const { user, _id } = data
        const { profile_image } = user.profile
        const time = data.requestedAt
        return (
            <div className={styles.requestCard}>
                <div className={styles.requestCardHeader}>
                    <img src={profile_image} alt="" />
                    <div className={styles.headerInfo}>
                        <h1>{user.name}</h1>
                        <p>{getTimeAgo(time)}</p>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={`${styles.declineButton} ${styles.button}`} onClick={() => onClickReject(data.user._id)}> <X /> Decline</button>
                    <button className={`${styles.acceptButton} ${styles.button}`} onClick={() => onClickAccept(data.user._id)}>
                        <Check /> Accept
                    </button>
                </div>
                <div>
                    {
                        requests.length === 0 && <p>No Requests pending</p>
                    }
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
                <Bell size={20} /> Requests
                {
                    requests.length > 0 && <span className={styles.badge}>{requests.length}</span>
                }
            </button>

            <CommonModal title="Join Requests" isOpen={isOpen} onClose={() => setIsOpen(false)} width="550px">
                <p className={styles.description}>Manage Requests to join " {title}"</p>
                {/* {requestCard(host)} */}
                {
                    requests.length === 0 ? (
                        <p className={styles.emptyText}>No Requests Pending</p>
                    ) : (
                        <ul className={styles.requestsList}>
                            {
                                requests.map(data => (
                                    <li key={data._id}>
                                        {requestCard(data)}
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }

            </CommonModal>
        </>
    )
}

export default ManageModal