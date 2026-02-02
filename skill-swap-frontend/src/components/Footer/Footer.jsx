import { IoMdSwap } from "react-icons/io";
import { LuMail, LuGithub, LuLinkedin } from "react-icons/lu";
import './Footer.css'

const contact = [
    { icon: <LuMail />, link: "mailto:bharathhalemane143@gmail.com" },
    { icon: <LuGithub />, link: "https://github.com/bharathhalemane/skill-swap.git" },
    { icon: <LuLinkedin />, link: "https://www.linkedin.com/in/bharath-halemane-2b4b621b4/" }
]
const Footer = () => {
    return (
        <footer className="footer">            
            <div className="footer-content">
                <div className="logo-contact-container">
                    <div className="logo"><div className='swap-icon-con'><IoMdSwap className="swap-icon" /></div><h1>Skill<span>Swap</span></h1></div>  
                    <p>Exchange skills, grow together. The community-driven platform for learning and teaching.</p>
                    <div className="contact-container">
                        {contact.map((item, index) => (
                            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="contact-icon">
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="footer-about">
                    <div className="about">
                        <h3>About SkillSwap</h3>
                        <p>SkillSwap is a community-driven platform that connects individuals eager to learn and teach new skills. Our mission is to foster a collaborative environment where knowledge sharing thrives, empowering users to grow personally and professionally.</p>
                    </div>
                    <div className="contact">
                        <h3>Contact Us</h3>
                        <p>Have questions or need assistance? Reach out to our support team</p>
                    </div>                    
                </div>
            </div>
            <div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 SkillSwap. All rights reserved.</p>
            </div>

        </footer>
    )
}

export default Footer;