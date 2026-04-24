import type { IOpinion } from "../../types/Opinion";
import { OpinionListada } from "../componente-opinion-listada/Opinion-listada";
import styles from "./Lista-opiniones.module.css";


interface Props {
    opiniones: IOpinion[];
    cargando?: boolean;
}

export const ListaOpiniones = ({ opiniones, cargando = false }: Props) => {
    return (
        <div className={styles.listaOpiniones}>
            {cargando ? (
                <p className={styles.loading}>Cargando opiniones...</p>
            ) : opiniones.length === 0 ? (
                <p className={styles.noOpiniones}>Aún no hay opiniones para este libro.</p>
            ) : (
                opiniones.map((opinion) => (
                    <OpinionListada key={opinion.id_opinion} opinion={opinion} />
                ))
            )}
        </div>
    );
};