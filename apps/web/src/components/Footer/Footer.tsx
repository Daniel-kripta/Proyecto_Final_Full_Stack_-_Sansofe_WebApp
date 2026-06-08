import { LogoCC, LogoPD } from "../Assets/LogosLicencias"
import { LogoMono } from "../Logos/Logos"
import NavFooter from "../NavFooter/NavFooter"
import styles from "./Footer.module.css"

export default function Footer(){
    return (
        <footer>
            <LogoMono className={styles.logoFooterMono}/>
            <NavFooter />
            <div className={styles.licencias}>
                <div className={styles.licenciasGrid}>
                    <div className={styles.licenciaItem}>
                        <LogoPD className={styles.licenciaLogo} />
                        <span><strong>Contenido histórico</strong> — Dominio público</span>
                    </div>
                    <div className={styles.licenciaItem}>
                        <LogoCC className={styles.licenciaLogo} />
                        <span><strong>Plataforma</strong> — Libre para uso no comercial, los derivados heredan esta licencia</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}