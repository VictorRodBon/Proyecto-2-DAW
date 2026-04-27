import type { IDetalleLibro } from "../../types";
import styles from "./DetalleLibro.module.css";

import {BotonAtras} from "../componente-boton-atras/Boton-atras";

// Definimos la interfaz para evitar el uso de 'any'
interface DetalleContentProps {
    libro: IDetalleLibro;
    autores: string;
    coverUrl: string | null;
    setMostrarOpiniones: (mostrar: boolean) => void;
    mostrarOpiniones: boolean;
    navigate: (path: string) => void;
    id: string;
}

export function DetalleContent({ 
    libro, 
    autores, 
    coverUrl, 
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
                    <BotonAtras />
                    <button 
                        type="button" 
                        className={styles.opinionesToggle} 
                        onClick={() => setMostrarOpiniones(!mostrarOpiniones)}
                    >
                        {mostrarOpiniones ? "Ocultar opiniones" : "Ver opiniones"}
                    </button>
                    <button 
                        type="button" 
                        className={styles.opinionesToggle}
                        onClick={() => navigate(`/addOpinion/${id}?title=${libro.title.replace(/\s/g, '+')}`)}
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

                    {/* Publicación y Géneros */}
                    <div className={styles.metaRow}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Publicación</h2>
                            <p className={styles.description}>
                                {libro.first_publish_date || "Sin información"}
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Géneros</h2>
                            <div className={styles.chips}>
                                {libro.subjects
                                    ?.slice(0, 5)
                                    .map((subject: string, index: number) => (
                                        <span key={index} className={styles.subject}>{subject}</span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}