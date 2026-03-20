import { useState } from "react";
import { Link, useNavigate} from "react-router-dom"; 
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
   const [Correcto, setCorrecto] = useState("");

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (!/[A-Z]/.test(pwd)) return "La contraseña debe tener al menos una mayúscula";
    if (!/[a-z]/.test(pwd)) return "La contraseña debe tener al menos una minúscula";
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`';]/.test(pwd))
      return "La contraseña debe tener al menos un carácter especial";
    return null;
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setCorrecto("");

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    const dominiosValidos = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const dominio = email.split("@")[1];
    if (!dominiosValidos.includes(dominio)) {
      setError("Dominio de correo no válido");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setError("");
    console.log("Login:", { email, password });

    setCorrecto("Registro completado correctamente.");
    console.log("Datos enviados:", { email, password });

    navigate("/prueba");
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Entrar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {Correcto && <p style={{ color: "green" }}>{Correcto}</p>}

      <p >
        ¿No tienes cuenta? <Link to="/registro" className="enlaceCrearCuenta"> Crear cuenta</Link>
      </p>
      
    </form>
  );
}