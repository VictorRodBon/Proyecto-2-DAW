import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {servicioUsuarios} from '../../api/servicioUsuarios';
import {servicioLecturas} from '../../api/servicioLecturas';

import type { ILibro } from "../../types";
import styles from "./Libro.module.css";

import {BotonDetalle} from "../componente-boton-detalle/Boton-detalle"

import { truncarTexto } from '../../hooks/useTruncar';

import BookIcon from '@mui/icons-material/Book';
import { Typography } from '@mui/material';

export function Libro({ datos }: { datos: ILibro }) {
  const location = useLocation();

  const [biblioteca, setBiblioteca] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [idLectura, setIdLectura] = useState<string | null>(null);

  const key = datos.key.split("/")[2];
  const authorName = Array.isArray(datos.author_name)
    ? datos.author_name.join(", ")
    : datos.author_name ?? "";

  const queryParams = location.search;

  useEffect(() => {
    async function verificarBiblioteca() {
      const { user } = await servicioUsuarios.getUsuarioActual();
      if (!user) return;

      const lecturas = await servicioLecturas.getPorUsuario(user.id);
      const lecturaExistente = lecturas.find(l => l.id_libro === key);
      
      if (lecturaExistente) {
        setBiblioteca(true);
        setIdLectura(lecturaExistente.id_lectura);
      }
    }
    verificarBiblioteca();
  }, [key]);

  async function manejarBiblioteca() {
    const { user } = await servicioUsuarios.getUsuarioActual();
    if (!user) {
      alert("Debes iniciar sesión para añadir a tu biblioteca");
      return;
    }

    setCargando(true);

    if (biblioteca && idLectura) {
      const eliminado = await servicioLecturas.deleteLectura(idLectura);
      if (eliminado) {
        setBiblioteca(false);
        setIdLectura(null);
      }
    } else {
      const nuevaLectura = await servicioLecturas.postLectura({
        id_usuario: user.id,
        id_libro: key,
        estado: "Pendiente",
      });
      if (nuevaLectura) {
        setBiblioteca(true);
        setIdLectura(nuevaLectura.id_lectura);
      }
    }

    setCargando(false);
  }
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
            <div className={styles.placeholder}>
              <BookIcon color="primary" fontSize="large" />
              <Typography>{truncarTexto(datos.title, 5)}</Typography>
            </div>
          )}
        </div>

        <h2>{truncarTexto(datos.title, 5)}</h2>
        <h4 className={styles.authors}>{truncarTexto(authorName,5)}</h4>
      </div>

      <div className={styles.buttons}>
        <BotonDetalle authorName={authorName} bookKey={key} cover={datos.cover_i} params={queryParams}/>

        <button
          type="button"
          onClick={manejarBiblioteca}
          disabled={cargando}
          className={biblioteca ? styles.esta : styles["no-esta"]}
        >
          {cargando ? "CARGANDO..." : biblioteca ? "ELIMINAR DE BIBLIOTECA" : "AÑADIR A BIBLIOTECA"}
        </button>
      </div>
    </div>
  );
}