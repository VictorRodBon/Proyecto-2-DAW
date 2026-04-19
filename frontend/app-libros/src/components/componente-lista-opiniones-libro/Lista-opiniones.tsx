import { servicioOpiniones } from "../../api/servicioOpiniones";
import { useState, useEffect } from "react";
import type { IOpinion } from "../../types/Opinion";
import { OpinionListada } from "../componente-opinion-listada/Opinion-listada";
import styles from "./Lista-opiniones.module.css";

export const ListaOpiniones = ({ id_libro }: { id_libro: string }) => {
    const [opiniones, setOpiniones] = useState<IOpinion[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarOpiniones = async () => {
            setCargando(true);
            try {
                const opiniones = await servicioOpiniones.getPorLibro(id_libro);
                setOpiniones(opiniones);
            } catch (error) {
                console.error("Error cargando opiniones:", error);
                setOpiniones([]);
            } finally {
                setCargando(false);
            }
        }
        cargarOpiniones();
    }, [id_libro]);

    return (
        <section className={styles.listaOpiniones}>
            <h2 className={styles.titulo}>OPINIONES</h2>

            {cargando ? (
                <p className={styles.loading}>Cargando opiniones...</p>
            ) : opiniones.length === 0 ? (
                <p className={styles.noOpiniones}>Aún no hay opiniones para este libro.</p>
            ) : (
                opiniones.map((opinion) => (
                    <OpinionListada key={opinion.id_opinion} opinion={opinion} />
                ))
            )}
        </section>
    );
}