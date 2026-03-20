import { useState } from "react";
import { Link } from "react-router-dom"; 
import "./registro.css";

export function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [Correcto, setCorrecto] = useState("");

  const dominiosValidos = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  //
  const dominiosBaneados = ["tempmail.com", "10minutemail.com", "mailinator.com", "yopmail.com"];

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setCorrecto("");

    // Validación básica
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

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Si todo está bien
    setCorrecto("Registro completado correctamente.");
    console.log("Datos enviados:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>

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

      <label>Confirmar contraseña:</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button type="submit">Registrarse</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {Correcto && <p style={{ color: "green" }}>{Correcto}</p>}

       <p>
        <Link to="/login" className="enlaceVolverLogin">Volver al login</Link>
      </p>
    </form>
  );
}
