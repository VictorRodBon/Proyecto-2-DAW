import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { servicioUsuarios } from "../../api/servicioUsuarios";
import { estaAutenticado } from "../../auth/gestorAutenticacion";
import styles from "../form.module.css";

export function Registro() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [correcto, setCorrecto] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dominiosValidos = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];
  const dominiosBaneados = [
    "tempmail.com",
    "10minutemail.com",
    "mailinator.com",
    "yopmail.com",
  ];

  function validarContrasena(pwd: string): string | null {
    if (pwd.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "La contraseña debe tener al menos una mayúscula";
    }
    if (!/[a-z]/.test(pwd)) {
      return "La contraseña debe tener al menos una minúscula";
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`';]/.test(pwd)) {
      return "La contraseña debe tener al menos un carácter especial";
    }
    return null;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setError("");
    setCorrecto("");
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
    setLoading(true);
    const resultado = await servicioUsuarios.registro(
      email,
      password,
      nombreUsuario,
    );
    if (!resultado.success) {
      setError(resultado.error || "Error al registrar");
      setLoading(false);
      return;
    }
    setCorrecto("Registro completado. Revisa tu email para confirmar.");
    setLoading(false);
  }

  useEffect(
    function () {
      const autenticado = estaAutenticado();

      if (autenticado === true) {
        navigate("/search");
      }
    },
    [navigate],
  );

  function handleNombreUsuarioChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setNombreUsuario(event.target.value);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setPassword(event.target.value);
  }

  function handleConfirmChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setConfirm(event.target.value);
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form} aria-label="Formulario de registro">
      <h2>Crear una cuenta</h2>
      <label htmlFor="username-reg">Nombre de usuario:</label>
      <input
        id="username-reg"
        type="text"
        value={nombreUsuario}
        onChange={handleNombreUsuarioChange}
        placeholder="Tu nombre de usuario"
        aria-required="true"
      />
      <label htmlFor="email-reg">Email:</label>
      <input 
        id="email-reg"
        type="email" 
        value={email} 
        onChange={handleEmailChange}
        aria-required="true"
      />
      <label htmlFor="password-reg">Contraseña:</label>
      <input 
        id="password-reg"
        type="password" 
        value={password} 
        onChange={handlePasswordChange}
        aria-required="true"
        aria-describedby="password-hint"
      />
      <span id="password-hint" className={styles.srOnly}>La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un carácter especial</span>
      <label htmlFor="confirm-reg">Confirmar contraseña:</label>
      <input 
        id="confirm-reg"
        type="password" 
        value={confirm} 
        onChange={handleConfirmChange}
        aria-required="true"
      />
      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {correcto && <p className={styles.success} role="status" aria-live="polite">{correcto}</p>}
      <p className={styles.registroP}>
        <Link to="/" className={styles.enlaceVolverLogin}>
          Volver al login
        </Link>
      </p>
      </form>
    </div>
  );
}
