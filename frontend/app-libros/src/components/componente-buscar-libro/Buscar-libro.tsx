import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Libro } from "../componente-libro/Libro";
import { servicioLibros } from "../../api/servicioLibros";
import type { ILibro } from "../../types";

import {lista} from "./lista.ts";

import { Skeleton } from 'boneyard-js/react';

import '../../bones/registry'

import styles from "./Buscar-libro.module.css";

export function BuscarLibro() {
    const [searchParams] = useSearchParams();

    const MAX_PAGINAS_URL = 5;

    const parsePositiveInt = (value: string | null, fallback: number) => {
        const parsed = value ? Number(value) : NaN;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };

    const urlBusqueda = (searchParams.get("q") ?? "").trim();
    const urlPagina = Math.min(parsePositiveInt(searchParams.get("page"), 1), MAX_PAGINAS_URL);
    const urlLimit = parsePositiveInt(searchParams.get("limit"), 10);
    const urlAuthor = (searchParams.get("author") ?? "").trim();

    const [libros, setLibros] = useState<ILibro[]>([]);
    const [cargando, setCargando] = useState(false);
    const [hayMasResultados, setHayMasResultados] = useState(false);

    const libroMock: ILibro = {
        key: "mock-key",
        title: "Cargando título...",
        author_name: "autor",
        cover_i: "",
    };

    const busquedaInicial = useMemo(() => {
        if (urlBusqueda) return urlBusqueda;
        const randomIndex = Math.floor(Math.random() * lista.length);
        return lista[randomIndex];
    }, [urlBusqueda]);

    useEffect(() => {
        if (!busquedaInicial) return;
        
        const busqueda=urlBusqueda||busquedaInicial;

        const cargar = async () => {
            setCargando(true);
            try {
                const resultadosAcumulados: ILibro[] = [];
                let ultimoResultados: ILibro[] = [];

                for (let p = 1; p <= urlPagina; p++) {
                    ultimoResultados = await servicioLibros.getByTitle(busqueda, p, urlLimit, urlAuthor);
                    resultadosAcumulados.push(...ultimoResultados);
                }

                setLibros(resultadosAcumulados);
                setHayMasResultados(ultimoResultados.length === urlLimit);
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, [busquedaInicial, urlBusqueda, urlPagina, urlLimit, urlAuthor]);

    const cargarMas = async () => {
        if (!hayMasResultados) return;
        if (urlPagina >= MAX_PAGINAS_URL) return;

        const siguientePagina = urlPagina + 1;
        
        setCargando(true);
        try {
            const nuevosLibros = await servicioLibros.getByTitle(urlBusqueda, siguientePagina, urlLimit, urlAuthor);
            setLibros(prev => [...prev, ...nuevosLibros]);
            setHayMasResultados(nuevosLibros.length === urlLimit);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={styles.buscador}>
            <main className={styles.resultados}>
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