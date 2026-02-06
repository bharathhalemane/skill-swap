import { useParams, useNavigate } from "react-router-dom"
import { FiLock } from "react-icons/fi";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { useState } from "react"
import './ResetPassword.css'

const apiURL = import.meta.env.VITE_AUTH_API_URL

const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordShow, setPasswordShow] = useState(false)
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { token } = useParams()

    const onChangePassword = e => {
        setPassword(e.target.value)
    }

    const onChangeConfirmPassword = e => {
        setConfirmPassword(e.target.value)
    }

    const onClickPasswordShow = () => {
        setPasswordShow(prevState => !prevState)
    }

    const onClickConfirmPasswordShow = () => {
        setConfirmPasswordShow(prevState => !prevState)
    }

    const onSubmitSuccess = () => {
        navigate("/login", {replace :true})
    }

    const onSubmitSetPassword = async (e) => {
        e.preventDefault()
        try {
            const url = `${apiURL}/reset-password/${token}`
            const option = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password, confirmPassword })
            }
            const response = await fetch(url, option)
            const data = await response.json()
            if (response.ok) {
                onSubmitSuccess()
            } else {
                setError(data.message)
            }
        } catch (err) {
            setError("Try again")
        }
    }


    return (
        <div className="reset-password-page">
            <form onSubmit={onSubmitSetPassword} className="reset-form-container">
                <h1>Skill<span>Swap</span></h1>
                <div className="password-container">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input type={passwordShow ? "text" : "password"} id="password" placeholder="*************" value={password} onChange={onChangePassword} />
                        <button className="toggle-password-btn" type="button" onClick={onClickPasswordShow}>{passwordShow ? <PiEyeBold /> : <PiEyeClosedBold />}</button>
                    </div>
                </div>
                <div className="password-container">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input type={confirmPasswordShow ? "text" : "password"} id="confirm-password" placeholder="*************" value={confirmPassword} onChange={onChangeConfirmPassword} />
                        <button className="toggle-password-btn" type="button" onClick={onClickConfirmPasswordShow}>{confirmPasswordShow ? <PiEyeBold /> : <PiEyeClosedBold />}</button>
                    </div>
                </div>
                <button className="submit-btn" type="submit">Reset</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    )
}

export default ResetPassword