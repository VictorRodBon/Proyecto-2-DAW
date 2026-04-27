import { useState } from "react";
import type { ILibro } from '../../types/Libro';
import type { ILectura, } from '../../types/Lectura';
import { servicioLecturas } from '../../api/servicioLecturas';
import styles from './ReadingCard.module.css';

interface ReadingCardProps {
  lectura: ILectura;
  libro: ILibro;
  alEliminar: (id: string) => void;
  alCambiarEstado: (id: string, nuevoEstado: string) => void;
  esPropietario?: boolean;
}

const ESTADOS = ['Pendiente', 'Leyendo', 'Terminado', 'Abandonado'];

export function ReadingCard({ lectura, libro, alEliminar, alCambiarEstado, esPropietario=false }: ReadingCardProps) {

  const [cargando, setCargando] = useState(false);
  
  function manejarEliminar(): void {
    alEliminar(lectura.id_lectura);
    servicioLecturas.deleteLectura(lectura.id_lectura);
  }

  async function manejarCambioEstado(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
    const nuevoEstado = e.target.value;
    if (nuevoEstado === lectura.estado) return;

    setCargando(true);
    await alCambiarEstado(lectura.id_lectura, nuevoEstado);
    setCargando(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={libro.cover_i ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg` : 'https://via.placeholder.com/200x300?text=Sin+Portada'} 
          alt={libro.title}
          className={styles.image}
        />
        <select
          className={styles.statusSelect}
          value={lectura.estado}
          onChange={manejarCambioEstado}
          disabled={cargando || !esPropietario}
        >
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{libro.title}</h3>
        <p className={styles.author}><span></span>{libro.author_name}</p>
        <div className={styles.divider}></div>
        {lectura.fecha_fin && (
          <p className={styles.dateInfo}>
            Finalizado: {lectura.fecha_fin}
          </p>
        )}
{esPropietario &&
          <button onClick={manejarEliminar} className={styles.deleteBtn}>Eliminar de biblioteca</button>
        }
        <button
          onClick={() => window.location.href = `/detalle/${libro.key}/${libro.cover_i}`}
          className={styles.detailBtn}
        >
          VER DETALLE
        </button>

      </div>
    </div>
  );
}
