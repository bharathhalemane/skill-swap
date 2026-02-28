import { IoMdSwap } from "react-icons/io";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FiLock, FiMail } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import "./Signup.css";

import { useState } from 'react';
import { useNavigate } from "react-router-dom"

const ApiURL = import.meta.env.VITE_AUTH_API_URL;

const Signup = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

    const onChangeFullname = e => {
        setFullname(e.target.value);
    }

    const onChangeEmail = e => {
        setEmail(e.target.value);
    }

    const onChangePassword = e => {
        setPassword(e.target.value);
    }

    const onChangeConfirmPassword = e => {
        setConfirmPassword(e.target.value);
    }

    const onSubmitSuccess = () => {
        Cookies.set('jwtToken', data.jwtToken, { expires: 1 })
        Cookies.set("userId", data.userId, {expires: 1})
        navigate("/home", {replace: true});
    }

    const onClickPasswordShow = () => {
        setPasswordShow(prevState => !prevState);
    }

    const onClickConfirmPasswordShow = () => {
        setConfirmPasswordShow(prevState => !prevState);
    }

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const userDetails = {name:fullname, email:email, password:password, confirmPassword:confirmPassword}
            const url = `${ApiURL}/signup`
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if (response.ok) {
                setError(false)
                setErrorMessage('')
                setFullname('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                onSubmitSuccess(data)
            } else {
                setErrorMessage(data.message)
                setError(true)
            }
        } catch (err) {
            setErrorMessage("Sorry, we are fixing try after sometime")
            setError(true)   
        }
    }

    const googleCallback = () => {
        window.location.href = `${ApiURL}/google`;
    }

    const githubCallback = () => {
        window.location.href = `${ApiURL}/github`;
    }

    return (
        <div className="signup-page">
            <div className="signup-section">
                <div className="logo-icon-container">
                    <IoMdSwap className="swap-icon" />
                </div>
                <h1>Start Your Learning Journey</h1>
                <p>Create your account and join a community of passionate learners sharing skills worldwide.</p>
            </div>
            <div className="input-container">
                <div className="logo">
                    <div className='swap-icon-con'>
                        <IoMdSwap className="swap-icon" />
                    </div>
                    <h1>Skill<span>Swap</span></h1>
                </div>
                <div className="welcome-text">
                    <h1>Create your account</h1>
                    <p>Join the community and start swapping skills today.</p>
                </div>
                <form className="form-container" onSubmit={onSubmitForm}>
                    <div className="username-input-container">
                        
                        <label htmlFor="username">Full Name</label>
                        <div className="input-with-icon">
                            <GoPerson className="input-icon" />
                            <input type="text" id="username" placeholder="Albert Einstein" value={fullname} onChange={onChangeFullname} />
                        </div>
                    </div>
                    <div className="email-input-container">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <FiMail className="input-icon" />
                            <input type="email" id="email" placeholder="you@example.com" value={email} onChange={onChangeEmail} />
                        </div>
                    </div>
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
                    <button type="submit" className="signup-button">Create Free Account</button>
                    {error && <p className="error-message">*{errorMessage}</p>}
                    <p className="or">OR CONTINUE WITH</p>
                    <div className="social-login-container">
                        <div className="google-login btn" onClick={googleCallback}>
                            <FaGoogle size={20} className="google-icon" />
                            <span>Google</span>
                        </div>
                        <div className="github-login btn" onClick={githubCallback}>
                            <FaGithub size={20} className="github-icon" />
                            <span>GitHub</span>
                        </div>
                    </div>
                    <p className="login-text">Already have an account? <span><a href="/login">Login</a></span></p>
                </form>
            </div>
        </div>
    )
}

export default Signup;