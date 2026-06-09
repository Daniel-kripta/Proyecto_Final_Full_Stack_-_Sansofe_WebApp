import Licencias from "../Assets/Licencias/Licencias"
import { LogoMono } from "../Assets/Logos/Logos"
import { LogoKripta } from "../Assets/Logos/LogosKriptaDev"
import NavFooter from "../Navigators/NavFooter/NavFooter"
import styles from "./Footer.module.css"

export default function Footer(){
    return (
        <footer>
            <div className={styles.oficialFooter} >
                <LogoMono className={styles.logoFooterMono}/>
                <NavFooter />            
                <Licencias />
            </div>
                <a href="https://kripta.dev" target="_blank" rel="noopener noreferrer">
                    <LogoKripta className={styles.logoKripta} />
                </a>
                <div>© 2026 <strong>Kripta.dev</strong>
                <br /><span style={{fontSize: '1.2em'}}>Sansofé</span>
            </div>

        </footer>
    )
}