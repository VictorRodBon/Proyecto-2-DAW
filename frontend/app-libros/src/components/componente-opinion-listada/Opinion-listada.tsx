import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { IOpinion } from "../../types/Opinion";
import type { IUsuario } from "../../types/Usuario";
import { servicioUsuarios } from '../../api/servicioUsuarios';
import { servicioLibros } from '../../api/servicioLibros';

import { truncarTexto } from "../../hooks/useTruncar";


import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import styles from "./Opinion-listada.module.css";

interface OpinionListadaProps {
  opinion: IOpinion;
  nombreUsuario?: string;
  coverId?: string;
}

export const OpinionListada = ({ opinion, nombreUsuario, coverId }: OpinionListadaProps) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [cover, setCover] = useState<string | undefined>(coverId);
  const [nombreLibro, setNombreLibro] = useState<string | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    async function obtenerUsuario() {
      const datosUsuario = await servicioUsuarios.getPorId(opinion.id_usuario);
      if (datosUsuario) {
        setUsuario(datosUsuario);
      }
    }
    obtenerUsuario();
  }, [opinion.id_usuario]);

  useEffect(() => {
    async function obtenerCoverYNombre() {
      if (location.pathname.startsWith('/perfil')) {
        const libro = await servicioLibros.getData(opinion.id_libro);
        if (libro?.covers?.[0]) {
          setCover(String(libro.covers[0]));
        }
        if (libro?.title) {
          setNombreLibro(libro.title);
        }
      }
    }
    obtenerCoverYNombre();
  }, [opinion.id_libro, location.pathname]);

  const nombreAMostrar = location.pathname.startsWith('/perfil') 
    ? (nombreLibro || opinion.id_libro) 
    : (nombreUsuario || usuario?.nombre_usuario || opinion.id_usuario);
  const coverUrl = cover || coverId || '';

  return (
    <article className={styles.container} aria-label={`Opinión de ${nombreAMostrar}`}>
      <div className={styles.header}>
        {location.pathname.startsWith('/perfil') ? (
          <Link to={`/detalle/${opinion.id_libro}/${coverUrl}`}>
            {truncarTexto(nombreAMostrar, 3)}
          </Link>
        ) : (
          <div className={styles.userInfo}>
            <img 
              src={usuario?.foto_perfil || "/avatar-default.svg"} 
              alt="" 
              className={styles.userImage}
            />
            <Link to={`/perfil/${opinion.id_usuario}`}>
              {nombreAMostrar}
            </Link>
          </div>
        )}
        <Rating
          value={opinion.puntuacion}
          readOnly
          precision={0.5}
          aria-label={`Puntuación: ${opinion.puntuacion} estrellas`}
          sx={{ color: "rgba(99, 102, 241, 0.95)" }}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon style={{ opacity: 0.45 }} fontSize="inherit" />}
        />
      </div>
      {opinion.valoracion && <p className={styles.valoracion}>{opinion.valoracion}</p>}
    </article>
  );
};