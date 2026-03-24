import { useState } from "react";
import { Libro } from "../componente-libro/Libro";
import { servicioLibros } from "../../servicios/servicioLibros";
import type { ILibro } from "../../types";

import styles from "./Search.module.css";

export function Search() {
    const [busqueda, setBusqueda] = useState("");
    const [libros, setLibros] = useState<ILibro[]>([]);
    const [pagina, setPagina]= useState(1);
    const [cantidad, setCantidad]= useState<number>(10);
    const [cantidadActiva, setCantidadActiva] = useState<number>(10);
    const [cargando,setCargando]=useState(false);
    const [hayMasResultados, setHayMasResultados] = useState(false);


    const nuevaBusqueda = async () => {
        const cantidadBusqueda = cantidad;
        setCargando(true);
        setPagina(1); // Resetear a la primera página
        setCantidadActiva(cantidadBusqueda);
        const resultados = await servicioLibros.getByTitle(busqueda, 1, cantidadBusqueda);
        setLibros(resultados);
        setHayMasResultados(resultados.length === cantidadBusqueda);
        setCargando(false);
    };

    // Función para cargar más (mantiene los que ya están)
    const cargarMas = async () => {
        if (!hayMasResultados) return;
        setCargando(true);
        const siguientePagina = pagina + 1;
        const nuevosLibros = await servicioLibros.getByTitle(busqueda, siguientePagina, cantidadActiva);
        
        setLibros((prevLibros) => [...prevLibros, ...nuevosLibros]);
        setPagina(siguientePagina);
        setHayMasResultados(nuevosLibros.length === cantidadActiva);
        setCargando(false);
    };

    return (
        <div className={styles.buscador}>
            <div className={styles.controles}>
                <input 
                    className={styles.inputTexto}
                    type="text" 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                    placeholder="Escribe un título..."
                />
                <input 
                    className={styles.botonBuscar}
                    type="button" 
                    value="Buscar" 
                    onClick={nuevaBusqueda} 
                />

                <select 
                    className={styles.selectCantidad}
                    name="cantidad" value={cantidad} onChange={(e)=>setCantidad(Number(e.target.value))}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <main className={styles.resultados}>
                {libros.map((libro) => (
                    <Libro key={libro.key} datos={libro} />
                ))}
            </main>
            {libros.length > 0 && hayMasResultados && (
                <div className={styles.cargarMasWrap}>
                    <button className={styles.botonCargarMas} onClick={cargarMas} disabled={cargando}>
                        {cargando ? "Cargando..." : `Cargar ${cantidadActiva} más`}
                    </button>
                </div>
            )}
        </div>
    );
}