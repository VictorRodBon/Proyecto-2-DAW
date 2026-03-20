// useState para manejar el estado de los campos del formulario y los mensajes de error/correcto
import { useState } from "react";
// Link para navegar entre páginas
// useNavigate para redirigir a otra página después del login exitoso
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [Correcto, setCorrecto] = useState("");

  //validarContrasena para verificar que la contraseña que cumpla esto de momento
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
  //handleSubmit para validar los datos ingresados por el usuario y mostrar mensajes de error o éxito
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setCorrecto("");

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }
    // Validar que el dominio del correo sea uno de los permitidos, aunque creo que mejor que llegue con una validación en el backend también por seguridad
    const dominiosValidos = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];
    const dominio = email.split("@")[1];
    if (!dominiosValidos.includes(dominio)) {
      setError("Dominio de correo no válido");
      return;
    }

    const errorContrasena = validarContrasena(password);
    if (errorContrasena) {
      setError(errorContrasena);
      return;
    }

    setError("");
    console.log("Login:", { email, password });

    setCorrecto("Registro completado correctamente.");
    console.log("Datos enviados:", { email, password });

    //cuando el login es exitoso, se redirige a la página de prueba
    navigate("/prueba");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      {/* //input contiene el valor del estado email y actualiza el estado cada vez que el usuario escribe en el campo, 
      // igual para la contraseña */}
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

      <p>
        ¿No tienes cuenta?
        <Link to="/registro" className="enlaceCrearCuenta">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
