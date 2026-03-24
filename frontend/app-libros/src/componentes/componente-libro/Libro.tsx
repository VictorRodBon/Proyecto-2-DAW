import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";


import type { ILibro } from "../../types";
import styles from "./Libro.module.css";

const truncarTexto = (texto: string | string[] | undefined, limite: number) => {
    if (!texto) return "";
    
    // Si es un array (como suele ser author_name), lo convertimos a string
    const stringBase = Array.isArray(texto) ? texto.join(", ") : texto;

    const palabras = stringBase.split(" ");
    if (palabras.length <= limite) return stringBase;

    return palabras.slice(0, limite).join(" ") + "...";

    
};

export function Libro({ datos }: { datos: ILibro }) {

    const navigate = useNavigate();
    const location = useLocation();
    const [biblioteca,setBiblioteca]=useState(false);

    const key=datos.key.split("/")[2];

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
                        /* Aquí podrías poner tu SVG del libro abierto que creamos antes */
                        <div className={styles.placeholder}>No Image</div>
                    )}
                </div>
                
                <h2>{truncarTexto(datos.title, 5)}</h2>
                
                <h4>{datos.author_name}</h4>
            </div>

            <div className={styles.buttons}>
                <button
                    type="button"
                    onClick={() => {
                        navigate(`/detalle/${key}/${datos.cover_i}`, {
                            state: {
                                from: location.pathname + location.search,
                                authorName: Array.isArray(datos.author_name)
                                    ? datos.author_name.join(", ")
                                    : (datos.author_name ?? ""),
                            },
                        });
                    }}
                >
                    DETALLE
                </button>
                <button 
                    type="button" 
                    onClick={()=>setBiblioteca(!biblioteca)} 
                    className={biblioteca ? styles.esta : styles["no-esta"]}
                >
                    {biblioteca ? "ELIMINAR DE BIBLIOTECA" : `AÑADIR A BIBLIOTECA`}
                </button>
            </div>
        </div>
    );
}