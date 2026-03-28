import CommonModal from "../Utils/CommonModal"
import { sentRequest } from "./SkillApi"
import { TailSpin } from "react-loader-spinner";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"
import axios from "axios";
const apiProgress = {
    loading: "LOADING",
    success: "SUCCESS"
}

const RequestWithSwap = ({ skillId }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [message, setMessage] = useState("")
    const [swapSkillId, setSwapSkillId] = useState("")
    const [titles, setTitles] = useState([])

    const getUserSkillTitle = async () => {
        const userId = Cookies.get("userId")
        const token = Cookies.get("jwtToken")
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/user/${userId}`
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const skills = response.data.skills
            const titles = skills.map(skill => ({ title: skill.title, id: skill.id }))
            setTitles(titles)
            console.log(titles)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUserSkillTitle()
    }, [])

    const handleChangeMessage = e => {
        setMessage(e.target.value)
    }
    const handleChangeSkillId = e => {
        setSwapSkillId(e.target.value)
    }

    const request = (e) => {
        e.preventDefault()
        sentRequest({ skillId, message, isSwap: true, swapSkillId })
        setIsOpen(false)
        setMessage("")
    }
    return <>
        <button className="request-btn" onClick={() => setIsOpen(true)}>Swap With Skill</button>
        <CommonModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Send Request" width="550px">
            <form action="" className="modern-form" onSubmit={request}>
                <div className="form-group">
                    <label htmlFor="">Message</label>
                    <textarea name="message" id="" placeholder="Send any message" onChange={handleChangeMessage}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="">Skills</label>
                    <select name="swapSkillId" id="" value={swapSkillId} onChange={handleChangeSkillId} required>
                        <option value="" disabled>Select Skill</option>
                        {
                            titles.map(title => (
                                <option value={title.id}>{title.title}</option>
                            ))
                        }
                    </select>
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
                            "Swap"
                        )}
                    </button>
                </div>
            </form>

        </CommonModal>
    </>
}

export default RequestWithSwap