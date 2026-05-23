import type { IDetalleLibro } from "@/types";
import styles from "./DetalleLibro.module.css";

import { BotonAtras } from "@/components/componente-boton-atras/Boton-atras";

import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

import { truncarTexto } from '@/hooks/useTruncar';

import BookIcon from '@mui/icons-material/Book';
import { Typography } from '@mui/material';

import type { IOpinion } from "@/types/Opinion";

// Definimos la interfaz para evitar el uso de 'any'
interface DetalleContentProps {
    libro: IDetalleLibro;
    autores: string;
    coverUrl: string | null;
    setMostrarOpiniones: (mostrar: boolean) => void;
    mostrarOpiniones: boolean;
    navigate: (path: string) => void;
    id: string;
    opiniones: IOpinion[];
}

export function DetalleContent({
    libro,
    autores,
    coverUrl,
    setMostrarOpiniones,
    mostrarOpiniones,
    navigate,
    id,
    opiniones
}: DetalleContentProps) {


    const renderDescription = () => {
        if (!libro.description) return "Sin descripción disponible.";
        if (typeof libro.description === "string") return libro.description;
        return libro.description.value || "Sin descripción disponible.";
    };

    const obtenerMediaOpiniones = (): number => {
        if (!opiniones || opiniones.length === 0) {
            return 0; 
        }
        
        const sumaTotal = opiniones.reduce((acumulado, opinion) => {
            return acumulado + opinion.puntuacion; 
        }, 0);
        const media = sumaTotal / opiniones.length;
        return Math.round(media * 10) / 10;
    };

    const media = obtenerMediaOpiniones()

    return (
        <>
            <div className={styles.header}>
                <div className={styles.buttonsGrp} role="group" aria-label="Opciones del libro">
                    <BotonAtras />
                    <button
                        type="button"
                        className={styles.opinionesToggle}
                        onClick={() => setMostrarOpiniones(!mostrarOpiniones)}
                        aria-expanded={mostrarOpiniones}
                        data-testid="btn-ver-opiniones"
                    >
                        {mostrarOpiniones ? "Ocultar opiniones" : "Ver opiniones"}
                    </button>
                    <button
                        type="button"
                        className={styles.opinionesToggle}
                        onClick={() => navigate(`/addOpinion/${id}?title=${libro.title.replace(/\s/g, '+')}`)}
                        aria-label="Añadir opinión sobre este libro"
                    >
                        Añadir Opinión
                    </button>
                </div>
                <h1 className={styles.title}>{libro.title}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.coverCol}>
                    <div className={styles.cover}>
                        {coverUrl ? (
                            <img
                                className={styles.cover}
                                src={coverUrl}
                                alt={`Portada de ${libro.title}`}
                                loading="lazy"
                            />
                        ) : (
                            <div className={styles.placeholder}>
                                <BookIcon sx={{ fontSize: '4.5rem', color: 'primary.main' }} />
                                <Typography variant="body1" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                                    {truncarTexto(libro.title, 5)}
                                </Typography>
                            </div>
                        )}
                    </div>
                    <div className={styles.media} onClick={() => setMostrarOpiniones(!mostrarOpiniones)}>
                        Valoración de otros lectores
                        <Rating
                            value={media}
                            readOnly
                            precision={0.5}
                            aria-label={`Puntuación: ${media} estrellas`}
                            sx={{ color: "rgba(99, 102, 241, 0.95)" }}
                            icon={<StarIcon fontSize="inherit" />}
                            emptyIcon={<StarIcon style={{ opacity: 0.45 }} fontSize="inherit" />}
                        />

                    </div>
                </div>

                <div className={styles.infoCol}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Descripción</h2>
                        <p className={styles.description}>
                            {renderDescription()}
                        </p>
                    </div>

                    <div
                        className={styles.section}
                        onClick={() => {
                            navigate(`/search?q=&page=1&limit=10&author=${autores}`)
                        }}>
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