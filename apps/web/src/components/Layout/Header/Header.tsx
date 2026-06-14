import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom";
import { LogoHeader } from "../../Assets/Logos/Logos";
import Navbar from "../../Navigators/Navbar/Navbar";
import NavUser from "../../Navigators/NavUser/NavUser";
import styles from "./Header.module.css"
import { UserMenuIcon } from "../../Assets/Iconos/Iconos";
import iconoStyles from "../../Assets/Iconos/Iconos.module.css";

export default function Header(){
    const [menuOpen, setMenuOpen] = useState(false)
    const headerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!menuOpen) return
        const handler = (e: MouseEvent) => {
            if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [menuOpen])

    return (
        <header ref={headerRef}>
            <Link to="/">
                <LogoHeader className={styles.logoHeader}/>
            </Link>
            <Navbar />
            {!menuOpen && (
                <button className={styles.userMenuBtn} onClick={() => setMenuOpen(true)}>
                    <UserMenuIcon className={iconoStyles.iconoNavUser} />
                </button>
            )}
            {menuOpen && <NavUser onClose={() => setMenuOpen(false)} />}
        </header>
    )
}

