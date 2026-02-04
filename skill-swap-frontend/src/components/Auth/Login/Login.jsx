import { IoMdSwap } from "react-icons/io";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { FiLock, FiMail } from "react-icons/fi";

import "./Login.css";
const Login = () => {
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
                <form className="form-container">
                    <div className="email-input-container">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <FiMail className="input-icon" />
                            <input type="email" id="email" placeholder="you@example.com" required />
                        </div>
                    </div>
                    <div className="password-container">
                        <div className="password-forgot-container">
                            <label htmlFor="password">Password</label>
                            <p className="forgot-password">Forgot password?</p>                    
                        </div>
                        <div className="input-with-icon">
                            <FiLock className="input-icon" />
                            <input type="password" id="password" placeholder="*************" required />
                        </div>
                        
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <p className="or">OR CONTINUE WITH</p>
                    <div className="social-login-container">
                        <div className="google-login btn">
                            <FaGoogle size={20} className="google-icon"/>
                            <span>Google</span>
                        </div>
                        <div className="github-login btn">
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
                <p>Join thousands of learners sharing their experitise and discovering new skills every day.</p>
            </div>
        </div>
    )
}

export default Login;