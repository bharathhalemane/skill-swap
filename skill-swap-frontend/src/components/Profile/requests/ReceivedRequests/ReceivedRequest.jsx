import { getReceivedRequests, acceptRequest, rejectRequest } from "../../requestAPi"
import { useEffect, useState } from "react"
import "./ReceivedRequest.css"
import { ArrowRight, ArrowRightLeft, Calendar, Check, X } from "lucide-react"
import Cookies from "js-cookie"
import { socket } from "../../../../Socket"
import { toast } from "react-toastify"

const ReceivedRequest = () => {
    const [requestsData, setRequestsData] = useState([])
    const [callData, setCallData] = useState(false)

    const fetchReceivedRequests = async () => {
        try {
            const response = await getReceivedRequests();
            setRequestsData(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        const token = Cookies.get("jwtToken")
        if (token) {
            fetchReceivedRequests()
        }
    }, [callData])

    const showToast = msg => {
        toast.info(msg, {
            position: "bottom-right",
            autoClose: 2500,
            theme: "dark",
        })
    }
    useEffect(() => {
        const handleNewRequest = (data, msg) => {
            setRequestsData(prev => [data, ...prev])
            showToast(msg)
        }

        const handleCancelRequest = (data, msg) => {
            setRequestsData(prev => prev.filter(req => req._id !== data._id))
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
        acceptRequest(id, name)
        setCallData(!callData)
        fetchReceivedRequests()
    }

    const handleRejectRequest = async (id, name) => {
        rejectRequest(id, name)
        setCallData(!callData)
        fetchReceivedRequests()
    }

    const getTimeAgo = (date) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(date)) / 1000);

        if (seconds < 60) return `${seconds} sec ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} days ago`;

        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} weeks ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} months ago`;

        const years = Math.floor(days / 365);
        return `${years} years ago`;
    };


    const pendingRequests = requestsData.filter(r => r.status === "PENDING")
    const pastRequests = requestsData.filter(r => r.status !== "PENDING")
    return requestsData.length > 0 ? <><hr /> <div className="container">
        <div className="requests-header-container">
            <h2>Skill Swap Requests</h2>
            <div className="badge">{pendingRequests.length} Pending</div>
        </div>
        <>
            {
                pendingRequests.length > 0 ? <> <h4>PENDING REQUESTS</h4>
                    {
                        pendingRequests.map((req) => (
                            <div className="card" key={req._id}>
                                <div className="left">
                                    <img src={req.sender?.profile?.profile_image} alt="profile" className="profile" />

                                    <div className="info">
                                        <h3>
                                            {req.sender?.name}
                                            <span className="username"> @{req.sender?.profile?.username}</span>
                                        </h3>
                                        {
                                            req.isSwap ?
                                                <div className="skills">
                                                    <span className="tag">{req.skill?.title}</span><ArrowRightLeft /><span className="tag">{req.swapSkill?.title}</span>
                                                </div> :
                                                <div className="skills">
                                                    <span className="tag">{req.skill?.category}</span><ArrowRight />
                                                    <span className="tag">{req.skill?.title}</span>
                                                </div>
                                        }

                                        <div className="message">
                                            "{req.message}"
                                        </div>

                                        <div className="time">
                                            <Calendar size={15} />{getTimeAgo(req.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="status pending">
                                        Pending
                                    </div>

                                    <div className="actions">
                                        <button className="btn decline" onClick={() => handleRejectRequest(req._id, req.sender?.name)}>
                                            <X /> Decline
                                        </button>

                                        <button className="btn accept" onClick={() => handleAcceptRequest(req._id, req.sender?.name)}>
                                            <Check /> Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }</> : null
            }

        </>

        <>
            {
                pastRequests.length > 0 ? <>
                    <h4>PAST REQUESTS</h4>
                    {
                        pastRequests.map((req) => (
                            <div className="card" key={req._id}>
                                <div className="left">
                                    <img src={req.sender?.profile?.profile_image} alt="profile" className="profile" />
                                    <div className="info">
                                        <h3>{req.sender?.name}</h3>
                                        {
                                            req.isSwap ?
                                                <div className="skills">
                                                    <span className="tag">{req.skill?.title}</span><ArrowRightLeft /><span className="tag">{req.swapSkill?.title}</span>
                                                </div> :
                                                <div className="skills">
                                                    <span className="tag">{req.skill?.category}</span><ArrowRight />
                                                    <span className="tag">{req.skill?.title}</span>
                                                </div>
                                        }
                                    </div>
                                </div>


                                <div className="right">
                                    <div className={`status ${req.status}`}>{req.status}</div>
                                </div>
                            </div>
                        ))
                    }
                </> : null
            }
        </>
    </div> </> : null
}

export default ReceivedRequest