import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Libro } from "../componente-libro/Libro";
import { servicioLibros } from "../../api/servicioLibros";
import type { ILibro } from "../../types";

import { Skeleton } from 'boneyard-js/react';

import '../../bones/registry'

import styles from "./Buscar-libro.module.css";

export function BuscarLibro() {
    const [searchParams, setSearchParams] = useSearchParams();

    const MAX_PAGINAS_URL = 5;

    const parsePositiveInt = (value: string | null, fallback: number) => {
        const parsed = value ? Number(value) : NaN;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };

    const urlBusqueda = (searchParams.get("q") ?? "").trim();
    const urlPagina = Math.min(parsePositiveInt(searchParams.get("page"), 1), MAX_PAGINAS_URL);
    const urlLimit = parsePositiveInt(searchParams.get("limit"), 10);
    const urlAuthor = (searchParams.get("author") ?? "").trim();

    // Estado para el input; la búsqueda activa sale de la URL.
    const [busquedaTitle, setBusquedaTitle] = useState("");
    const [busquedaAuthor, setBusquedaAuthor] = useState("");
    const [cantidad, setCantidad] = useState<number>(10);

    const [libros, setLibros] = useState<ILibro[]>([]);
    const [cargando, setCargando] = useState(false);
    const [hayMasResultados, setHayMasResultados] = useState(false);


    const libroMock: ILibro = {
        key: "mock-key",
        title: "Cargando título...",
        author_name: "autor", 
        cover_i: "",
    };

    useEffect(() => {
        // Sin query, limpiamos la vista.
        if (!urlBusqueda) {
            setLibros([]);
            setBusquedaTitle("");
            setBusquedaAuthor("");
            setHayMasResultados(false);
            return;
        }

        // Mantener UI sincronizada con la URL (cuando se recarga o se vuelve).
        setBusquedaTitle(urlBusqueda);
        setBusquedaAuthor(urlAuthor);
        setCantidad(urlLimit);

        const cargar = async () => {
            setCargando(true);
            try {
                const resultadosAcumulados: ILibro[] = [];
                let ultimoResultados: ILibro[] = [];

                // Reconstruimos la lista acumulada (páginas 1..urlPagina).
                for (let p = 1; p <= urlPagina; p++) {
                    ultimoResultados = await servicioLibros.getByTitle(urlBusqueda, p, urlLimit, urlAuthor);
                    resultadosAcumulados.push(...ultimoResultados);
                }

                setLibros(resultadosAcumulados);
                setHayMasResultados(ultimoResultados.length === urlLimit);
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, [urlBusqueda, urlPagina, urlLimit, urlAuthor]);

    const nuevaBusqueda = async () => {
        const q = busquedaTitle.trim();
        if (!q) {
            setLibros([]);
            setHayMasResultados(false);
            return;
        }

        const author = busquedaAuthor.trim();

        // Solo incluir author en la URL si tiene contenido
        const params: Record<string, string> = {
            q,
            page: "1",
            limit: String(cantidad),
        };

        if (author) {
            params.author = author;
        }

        // Actualizamos URL y dejamos que el efecto recargue los resultados.
        setSearchParams(params, { replace: true });
    };

    // Función para cargar más (mantiene los que ya están)
    const cargarMas = async () => {
        if (!hayMasResultados) return;

        if (urlPagina >= MAX_PAGINAS_URL) return;

        const params: Record<string, string> = {
            q: urlBusqueda,
            page: String(urlPagina + 1),
            limit: String(urlLimit),
        };

        // Mantener el filtro de autor al cargar más resultados
        if (urlAuthor) {
            params.author = urlAuthor;
        }

        setSearchParams(params, { replace: true });
    };

    return (
        <div className={styles.buscador}>
            <div className={styles.controles}>
                <input
                    className={styles.inputTexto}
                    type="text"
                    value={busquedaTitle}
                    onChange={(e) => setBusquedaTitle(e.target.value)}
                    placeholder="Escribe un título..."
                />
                <input
                    className={styles.inputTexto}
                    type="text"
                    value={busquedaAuthor}
                    onChange={(e) => setBusquedaAuthor(e.target.value)}
                    placeholder="Escribe un autor..."
                />
                <input
                    className={styles.botonBuscar}
                    type="button"
                    value="Buscar"
                    onClick={nuevaBusqueda}
                />
                <select
                    className={styles.selectCantidad}
                    name="cantidad" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <main className={styles.resultados}>
                {/* Usamos un array de mocks si está cargando para que el map se ejecute */}
                {(cargando && libros.length === 0
                    ? Array.from({ length: urlLimit }).map((_, i) => ({ ...libroMock, key: `sk-${i}` }))
                    : libros
                ).map((libro) => (
                    <Skeleton
                        key={libro.key}
                        name="tarjeta-libro"
                        loading={cargando && libros.length === 0}
                    >
                        <Libro key={libro.key} datos={libro} />
                    </Skeleton>
                ))}
            </main>
            {libros.length > 0 && hayMasResultados && (
                <div className={styles.cargarMasWrap}>
                    <button className={styles.botonCargarMas} onClick={cargarMas} disabled={cargando}>
                        {cargando ? "Cargando..." : `Cargar ${urlLimit} más`}
                    </button>
                </div>
            )}
        </div>
    );
}