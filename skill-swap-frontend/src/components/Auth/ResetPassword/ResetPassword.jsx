import { useLocation } from "react-router-dom"
import { IoMdSwap } from "react-icons/io";
import { FiLock, FiMail } from "react-icons/fi";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import {useState} from "react"

const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordShow, setPasswordShow] = useState(false)
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)

    const onChangePassword = e => {
        setPassword(e.target.value)
    }

    const onChangeConfirmPassword = e => {
        setPassword(e.target.value)
    }

    const onClickPasswordShow = () => {
        setPasswordShow(prevState => !prevState)
    }

    const onClickConfirmPasswordShow = () => {
        setConfirmPasswordShow(prevState => !prevState) 
    }
    
    
    return (
        <div className="reset-password-page">
            <form onSubmit={onSubmitSetPassword}>
                 <div className="password-container">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input type={passwordShow ? "text" : "password"} id="password" placeholder="*************" value={password} onChange={onChangePassword} />
                        <button className="toggle-password-btn" onClick={onClickPasswordShow}>{passwordShow ? <PiEyeBold /> : <PiEyeClosedBold />}</button>
                    </div>
                </div>
                <div className="password-container">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input type={confirmPasswordShow ? "text" : "password"} id="confirm-password" placeholder="*************" value={confirmPassword} onChange={onChangeConfirmPassword} />
                        <button className="toggle-password-btn" onClick={onClickConfirmPasswordShow}>{confirmPasswordShow ? <PiEyeBold /> : <PiEyeClosedBold />}</button>
                    </div>
                </div>
                <button type="submit">Reset</button>
            </form>
        </div>
    )
}

export default ResetPassword