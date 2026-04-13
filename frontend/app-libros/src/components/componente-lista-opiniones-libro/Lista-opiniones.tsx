import { servicioOpiniones } from "../../api/servicioOpiniones";
import { useState, useEffect } from "react";
import type { IOpinion } from "../../types/Opinion";
import {OpinionListada} from "../componente-opinion-listada/Opinion-listada";


//import styles from "./Lista-opiniones.module.css";

export const ListaOpiniones = ({ id_libro }: { id_libro: string }) => {
    
    const [opiniones, setOpiniones] = useState<IOpinion[]>([]);
    
    useEffect(() => {
        const cargarOpiniones = async () => {
            const opiniones = await servicioOpiniones.getPorLibro(id_libro);
            setOpiniones(opiniones);
        }
        cargarOpiniones();
    }, [id_libro]);

    return(
        <div>
            <h2>OPINIONES</h2>

            {opiniones.map((opinion)=>(
                <OpinionListada key={opinion.id_opinion} opinion={opinion} />
            ))}
        </div>
    )
}