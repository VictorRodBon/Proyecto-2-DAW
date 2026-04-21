import { useVolver } from "../../hooks/useVolver";

import styles from "./BotonAtras.module.css";

export const BotonAtras = () => {
    const { volver } = useVolver();

    return(
        <button type="button" className={styles.backLink} onClick={volver}>
            ← Volver
        </button>
    )
}