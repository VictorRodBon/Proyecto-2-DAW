import { useNavigate } from "react-router-dom";
import styles from "./Pagina404.module.css"; // Recomendado usar CSS Modules

export function Pagina404() {
  const navigate = useNavigate();

  function handleVolverAtras(): void {
    navigate(-1);
  }

  function handleIrLogin(): void {
    navigate("/login");
  }

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>¡Ups! Página no encontrada</h2>
        <p className={styles.errorText}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleVolverAtras} 
            className={styles.btnSecondary}
          >
            Volver atrás
          </button>
          <button 
            onClick={handleIrLogin} 
            className={styles.btnPrimary}
          >
            Ir al Login
          </button>
        </div>
      </div>
    </div>
  );
}