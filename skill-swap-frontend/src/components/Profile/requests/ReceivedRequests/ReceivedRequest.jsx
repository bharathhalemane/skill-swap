import { getReceivedRequests, acceptRequest, rejectRequest } from "../../requestAPi"
import { useEffect, useState } from "react"
import "./ReceivedRequest.css"
import { Check, X } from "lucide-react"
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

    useEffect(() => {
        const userId = Cookies.get("userId")

        socket.on("new_request", (newReq) => {
            setRequestsData(prev => [newReq, ...prev])
            toast.info("New Request received!")
        })
        return () => {
            socket.off("new_request")
        }
    },[])

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

                                        <div className="skills">
                                            <span className="tag">{req.skill?.category}</span>
                                            <span className="tag">{req.skill?.title}</span>
                                        </div>

                                        <div className="message">
                                            "{req.message}"
                                        </div>

                                        <div className="time">
                                            {new Date(req.createdAt).toLocaleString()}
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

                                        <div className="skills">
                                            <span className="tag">{req.skill?.category}</span>
                                            <span className="tag">{req.skill?.title}</span>

                                        </div>
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