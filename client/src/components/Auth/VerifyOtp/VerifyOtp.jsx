import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { IoMdSwap } from "react-icons/io"
import { TailSpin } from "react-loader-spinner"
import "./VerifyOtp.css"

const apiURL = import.meta.env.VITE_AUTH_API_URL

const apiProgress = {
    success: "SUCCESS",
    loading: "LOADING",
}

const RESEND_COOLDOWN_SECONDS = 30

const VerifyOtp = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const queryEmail = new URLSearchParams(location.search).get("email")
    const email = location.state?.email || queryEmail || ""

    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [infoMessage, setInfoMessage] = useState(email ? `We sent a 6 digit code to ${email}` : "")
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [resendStatus, setResendStatus] = useState(apiProgress.success)
    const [cooldown, setCooldown] = useState(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        if (!email) {
            navigate("/signup", { replace: true })
        }
    }, [email, navigate])

    useEffect(() => {
        if (cooldown <= 0) {
            clearInterval(intervalRef.current)
            return
        }
        intervalRef.current = setInterval(() => {
            setCooldown(prev => prev - 1)
        }, 1000)
        return () => clearInterval(intervalRef.current)
    }, [cooldown])

    const onChangeOtp = e => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
        setOtp(value)
    }

    const onSubmitOtp = async e => {
        e.preventDefault()
        setError("")
        setApiStatus(apiProgress.loading)
        try {
            const url = `${apiURL}/verify-otp`
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if (response.ok) {
                navigate("/login", {
                    replace: true,
                    state: { verified: true },
                })
            } else {
                setError(data.message || "Incorrect code")
            }
        } catch (error) {
            setError("Sorry, something went wrong. Please try again.")
        }
        setApiStatus(apiProgress.success)
    }

    const onClickResend = async () => {
        if (cooldown > 0) return
        setError("")
        setInfoMessage("")
        setResendStatus(apiProgress.loading)

        try {
            const url = `${apiURL}/resend-otp`
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if (response.ok) {
                setInfoMessage(data.message || "A new code has been sent.")
                setCooldown(RESEND_COOLDOWN_SECONDS)
            } else {
                setError(data.message || "Couldn't resend code. Please try again.")
            }
        } catch (err) {
            setError("Sorry, something went wrong. Please try again.")
        }
        setResendStatus(apiProgress.success)
    }

    return (
        <div className="verify-otp-page">
            <form action="" className="verify-otp-form-container" onSubmit={onSubmitOtp}>
                <h1>Skill<span>Swap</span></h1>
                <div className="verify-otp-icon-wrapper">
                    <IoMdSwap className="verify-otp-icon" />
                </div>
                <h2>Verify your email</h2>
                {infoMessage && <p className="ino-message">{infoMessage}</p>}
                <div className="otp-input-container">
                    <label htmlFor="otp">Verification code</label>
                    <input
                        type="text"
                        className="otp-input"
                        id="otp"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="••••••"
                        value={otp}
                        onChange={onChangeOtp}
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={otp.length !== 6}>
                    {
                        apiStatus === apiProgress.success ? "Verify" : <TailSpin width={20} height={20} color="#fff" />
                    }
                </button>
                {error && <p className="error-message">{error}</p>}
                <p className="resend-text">
                    Didn't get a code?{" "}
                    <span className={cooldown > 0 ? "resend-link disabled" : "resend-link"} onClick={onClickResend}>
                        {resendStatus === apiProgress.loading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                    </span>
                </p>
            </form>
        </div>
    )
}

export default VerifyOtp