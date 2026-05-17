import { useNavigate } from "react-router-dom";
import styles from "./Pagina404.module.css"; // Recomendado usar CSS Modules

import {BotonAtras} from "../componente-boton-atras/Boton-atras"

export function Pagina404() {
  const navigate = useNavigate();


  function handleIrLogin(): void {
    navigate("/login");
  }

  return (
    <div className={styles.errorContainer} role="region" aria-labelledby="error-title">
      <div className={styles.errorContent}>
        <h1 className={styles.errorCode} aria-label="Error 404">404</h1>
        <h2 id="error-title" className={styles.errorTitle}>¡Ups! Página no encontrada</h2>
        <p className={styles.errorText}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className={styles.buttonGroup} role="group" aria-label="Opciones de navegación">
          <BotonAtras/>
          <button 
            onClick={handleIrLogin} 
            className={styles.btnPrimary}
            aria-label="Ir a la página de inicio de sesión"
          >
            Ir al Login
          </button>
        </div>
      </div>
    </div>
  );
}