import type { IOpinion } from "../../types/Opinion";

export const OpinionListada = ({ opinion }: { opinion: IOpinion }) => {

    // obtener el nombre del usuario y del autor

    return (
        <div>
            <h3>{opinion.id_libro}</h3>
            <p>{opinion.id_usuario}</p>
            <p>{opinion.puntuacion}</p>
            <p>{opinion.valoracion}</p>
        </div>
    )
}