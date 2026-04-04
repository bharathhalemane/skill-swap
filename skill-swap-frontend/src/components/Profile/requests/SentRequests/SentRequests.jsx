import { useEffect, useState } from 'react'
import './SentRequests.css'
import { getSentRequest, resendRequest, cancelRequest } from '../../requestAPi'
import { ArrowRight, ArrowRightLeft, RotateCcw, Send, X } from 'lucide-react'
import {socket} from '../../../../Socket'
import {toast} from 'react-toastify'

const SentRequests = () => {
    const [data, setData] = useState([])
    const [callData, setCallData] = useState(false)

    const fetchData = async () => {
        try {
            const res = await getSentRequest()
            setData(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData()
    }, [callData])

    const showToast = msg => {
        toast.info(msg, {
            position: "bottom-right",
            autoClose: 2500,
            theme: "dark",
        })
    }

    useEffect(() => {
        const handleRequestAccepted = msg => {
            
            fetchData()
            showToast(msg)
        }

        const handleRequestRejected = msg => {
            console.log("calling rejected function")
            showToast(msg)
            fetchData()
        }
        
        socket.on("request_accepted", handleRequestAccepted)
        socket.on("request_rejected", handleRequestRejected)

        return () => {
            socket.off("request_accepted")
            socket.off("request_rejected")
        }
    })


    const handleResentRequest = async (id) => {
        await resendRequest(id)
        setCallData(!callData)
    }
    const handleCancelRequest = async (id) => {
        await cancelRequest(id)
        setCallData(!callData)
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

    const awaiting = data.filter(r => r.status === "PENDING")
    const resolved = data.filter(r => r.status !== "PENDING")

    return (
        <>
            {
                data.length > 0 && <>
                    <hr />
                    <div className="sent-container">
                        <div className="requests-header-container">
                            <h2><Send /> Sent Requests</h2>

                            <div className="badge">{awaiting.length} Awaiting</div>
                        </div>
                        {
                            awaiting.length > 0 && (
                                <>
                                    <h4>AWAITING RESPONSE</h4>
                                    {
                                        awaiting.map((req) => (
                                            <div className="card awaiting-card" key={req._id}>
                                                <div className="left">
                                                    <img src={req.receiver?.profile?.profile_image} alt="profile" className="profile" />

                                                    <div className="info">
                                                        <h3>{req.receiver?.name}
                                                            <span className="username">{" "}@{req.receiver?.profile?.username}</span>
                                                        </h3>
                                                        {
                                                            req.isSwap ?
                                                                <div className="skills">
                                                                    <span className="tag light">Your Offer:<b> {req.swapSkill?.title}</b></span><ArrowRightLeft /><span className="tag dark">You Want: <b>{req.skill?.title}</b></span>
                                                                </div> :
                                                                <div className="skills">
                                                                    <span className="tag light">{req.skill?.category}</span><ArrowRight />
                                                                    <span className="tag dark">{req.skill?.title}</span>
                                                                </div>
                                                        }
                                                        <div className="message">"{req.message}"</div>
                                                        <div className="time">Sent {getTimeAgo(req.updatedAt)}</div>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <div className="status waiting">Awaiting Response</div>
                                                    <button className="cancel " onClick={() => handleCancelRequest(req._id)}><X size={15} /> Cancel</button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }
                        {resolved.length > 0 && (
                            <>
                                <h4>RESOLVED</h4>
                                {resolved.map((req) => (
                                    <div className="card resolved-card" key={req._id}>
                                        <div className="left">
                                            <img src={req.receiver?.profile?.profile_image} alt="profile" className="profile" />
                                            <div className="info">
                                                <h3>{req.receiver?.name}</h3>
                                                {
                                                    req.isSwap ?
                                                        <div className="skills">
                                                            <span>{req.swapSkill?.title} </span><ArrowRightLeft /><span> {req.skill?.title}</span>
                                                        </div> :
                                                        <div className="skills">
                                                            <span>{req.skill?.category} </span><ArrowRight />
                                                            <span> {req.skill?.title}</span>
                                                        </div>
                                                }

                                                {(req.status === "REJECTED" || req.status === "CANCELLED") && (
                                                    <div className="resend" onClick={() => handleResentRequest(req._id)}><RotateCcw /> Resend Request</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className={`status ${req.status}`}>{req.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </>
            }
        </>
    )

}

export default SentRequests