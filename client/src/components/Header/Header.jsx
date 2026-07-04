import styles from './Header.module.css'
import { IoMdSwap } from "react-icons/io";
import { useState } from 'react';
import { LogIn, Menu, Download } from 'lucide-react';
import {useInstallPrompt} from "../../hooks/useInstallPrompt"

const Header = () => {
    const { canInstall, isInstalled, promptInstall } = useInstallPrompt()

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
                {canInstall && (
                    <li>
                        <button className={styles.installBtn} onClick={promptInstall}>
                            <Download size={20} />
                            Install App
                        </button>
                    </li>   
                )}
            </ul>
            <ul className={styles.mobileAuthLinks}>
                {canInstall && (
                    <li>
                        <button className={styles.installIconBtn} onClick={promptInstall} aria-label="Install App">
                            <Download size={18} />
                        </button>
                    </li>
                )}
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