import { IoMdSwap } from "react-icons/io";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FiLock, FiMail } from "react-icons/fi";
import {useState} from 'react'
import { useNavigate } from "react-router-dom"
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import "./Login.css";

const ApiURL = import.meta.env.VITE_AUTH_API_URL;

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]= useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);    

    const onChangeEmail = e => {
        setEmail(e.target.value);
    }
    const onChangePassword = e => {
        setPassword(e.target.value);        
    }

    const onClickPasswordShow = () => {
        setPasswordShow(prevState => !prevState);
    }
    
    const onSubmitSuccess = (jwtToken) => {
        Cookies.set('jwt_token', jwtToken, {expires: 30})
        navigate("/home", {replace: true});
    }

    const onSubmitForm = async e => {
        e.preventDefault()
        try {
            const userDetails = {email:email, password:password,}
            const url = `${ApiURL}/login`
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
                console.log("User registered successfully:", data)
                setError(false)
                setErrorMessage('')
                setEmail('')
                setPassword('')
                onSubmitSuccess(data.jwtToken)
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

    const onForgetPassword = async() => {
        try {
            const url = `${ApiURL}/forgot-password`;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if (response.ok) {
                alert(data.message);
            } else {
                setErrorMessage(data.message)
                setError(true)  
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    return (
        <div className="login-page">
            <div className="input-container">
                <div className="logo">
                    <div className='swap-icon-con'>
                        <IoMdSwap className="swap-icon" />
                    </div>
                    <h1>Skill<span>Swap</span></h1>
                </div>       
                <div className="welcome-text">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your learning journey.</p>
                </div>  
                <form className="form-container" onSubmit={onSubmitForm}>
                    <div className="email-input-container">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <FiMail className="input-icon" />
                            <input type="email" id="email" placeholder="you@example.com" value={email} onChange={onChangeEmail} />
                        </div>
                    </div>
                    <div className="password-container">
                        <div className="password-forgot-container">
                            <label htmlFor="password">Password</label>
                            <p className="forgot-password" onClick={onForgetPassword}>Forgot password?</p>                    
                        </div>
                        <div className="input-with-icon">
                            <FiLock className="input-icon" />
                            <input type={passwordShow ? "text" : "password"} id="password" placeholder="*************"  value={password} onChange={onChangePassword} />
                            <button className="toggle-password-btn" onClick={onClickPasswordShow}>{passwordShow ? <PiEyeBold /> : <PiEyeClosedBold />}</button>
                        </div>
                        
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    {error && <p className="error-message">*{errorMessage}</p>}
                    <p className="or">OR CONTINUE WITH</p>
                    <div className="social-login-container">
                        <div className="google-login btn" onClick={googleCallback}>
                            <FaGoogle size={20} className="google-icon"/>
                            <span>Google</span>
                        </div>
                        <div className="github-login btn" onClick={githubCallback}>
                            <FaGithub size={20} className="github-icon"/>
                            <span>GitHub</span>
                        </div>
                    </div>
                    <p className="signup-text">Don't have an account? <span><a href="/signup">Sign Up</a></span></p>
                </form>
            </div>
            <div className="login-section">                        
                <div className="logo-icon-container">
                    <IoMdSwap className="swap-icon" />
                </div>
                <h1>Exchange Skills, Grow Together</h1>
                <p>Join thousands of learners sharing their expertise and discovering new skills every day.</p>
            </div>
        </div>
    )
}

export default Login;