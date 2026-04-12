import CommonModal from "../../components/Utils/CommonModal"
import { useState, useEffect } from "react"
import styles from './Modal.module.css'
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";

const apiProgress = {
    loading: "LOADING",
    success: "SUCCESS"
};



const PhoneUpdateModal = ({ showModal, setShowModal }) => {
    const token = Cookies.get("jwtToken")
    const [phone, setPhone] = useState("")
    const [apiStatus, setApiStatus] = useState(apiProgress.success)

    const onSubmitPhoneNumber = async (e) => {
        e.preventDefault()
        setApiStatus(apiProgress.loading)
        try {
            const url = `${import.meta.env.VITE_PROFILE_API}/phone-number`
            const response = await axios.put(url, {phoneNumber: phone}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response.data.message)
            setShowModal(false)
        } catch (err) {     
            toast.error(err.message)
        }
        setApiStatus(apiProgress.success)
    }

    return <CommonModal
        isOpen={showModal}
        title="Update Your Phone Number"
    >
        <form action="" className={styles.profileUpdateForm} onSubmit={onSubmitPhoneNumber}>
            <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                    type="tel"
                    value={phone}
                    required
                    onChange={e => setPhone(e.target.value)}
                />
            </div>
            <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveBtn}>
                    {apiStatus === apiProgress.loading ? (
                        <TailSpin width={20} height={20} color="#fff" />
                    ) : (
                        "Save"
                    )}
                </button>
            </div>
        </form>
    </CommonModal>
}

export default PhoneUpdateModal