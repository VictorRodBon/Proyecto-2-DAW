import type { IDetalleLibro } from "../../types";
import styles from "./DetalleLibro.module.css";

// Definimos la interfaz para evitar el uso de 'any'
interface DetalleContentProps {
    libro: IDetalleLibro;
    autores: string;
    coverUrl: string | null;
    volver: () => void;
    setMostrarOpiniones: (mostrar: boolean) => void;
    mostrarOpiniones: boolean;
    navigate: (path: string) => void;
    id: string;
}

export function DetalleContent({ 
    libro, 
    autores, 
    coverUrl, 
    volver, 
    setMostrarOpiniones, 
    mostrarOpiniones, 
    navigate, 
    id 
}: DetalleContentProps) {

    // Helper para renderizar la descripción de forma segura
    const renderDescription = () => {
        if (!libro.description) return "Sin descripción disponible.";
        if (typeof libro.description === "string") return libro.description;
        return libro.description.value || "Sin descripción disponible.";
    };

    return (
        <>
            <div className={styles.header}>
                <div className={styles.buttonsGrp}>
                    <button type="button" className={styles.backLink} onClick={volver}>
                        ← Volver
                    </button>
                    <button 
                        type="button" 
                        className={styles.opinionesToggle} 
                        onClick={() => setMostrarOpiniones(!mostrarOpiniones)}
                    >
                        {mostrarOpiniones ? "Ocultar opiniones" : "Ver opiniones"}
                    </button>
                    <button 
                        type="button" 
                        className={styles.backLink} // Usamos backLink para mantener el estilo visual
                        onClick={() => navigate(`/addOpinion/${id}`)}
                    >
                        Añadir Opinión
                    </button>
                </div>
                <h1 className={styles.title}>{libro.title}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.coverCol}>
                    {/* Contenedor de imagen adaptado para Skeleton */}
                    <div className={styles.cover}>
                        {coverUrl ? (
                            <img 
                                className={styles.cover} 
                                src={coverUrl} 
                                alt={`Portada de ${libro.title}`} 
                                loading="lazy"
                            />
                        ) : (
                            <div className={styles.coverFallback}>
                                <span className={styles.coverFallbackText}>Sin Portada</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.infoCol}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Descripción</h2>
                        <p className={styles.description}>
                            {renderDescription()}
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Autores</h2>
                        <p className={styles.description}>
                            {autores || "Cargando autores..."}
                        </p>
                    </div>

                    {/* MetaGrid para datos adicionales */}
                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Publicación</span>
                            <span className={styles.metaValue}>
                                {libro.first_publish_date || "N/A"}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>ID Obra</span>
                            <span className={styles.metaValueMono}>{id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}