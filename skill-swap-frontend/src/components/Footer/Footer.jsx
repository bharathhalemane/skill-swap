import { IoMdSwap } from "react-icons/io";
import { LuMail, LuGithub, LuLinkedin } from "react-icons/lu";
import styles from './Footer.module.css'

const contact = [
    { icon: <LuMail />, link: "mailto:bharath.halemane.00@gmail.com" },
    { icon: <LuGithub />, link: "https://github.com/bharathhalemane/skill-swap.git" },
    { icon: <LuLinkedin />, link: "https://www.linkedin.com/in/bharath-halemane-841010287"}
]

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>

                {/* LEFT */}
                <div className={styles.left}>
                    <div className={styles.logo}>
                        <div className={styles.iconBox}>
                            <IoMdSwap className={styles.icon} />
                        </div>
                        <h1>Skill<span>Swap</span></h1>
                    </div>

                    <p className={styles.desc}>
                        Exchange skills, grow together. The community-driven platform for learning and teaching.
                    </p>

                    <div className={styles.contacts}>
                        {contact.map((item, index) => (
                            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.contactIcon}>
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className={styles.right}>
                    <div>
                        <h3>About SkillSwap</h3>
                        <p>
                            SkillSwap connects learners and teachers to grow together.
                        </p>
                    </div>

                    <div>
                        <h3>Contact</h3>
                        <p>Reach out to our support team anytime.</p>
                    </div>
                </div>

            </div>

            <div className={styles.bottom}>
                <p>© 2026 SkillSwap. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;