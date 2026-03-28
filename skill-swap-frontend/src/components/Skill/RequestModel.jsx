import CommonModal from "../Utils/CommonModal"
import { sentRequest } from "./SkillApi"
import { TailSpin } from "react-loader-spinner";
import { useState, useEffect } from "react";
const apiProgress = {
    loading: "LOADING",
    success: "SUCCESS"
}

const RequestModel = ({ skillId }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [message, setMessage] = useState("")

    const handleChange = e => {
        setMessage(e.target.value)
    }
    const request = (e) => {
        e.preventDefault()
        sentRequest({ skillId, message, isSwap: false, swapSkillId: null })
        setIsOpen(false)
        setMessage("")
    }
    return <>
        <button className="request-btn" onClick={()=>setIsOpen(true)}>Send Request</button>
        <CommonModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Send Request" width="550px">
            <form action="" className="modern-form" onSubmit={request}>
                <div className="form-group">
                    <label htmlFor="">Message</label>
                    <textarea name="message" id="" placeholder="Send any message" onChange={handleChange}></textarea>
                </div>
                <div className="modal-buttons">
                    <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsOpen(false)}
                    >
                    Cancel
                    </button>

                    <button type="submit" className="request-btn">
                    {apiStatus === apiProgress.loading ? (
                        <TailSpin width={20} height={20} color="#fff" />
                    ) : (
                        "Sent"
                    )}
                    </button>
                </div>
            </form>
        
        </CommonModal>
    </>
}

export default RequestModel