import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import styles from "../form.module.css";

export function NuevaContrasena() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [correcto, setCorrecto] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");
    setCorrecto("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setCorrecto("Contraseña actualizada correctamente");
    setLoading(false);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Nueva contraseña</h2>

      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
      />

      <label>Confirmar contraseña:</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar contraseña"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar contraseña"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {correcto && <p className={styles.success}>{correcto}</p>}

      <p>
        <Link to="/login" className={styles.enlaceVolverLogin}>
          Volver al inicio de sesión
        </Link>
      </p>
      </form>
    </div>
  );
}