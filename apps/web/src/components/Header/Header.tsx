import { Link } from "react-router-dom";
import { LogoHeader } from "../Logos/Logos";
import Navbar from "../Navbar/Navbar";
import styles from "./Header.module.css"

export default function Header(){
    return (
        <header>
            <Link to="/">
                <LogoHeader className={styles.logoHeader}/>
            </Link>
            <Navbar />
        </header>
    )
}