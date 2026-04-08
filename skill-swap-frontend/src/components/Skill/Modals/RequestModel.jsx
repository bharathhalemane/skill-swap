import CommonModal from "../../Utils/CommonModal"
import { sentRequest } from "../SkillApi"
import { TailSpin } from "react-loader-spinner";
import { useState, useEffect } from "react";
import styles from "./Modal.module.css"
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
        sentRequest({ skillId, message, isSwap: false, swapSkillId: {} })
        setIsOpen(false)
        setMessage("")
    }
    return <>
        <button className="request-btn" onClick={()=>setIsOpen(true)}>Send Request</button>
        <CommonModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Send Request" width="550px">
            <form action="" className={styles.modernForm} onSubmit={request}>
                <div className={styles.formGroup}>
                    <label htmlFor="">Message</label>
                    <textarea name="message" id="" placeholder="Send any message" onChange={handleChange}></textarea>
                </div>
                <div className={styles.modalButtons}>
                    <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsOpen(false)}
                    >
                    Cancel
                    </button>

                    <button type="submit" className={styles.saveBtn}>
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