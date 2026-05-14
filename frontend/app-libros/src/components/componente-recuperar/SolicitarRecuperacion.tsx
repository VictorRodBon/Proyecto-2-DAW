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
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Recuperar contraseña</h2>

      <label>Email:</label>
      <input
        type="text"
        value={email}
        onChange={handleCambioEmail}
        placeholder="Tu correo electrónico"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar correo"}
      </button>

      {error && <p style={{ color: "rgba(239, 68, 68, 0.92)" }}>{error}</p>}
      {correcto && <p style={{ color: "rgba(16, 185, 129, 0.92)" }}>{correcto}</p>}

      <p>
        <Link to="/login" className={styles.enlaceCrearCuenta}>
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  );
}