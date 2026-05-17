import {useNavigate} from "react-router-dom";

import styles from "./BotonAtras.module.css";

export const BotonAtras = () => {
    const navigate = useNavigate();

    return(
        <button type="button" className={styles.backLink} onClick={()=>navigate(-1)} aria-label="Volver a la página anterior">
            ← Volver
        </button>
    )
}