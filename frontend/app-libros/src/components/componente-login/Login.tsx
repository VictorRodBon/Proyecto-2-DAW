// useState para manejar el estado de los campos del formulario y los mensajes de error/correcto
import { useEffect, useState } from "react";
// Link para navegar entre páginas
// useNavigate para redirigir a otra página después del login exitoso
import { Link, useNavigate } from "react-router-dom";
import { servicioUsuarios } from "../../api/servicioUsuarios";
import { estaAutenticado } from "../../auth/gestorAutenticacion";
import styles from "../form.module.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  useEffect(
    function () {
      const autenticado = estaAutenticado();

      if (autenticado === true) {
        navigate("/search");
      }
    },
    [navigate],
  );

  function handleCambioEmail(event: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);
  }

  function handleCambioPassword(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setPassword(event.target.value);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setError("");
    setCorrecto("");

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    const dominio = email.split("@")[1];
    if (!dominiosValidos.includes(dominio)) {
      setError("Dominio de correo no válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const resultado = await servicioUsuarios.login(email, password);

    if (!resultado.success) {
      setError(resultado.error || "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    setCorrecto("Sesión iniciada correctamente");
    setLoading(false);

    setTimeout(function () {
      navigate("/search");
    }, 1000);
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Iniciar sesión</h2>

      <label>Email:</label>
      <input type="text" value={email} onChange={handleCambioEmail} />

      <label>Contraseña:</label>
      <input type="password" value={password} onChange={handleCambioPassword} />

      <button type="submit" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Entrar"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
      {correcto && <p className={styles.success}>{correcto}</p>}

      <span className={styles.enlaceRecuperar}>
        <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
      </span>

      <p className={styles.registroP}>
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className={styles.enlaceCrearCuenta}>
          Crear cuenta
        </Link>
      </p>
    </form>
    </div>
  );
}
