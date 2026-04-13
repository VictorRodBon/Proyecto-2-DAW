import { useState } from "react";
import { Link } from "react-router-dom";
import { servicioUsuarios } from "../../api/servicioUsuarios";
import styles from "../form.module.css";

export function Registro() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [correcto, setCorrecto] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dominiosValidos = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const dominiosBaneados = ["tempmail.com", "10minutemail.com", "mailinator.com", "yopmail.com"];
  
  const validarContrasena = (pwd: string): string | null => {
    if (pwd.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (!/[A-Z]/.test(pwd))
      return "La contraseña debe tener al menos una mayúscula";
    if (!/[a-z]/.test(pwd))
      return "La contraseña debe tener al menos una minúscula";
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`';]/.test(pwd))
      return "La contraseña debe tener al menos un carácter especial";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCorrecto("");
    // Validaciones locales
    if (!nombreUsuario.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    if (!email.includes("@")) {
      setError("El email debe contener @");
      return;
    }
    
    const domain = email.split("@")[1];
    if (dominiosBaneados.includes(domain)) {
      setError("No se permiten correos temporales.");
      return;
    }
    if (!dominiosValidos.includes(domain)) {
      setError("Dominio no permitido. Usa Gmail, Yahoo u Outlook.");
      return;
    }
    const errorContrasena = validarContrasena(password);
    if (errorContrasena) {
      setError(errorContrasena);
      return;
    }
    if (!confirm) {
      setError("La confirmación de contraseña es obligatoria.");
      return;
    }
    const errorConfirmacion = validarContrasena(confirm);
    if (errorConfirmacion) {
      setError(errorConfirmacion);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    // Registro en Supabase Auth
    setLoading(true);
    const resultado = await servicioUsuarios.registro(email, password, nombreUsuario);
    if (!resultado.success) {
      setError(resultado.error || "Error al registrar");
      setLoading(false);
      return;
    }
    // Registro exitoso
    setCorrecto("Registro completado. Revisa tu email para confirmar.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Crear una cuenta</h2>
      <label>Nombre de usuario:</label>
      <input
        type="text"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
        placeholder="Tu nombre de usuario"
      />
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>Confirmar contraseña:</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {correcto && <p style={{ color: "green" }}>{correcto}</p>}
      <p className={styles.registroP}>
        <Link to="/" className={styles.enlaceVolverLogin}>Volver al login</Link>
      </p>
    </form>
  );
}