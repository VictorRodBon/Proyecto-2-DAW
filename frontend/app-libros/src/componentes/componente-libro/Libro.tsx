import type { ILibro } from "../../types";
import styles from "./Libro.module.css"; // Recomendado usar CSS Modules

const truncarTexto = (texto: string | string[] | undefined, limite: number) => {
    if (!texto) return "";
    
    // Si es un array (como suele ser author_name), lo convertimos a string
    const stringBase = Array.isArray(texto) ? texto.join(", ") : texto;

    const palabras = stringBase.split(" ");
    if (palabras.length <= limite) return stringBase;

    return palabras.slice(0, limite).join(" ") + "...";
};

export function Libro({ datos }: { datos: ILibro }) {
    return (
        <div className={styles.libro}>
            <div className={styles.imagen}>
                {datos.cover_i ? (
                    <img
                        src={`https://covers.openlibrary.org/b/id/${datos.cover_i}-M.jpg`}
                        alt={`Portada de ${datos.title}`}
                    />
                ) : (
                    /* Aquí podrías poner tu SVG del libro abierto que creamos antes */
                    <div className={styles.placeholder}>No Image</div>
                )}
            </div>
            
            <h2>{truncarTexto(datos.title, 10)}</h2>
            
            <h4>{datos.author_name}</h4>
        </div>
    );
}