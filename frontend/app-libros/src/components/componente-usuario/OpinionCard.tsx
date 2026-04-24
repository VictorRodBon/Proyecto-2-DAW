import type { IOpinion } from '../../types/Opinion';
import styles from './OpinionCard.module.css';

interface OpinionCardProps {
  opinion: IOpinion;
}

export function OpinionCard({ opinion }: OpinionCardProps) {
  function renderarEstrellas(): string {
    return '⭐'.repeat(opinion.puntuacion);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{opinion.valoracion}</h3>
        <div className={styles.ratingContainer}>
          <span className={styles.stars}>{renderarEstrellas()}</span>
          <div className={styles.ratingInfo}>
            <span className={styles.ratingLabel}>Calificación</span>
            <span className={styles.ratingValue}>({opinion.puntuacion}/5)</span>
          </div>
        </div>
        <div className={styles.dateSection}>
          <p className={styles.date}> {opinion.fecha_creacion}</p>
        </div>
      </div>
    </div>
  );
}
