import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { servicioLibros } from "../../api/servicioLibros";
import { useVolver } from "../../hooks/useVolver";
import { DetalleContent } from './Detalle-content';
import { Skeleton } from 'boneyard-js/react';
import type { IDetalleLibro } from "../../types";
import styles from "./DetalleLibro.module.css";

import { ListaOpiniones } from "../componente-lista-opiniones-libro/Lista-opiniones";

import '../../bones/registry'

export function Detalle() {
    const { id, cover } = useParams<{ id: string; cover?: string }>();
    const location = useLocation();
    const { volver } = useVolver();
    const [libro, setLibro] = useState<IDetalleLibro | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [autores, setAutores] = useState<string>("");
    const [mostrarOpiniones, setMostrarOpiniones] = useState(false);
    const navigate = useNavigate();

    const libroMock: IDetalleLibro = {
        key: "mock-key-123",
        title: "Título del libro en carga...",
        description: { 
            value: "Esta es una descripción de ejemplo extensa para que el componente Skeleton pueda calcular correctamente el espacio de las líneas de texto." 
        },
        subject_places: ["Lugar A", "Lugar B"],
        covers: [12345],
        first_publish_date: "1 de enero de 2026",
        authors: [{ author: { key: "/authors/OL123A" } }]
    };

    const autorDesdeBusqueda =
        location.state && typeof (location.state as any).authorName === "string"
            ? ((location.state as any).authorName as string)
            : "";

    const coverUrl = useMemo(() => {
        const coverIdFromUrl = cover && /^\d+$/.test(cover) ? cover : undefined;
        const coverIdFromApi = !coverIdFromUrl && libro?.covers?.[0] ? String(libro.covers[0]) : undefined;
        const coverId = coverIdFromUrl ?? coverIdFromApi;
        return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
    }, [cover, libro?.covers]);

    useEffect(() => {
        if (!id) return;
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);
                const data = await servicioLibros.getData(id);
                setLibro(data);

                if (autorDesdeBusqueda.trim()) {
                    setAutores(autorDesdeBusqueda.trim());
                    return;
                }

                const authorKeys = Array.isArray(data?.authors)
                    ? data.authors.map((a: any) => a.author?.key).filter((k: any): k is string => !!k)
                    : [];

                if (authorKeys.length > 0) {
                    const nombres = await Promise.all(
                        authorKeys.slice(0, 5).map((k:string) => servicioLibros.getAutorNombre(k))
                    );
                    setAutores(nombres.filter((n): n is string => !!n?.trim()).join(", "));
                }
            } catch (err) {
                console.error("Error cargando libro:", err);
                setError("No se pudieron cargar los detalles: " + (err instanceof Error ? err.message : String(err)));
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, [id, autorDesdeBusqueda]);

    // Renderizado único: Skeleton gestiona el estado 'loading' internamente
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {error && <div className={styles.error}>{error}</div>}
                
                <Skeleton
                    name="detalle-libro"
                    loading={cargando}
                >
                    <DetalleContent
                        libro={libro || libroMock} 
                        autores={autores || "Cargando..."}
                        coverUrl={coverUrl}
                        volver={volver}
                        setMostrarOpiniones={setMostrarOpiniones}
                        mostrarOpiniones={mostrarOpiniones}
                        navigate={navigate}
                        id={id || ""}
                    />
                </Skeleton>
            </div>
            {mostrarOpiniones && id && (
                <div className={styles.opinionesSection}>
                    <ListaOpiniones id_libro={id} />
                </div>
            )}
            </div>
    );
}