import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { ILibro } from "../../types";
import styles from "./Libro.module.css";

import { truncarTexto } from '../../hooks/useTruncar';

export function Libro({ datos }: { datos: ILibro }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [biblioteca, setBiblioteca] = useState(false);

  const key = datos.key.split("/")[2];
  const authorName = Array.isArray(datos.author_name)
    ? datos.author_name.join(", ")
    : datos.author_name ?? "";

  const queryParams = location.search;

  return (
    <div className={styles.libro}>
      <div className={styles.main}>
        <div className={styles.imagen}>
          {datos.cover_i ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${datos.cover_i}-M.jpg`}
              alt={`Portada de ${datos.title}`}
            />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>

        <h2>{truncarTexto(datos.title, 5)}</h2>
        <h4 className={styles.authors}>{truncarTexto(authorName,5)}</h4>
      </div>

      <div className={styles.buttons}>
        <button
          type="button"
          onClick={() => {
            navigate(`/detalle/${key}/${datos.cover_i}${queryParams}`, {
              state: { authorName },
            });
          }}
        >
          DETALLE
        </button>

        <button
          type="button"
          onClick={() => setBiblioteca((prev) => !prev)}
          className={biblioteca ? styles.esta : styles["no-esta"]}
        >
          {biblioteca ? "ELIMINAR DE BIBLIOTECA" : "AÑADIR A BIBLIOTECA"}
        </button>
      </div>
    </div>
  );
}