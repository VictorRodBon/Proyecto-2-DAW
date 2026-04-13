import type { IOpinion } from "../../types/Opinion";

import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

export const OpinionListada = ({ opinion }: { opinion: IOpinion }) => {
  return (
    <div>
      <Rating
        value={opinion.puntuacion}
        readOnly
        precision={0.5}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      { opinion.valoracion && <p>{opinion.valoracion}</p> }
    </div>
  );
};