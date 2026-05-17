import type { IOpinion } from "../../types/Opinion";
import { OpinionListada } from "../componente-opinion-listada/Opinion-listada";
import styles from "./Lista-opiniones.module.css";


interface Props {
    opiniones: IOpinion[];
    cargando?: boolean;
    coverId?: string;
}

export const ListaOpiniones = ({ opiniones, cargando = false, coverId }: Props) => {
    return (
        <div 
            className={styles.listaOpiniones} 
            role="region" 
            aria-label="Lista de opiniones"
            aria-busy={cargando}
        >
            {cargando ? (
                <p className={styles.loading} role="status" aria-live="polite">Cargando opiniones...</p>
            ) : opiniones.length === 0 ? (
                <p className={styles.noOpiniones}>Aún no hay opiniones para este libro.</p>
            ) : (
                opiniones.map((opinion) => (
                    <OpinionListada key={opinion.id_opinion} opinion={opinion} coverId={coverId} />
                ))
            )}
        </div>
    );
};