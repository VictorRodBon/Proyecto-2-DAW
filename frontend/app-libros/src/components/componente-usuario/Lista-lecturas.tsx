import type { ILibro } from '../../types/Libro';
import type { ILectura } from '../../types/Lectura';
import { ReadingCard } from './ReadingCard';
import styles from './Lista-lecturas.module.css';

interface Props {
  lecturas: Array<{ lectura: ILectura; libro: ILibro }>;
  alEliminar: (id: string) => void;
  alCambiarEstado: (id: string, nuevoEstado: string) => void;
  cargando?: boolean;
  esPropietario?: boolean;
}


export const ListaLecturas = ({ lecturas, alEliminar, alCambiarEstado, cargando=false, esPropietario=false }: Props) => {
  return (
    <div 
      className={styles.listaLecturas} 
      role="list" 
      aria-label="Lista de lecturas"
      aria-busy={cargando}
    >
      { cargando ? 
      (
        <p className={styles.loading} role="status" aria-live="polite">Cargando lecturas...</p>
      ): lecturas.length===0?(
        <p className={styles.noLecturas}>Aún no se han almacenado lecturas.</p>
      ):(
        lecturas.map((item) => (
          <ReadingCard
            key={item.lectura.id_lectura}
            lectura={item.lectura}
            libro={item.libro}
            alEliminar={alEliminar}
            alCambiarEstado={alCambiarEstado}
            esPropietario={esPropietario}
          />
        ))
      )}
    </div>
  );
};