import type { ILibro } from '../../types/Libro';
import type { ILectura } from '../../types/Lectura';
import { ReadingCard } from './ReadingCard';
import styles from './Lista-lecturas.module.css';

interface Props {
  lecturas: Array<{ lectura: ILectura; libro: ILibro }>;
  alEliminar: (id: string) => void;
  alCambiarEstado: (id: string, nuevoEstado: string) => void;
}

export const ListaLecturas = ({ lecturas, alEliminar, alCambiarEstado }: Props) => {
  return (
    <div className={styles.listaLecturas}>
      <h2 className={styles.titulo}>Últimas lecturas</h2>
      {lecturas.map((item) => (
        <ReadingCard
          key={item.lectura.id_lectura}
          lectura={item.lectura}
          libro={item.libro}
          alEliminar={alEliminar}
          alCambiarEstado={alCambiarEstado}
        />
      ))}
    </div>
  );
};