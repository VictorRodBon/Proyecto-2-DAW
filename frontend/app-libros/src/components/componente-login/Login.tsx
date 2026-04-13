// useState para manejar el estado de los campos del formulario y los mensajes de error/correcto
import { useState } from "react";
// Link para navegar entre páginas
// useNavigate para redirigir a otra página después del login exitoso
import { Link, useNavigate } from "react-router-dom";
import { servicioUsuarios } from "../../api/servicioUsuarios";
import styles from "../form.module.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [correcto, setCorrecto] = useState("");
  const [loading, setLoading] = useState(false);

  //dominios permitidos para el email
  const dominiosValidos = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];

  //handleSubmit para validar los datos ingresados por el usuario y mostrar mensajes de error o éxito
  const handleSubmit = async (e: React.FormEvent) => {
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

    // Login en Supabase Auth
    setLoading(true);
    const resultado = await servicioUsuarios.login(email, password);
    
    if (!resultado.success) {
      setError(resultado.error || "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    // Login exitoso
    setCorrecto("Sesión iniciada correctamente");
    setLoading(false);
    
    // Redirigir tras un breve delay
    setTimeout(() => {
      navigate("/search");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Iniciar sesión</h2>

      <label>Email:</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Contraseña:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Entrar"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {correcto && <p style={{ color: "green" }}>{correcto}</p>}

      <p >
        ¿No tienes cuenta? <Link to="/registro" className={styles.enlaceCrearCuenta}> Crear cuenta</Link>
      </p>
      
    </form>
  );
}
