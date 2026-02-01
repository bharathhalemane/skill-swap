import './Header.css'
import { IoMdSwap } from "react-icons/io";

const Header = () => {
    return (
        <nav className="header">
            <div className="logo"><div className='swap-icon-con'><IoMdSwap className="swap-icon" /></div><h1>Skill<span>Swap</span></h1></div>
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/browse-skills">Browse Skills</a></li>
                <li><a href="/how-it-works">How It Works</a></li>
            </ul>
            <ul className="auth-links">
                <li><a href="/login" className='login'><button>Log In</button></a></li>
                <li><a href="/signup" className='sign-up'><button>Get Started</button></a></li>
            </ul>
        </nav>

    )
}

export default Header;