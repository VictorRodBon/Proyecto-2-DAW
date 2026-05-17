import { useState } from "react";
import { Link } from "react-router-dom";
import { enviarCorreoRecuperacion } from "../../auth/gestorAutenticacion";
import styles from "../form.module.css";

export function SolicitarRecuperacion() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [correcto, setCorrecto] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCambioEmail(event: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");
    setCorrecto("");

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    const resultado = await enviarCorreoRecuperacion(email);

    if (!resultado.success) {
      setError(resultado.error || "Error al enviar el correo");
      setLoading(false);
      return;
    }

    setCorrecto("Revisa tu correo para restablecer la contraseña");
    setLoading(false);
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form} aria-label="Formulario de recuperación de contraseña">
      <h2>Recuperar contraseña</h2>

      <label htmlFor="email-recup">Email:</label>
      <input
        id="email-recup"
        type="text"
        value={email}
        onChange={handleCambioEmail}
        placeholder="Tu correo electrónico"
        aria-required="true"
      />

      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Enviando..." : "Enviar correo"}
      </button>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {correcto && <p className={styles.success} role="status" aria-live="polite">{correcto}</p>}

      <p>
        <Link to="/login" className={styles.enlaceVolverLogin}>
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
    </div>
  );
}