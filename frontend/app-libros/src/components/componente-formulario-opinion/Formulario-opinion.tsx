import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { servicioOpiniones } from "../../api/servicioOpiniones";
import { servicioUsuarios } from "../../api/servicioUsuarios";
import { RatingInput } from "./RatingInput";
import styles from "./Formulario-opinion.module.css";

import { truncarTexto } from '../../hooks/useTruncar';

import {BotonAtras} from "../componente-boton-atras/Boton-atras"


export const FormularioOpinion = () => {

  const [searchParams] = useSearchParams();

  const { id: id_libro } = useParams<{ id: string}>();
  const title = searchParams.get("title");

  const [puntuacion, setPuntuacion] = useState(0);
  const [valoracion, setValoracion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'exito'; texto: string } | null>(null);

  console.log(id_libro);
  console.log(title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    if (puntuacion === 0) {
      setMensaje({ tipo: 'error', texto: "Selecciona una puntuación" });
      return;
    }
    setEnviando(true);
    try {
      const { user } = await servicioUsuarios.getUsuarioActual();
      const id_usuario = user?.id;
      if (!id_usuario) {
        setMensaje({ tipo: 'error', texto: "Debes iniciar sesión" });
        return;
      }
      await servicioOpiniones.postOpinion({
        id_usuario,
        id_libro: id_libro || "",
        puntuacion,
        valoracion,
      });
      setPuntuacion(0);
      setValoracion("");
      setMensaje({ tipo: 'exito', texto: "Opinión enviada" });
    } catch (error) {
      console.error("Error:", error);
      setMensaje({ tipo: 'error', texto: "Error al enviar la opinión" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.formulario}>
      <div className={styles.contenedor}>
        <div className={styles.header}>
          <BotonAtras/>
          <h2 className={styles.titulo}>Escribir opinión | {truncarTexto(title?.replace(/\+/g, ' '), 5)}</h2>
        </div>
        <div className={styles.contenido}>
          {mensaje && (
            <div className={mensaje.tipo === 'error' ? styles.mensajeError : styles.mensajeExito}>
              {mensaje.texto}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.campos}>
              <div className={styles.campo}>
                <label className={styles.etiqueta}>Puntuación</label>
                <div className={styles.contenedorRating}>
                  <RatingInput value={puntuacion} onChange={setPuntuacion} disabled={enviando} />
                </div>
              </div>
              <div className={styles.campo}>
                <label className={styles.etiqueta}>Tu opinión</label>
                <textarea
                  className={styles.areaTexto}
                  value={valoracion}
                  onChange={(e) => setValoracion(e.target.value)}
                  placeholder="Escribe tu opinión sobre el libro..."
                  rows={5}
                  disabled={enviando}
                />
              </div>
            </div>
            <div className={styles.botonWrap}>
              <button type="submit" className={styles.botonEnviar} disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar opinión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};