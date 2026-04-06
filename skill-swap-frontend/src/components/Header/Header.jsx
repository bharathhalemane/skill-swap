import styles from './Header.module.css'
import { IoMdSwap } from "react-icons/io";
import { useState } from 'react';
import { LogIn, Menu } from 'lucide-react';

const Header = () => {

    return (
        <nav className={styles.header}>
            <div className={styles.logo}>
                <div className={styles.swapIconCon}>
                    <IoMdSwap className={styles.swapIcon} />
                </div>
                <h1>Skill<span>Swap</span></h1>
            </div>
            <ul className={styles.authLinks}>
                <li>
                    <a href="/login" className={styles.login}>
                        <button>Log In</button>                        
                    </a>
                </li>
                <li>
                    <a href="/signup" className={styles.signUp}>
                        <button>Get Started</button>
                    </a>
                </li>
            </ul>
            <ul className={styles.mobileAuthLinks}>
                <li>
                    <a href="/login" className={styles.login}>
                        <button><LogIn size={24}/></button>                        
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Header;