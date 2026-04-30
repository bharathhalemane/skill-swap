import { acceptRequest, rejectRequest } from "../../requestAPi"
import { useEffect, useState } from "react"
import styles from "./ReceivedRequest.module.css"
import { ArrowRight, ArrowRightLeft, Calendar, Check, X } from "lucide-react"
import { BsPersonCircle } from "react-icons/bs"
import Cookies from "js-cookie"
import { socket } from "../../../../Socket"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { fetchReceivedRequest } from "../../../../redux/features/requests/requestsAction"

const ReceivedRequest = () => {
    const dispatch = useDispatch()
    const [callData, setCallData] = useState(false)
    const requestsData = useSelector(state => state.requests.receivedRequest)
    useEffect(() => {
        if (requestsData.length === 0) {
            dispatch(fetchReceivedRequest())
        }
    }, [dispatch])

    const showToast = msg => {
        toast.info(msg, {
            position: "bottom-right",
            autoClose: 2500,
            theme: "dark",
        })
    }

    useEffect(() => {
        const handleNewRequest = (data, msg) => {
            dispatch(fetchReceivedRequest())
            showToast(msg)
        }
        const handleCancelRequest = (data, msg) => {
            dispatch(fetchReceivedRequest())
            showToast(msg)
        }

        socket.on("new_request", handleNewRequest)
        socket.on("request_cancelled", handleCancelRequest)

        return () => {
            socket.off("new_request")
            socket.off("request_cancelled")
        }
    }, [])

    const handleAcceptRequest = async (id, name) => {
        acceptRequest(dispatch, id, name)
    }

    const handleRejectRequest = async (id, name) => {
        rejectRequest(dispatch, id, name)
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

    const pendingRequests = requestsData.filter(r => r.status === "PENDING")
    const pastRequests = requestsData.filter(r => r.status !== "PENDING")

    if (requestsData.length === 0) return null

    return (
        <>
            <hr />
            <div className={styles.container}>
                <div className={styles.requestsHeaderContainer}>
                    <h2>Skill Swap Requests</h2>
                    <div className={styles.badge}>{pendingRequests.length} Pending</div>
                </div>

                {pendingRequests.length > 0 && (
                    <>
                        <h4>PENDING REQUESTS</h4>
                        {pendingRequests.map((req) => (
                            <div className={styles.card} key={req._id}>
                                <div className={styles.left}>
                                    {req.sender?.profile?.profile_image
                                        ? <img src={req.sender.profile.profile_image} alt="profile" className={styles.profile} />
                                        : <BsPersonCircle className={styles.profile} />
                                    }
                                    <div className={styles.info}>
                                        <h3>
                                            {req.sender?.name}
                                            <span className={styles.username}>{req.sender?.profile?.username && ` @${req.sender.profile.username}`}</span>
                                        </h3>
                                        {req.isSwap ? (
                                            <div className={styles.skills}>
                                                <span className={styles.tag}>{req.skill?.title}</span>
                                                <ArrowRightLeft />
                                                <span className={styles.tag}>{req.swapSkill?.title}</span>
                                            </div>
                                        ) : (
                                            <div className={styles.skills}>
                                                <span className={styles.tag}>{req.skill?.category}</span>
                                                <ArrowRight />
                                                <span className={styles.tag}>{req.skill?.title}</span>
                                            </div>
                                        )}
                                        <div className={styles.message}>"{req.message}"</div>
                                        <div className={styles.time}>
                                            <Calendar size={15} />{getTimeAgo(req.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    <div className={`${styles.status} ${styles.pending}`}>Pending</div>
                                    <div className={styles.actions}>
                                        <button className={`${styles.btn} ${styles.decline}`} onClick={() => handleRejectRequest(req._id, req.sender?.name)}>
                                            <X /> Decline
                                        </button>
                                        <button className={`${styles.btn} ${styles.accept}`} onClick={() => handleAcceptRequest(req._id, req.sender?.name)}>
                                            <Check /> Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {pastRequests.length > 0 && (
                    <>
                        <h4>PAST REQUESTS</h4>
                        {pastRequests.map((req) => (
                            <div className={styles.card} key={req._id}>
                                <div className={styles.left}>
                                    {req.sender?.profile?.profile_image
                                        ? <img src={req.sender.profile.profile_image} alt="profile" className={styles.profile} />
                                        : <BsPersonCircle className={styles.profile} />
                                    }
                                    <div className={styles.info}>
                                        <h3>{req.sender?.name}</h3>
                                        {req.isSwap ? (
                                            <div className={styles.skills}>
                                                <span className={styles.tag}>{req.skill?.title}</span>
                                                <ArrowRightLeft />
                                                <span className={styles.tag}>{req.swapSkill?.title}</span>
                                            </div>
                                        ) : (
                                            <div className={styles.skills}>
                                                <span className={styles.tag}>{req.skill?.category}</span>
                                                <ArrowRight />
                                                <span className={styles.tag}>{req.skill?.title}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    <div className={`${styles.status} ${styles[req.status]}`}>
                                        {req.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    )
}

export default ReceivedRequest