import type { IOpinion } from "../../types/Opinion";

import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import styles from "./Opinion-listada.module.css";

export const OpinionListada = ({ opinion }: { opinion: IOpinion }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Rating
          value={opinion.puntuacion}
          readOnly
          precision={0.5}
          sx={{ color: "rgba(99, 102, 241, 0.95)" }}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon style={{ opacity: 0.45 }} fontSize="inherit" />}
        />
      </div>
      {opinion.valoracion && <p className={styles.valoracion}>{opinion.valoracion}</p>}
    </div>
  );
};
// El componente OpinionListada muestra una opinión individual con su puntuación y valoración. Se utiliza el componente Rating de Material-UI para mostrar la puntuación de forma visual con estrellas. 
// La valoración se muestra como texto debajo de las estrellas.  
// Recibe un objeto opinion de tipo IOpinion y renderiza y lo renderiza