import { useEffect, useState } from 'react'
import './SentRequests.css'
import { getSentRequest, resendRequest } from '../../requestAPi'
import { ArrowRight, RefreshCcw, RotateCcw, Send, X } from 'lucide-react'
import RequestModel from '../../../Skill/RequestModel'

const SentRequests = () => {
    const [data, setData] = useState([])
    const [callData, setCallData] = useState(false)

    const fetchData = async () => {
        try {
            const res = await getSentRequest()
            setData(res.data)
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData()
    }, [callData])

    const handleResentRequest = async (id) => {
        await resendRequest(id)
        setCallData(!callData)
    }

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

                                                        <div className="skills">
                                                            <span className="tag light">{req.skill?.category}</span>
                                                            <span className="tag dark">{req.skill?.title}</span>
                                                        </div>
                                                        <div className="message">"{req.message}"</div>
                                                        <div className="time">Sent {new Date(req.createdAt).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <div className="status waiting">Awaiting Response</div>
                                                    <button className="cancel "><X size={15} /> Cancel</button>
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
                                                <div className="skills">
                                                    {req.skill?.category} <span> <ArrowRight size={15}/> </span>
                                                    {req.skill?.title}
                                                </div>

                                                {req.status === "REJECTED" && (
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