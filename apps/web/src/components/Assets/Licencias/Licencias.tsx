import { LogoCC, LogoPD } from "./LogosLicencias"
import styles from "./Licencias.module.css"

export default function Licencias(){
    return (
        <div className={styles.licencias}>

            <div>
                <LogoPD className={styles.licenciaLogo} />
                <div><strong>Contenido histórico:</strong><br />Dominio público.</div>
            </div>

            <div>
                <LogoCC className={styles.licenciaLogo} />
                <div><strong>Plataforma:</strong><br />Libre para uso no comercial.<br />Los derivados heredan esta licencia.</div>
            </div>
        </div>
    )
}