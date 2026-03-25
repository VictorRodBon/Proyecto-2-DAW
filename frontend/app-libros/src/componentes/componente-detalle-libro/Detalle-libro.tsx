import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { servicioLibros } from "../../servicios/servicioLibros";
import { useVolver } from "../../hooks/useVolver";

import type { IDetalleLibro } from "../../types/DetalleLibro";
import styles from "./DetalleLibro.module.css";

export function Detalle() {
    const { id, cover } = useParams<{ id: string; cover?: string }>();
    const location = useLocation();
    const { volver } = useVolver();
    const [libro, setLibro] = useState<IDetalleLibro | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);
    const [autores, setAutores] = useState<string>("");

    const autorDesdeBusqueda =
        location.state && typeof (location.state as { authorName?: unknown }).authorName === "string"
            ? ((location.state as { authorName: string }).authorName as string)
            : "";

    const coverUrl = useMemo(() => {
        // Priorizamos la portada que viene en la URL y, si no, usamos la del detalle (si existe).
        const coverIdFromUrl = cover && /^\d+$/.test(cover) ? cover : undefined;
        const coverIdFromApi =
            !coverIdFromUrl && Array.isArray(libro?.covers) && libro?.covers?.[0]
                ? String(libro.covers[0])
                : undefined;
        const coverId = coverIdFromUrl ?? coverIdFromApi;

        return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
    }, [cover, libro?.covers]);

    useEffect(() => {
        if (!id) return;

        // Función interna asíncrona
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);
                const data = await servicioLibros.getData(id);
                setLibro(data);

                // Autor: prioridad al que viene de la búsqueda (para no pedir más).
                if (autorDesdeBusqueda.trim()) {
                    setAutores(autorDesdeBusqueda.trim());
                    return;
                }

                // Si se entra directo, intentamos resolver autores desde la API de works → authors → authors/{id}.json
                const authorKeys =
                    Array.isArray((data as IDetalleLibro)?.authors)
                        ? ((data as IDetalleLibro).authors ?? [])
                              .map((a) => a.author?.key)
                              .filter((k): k is string => typeof k === "string" && k.length > 0)
                        : [];

                if (authorKeys.length === 0) {
                    setAutores("");
                    return;
                }

                const nombres = await Promise.all(
                    authorKeys.slice(0, 5).map((k) => servicioLibros.getAutorNombre(k))
                );
                setAutores(
                    nombres
                        .filter((n): n is string => typeof n === "string" && !!n.trim())
                        .join(", ")
                );
            } catch (error) {
                console.error("Error cargando libro:", error);
                setError("No se pudieron cargar los detalles del libro.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [id, autorDesdeBusqueda]); // Se ejecuta cada vez que el ID cambie

    if (cargando) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.skeletonLine} style={{ width: "40%" }} />
                        <div className={styles.skeletonLine} style={{ width: "70%" }} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.skeletonCover} />
                        <div className={styles.skeletonBlock}>
                            <div className={styles.skeletonLine} style={{ width: "90%" }} />
                            <div className={styles.skeletonLine} style={{ width: "85%" }} />
                            <div className={styles.skeletonLine} style={{ width: "60%" }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <button type="button" className={styles.backLink} onClick={volver}>
                            ← Volver
                        </button>
                        <h1 className={styles.title}>Detalle del libro</h1>
                    </div>
                    <p className={styles.error}>{error}</p>
                </div>
            </div>
        );
    }

    if (!libro) {
        return (
            <div className={styles.page}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <button type="button" className={styles.backLink} onClick={volver}>
                            ← Volver
                        </button>
                        <h1 className={styles.title}>Detalle del libro</h1>
                    </div>
                    <p className={styles.muted}>No se encontró información del libro.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <button type="button" className={styles.backLink} onClick={volver}>
                        ← Volver
                    </button>
                    <h1 className={styles.title}>{libro.title}</h1>
                </div>

                <div className={styles.content}>
                    <div className={styles.coverCol}>
                        {coverUrl && !imgError ? (
                            <img
                                className={styles.cover}
                                src={coverUrl}
                                alt={`Portada de ${libro.title}`}
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className={styles.coverFallback} aria-label="Sin portada disponible">
                                <span className={styles.coverFallbackText}>Sin portada</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoCol}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Descripción</h2>
                            <p className={styles.description}>
                                {typeof libro.description === "string"
                                    ? libro.description
                                    : libro.description?.value || "Sin descripción disponible."}
                            </p>
                        </div>

                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Primera publicación</span>
                                <span className={styles.metaValue}>
                                    {libro.first_publish_date ?? "—"}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Autor</span>
                                <span className={styles.metaValue}>
                                    {autores.trim() ? autores : "—"}
                                </span>
                            </div>
                        </div>

                        {Array.isArray(libro.subject_places) && libro.subject_places.length > 0 ? (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>Lugares</h2>
                                <div className={styles.chips}>
                                    {libro.subject_places.slice(0, 12).map((p) => (
                                        <span key={p} className={styles.chip}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}