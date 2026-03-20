// useState para manejar el estado de los campos del formulario y los mensajes de error/correcto
import { useState } from "react";
// Link para navegar entre páginas 
import { Link, useNavigate } from "react-router-dom";
import "../form.css";

export function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [Correcto, setCorrecto] = useState("");
  const navigate = useNavigate();

  const dominiosValidos = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  
  const dominiosBaneados = ["tempmail.com", "10minutemail.com", "mailinator.com", "yopmail.com"];
  //handleSubmit para validar los datos ingresados por el usuario y mostrar mensajes de error o éxito
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setCorrecto("");


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


    setCorrecto("Registro completado correctamente. Redirigiendo a login...");
    // información que se enviaría al backend para el registro del usuario de momento nada
    console.log("Datos enviados:", { email, password });
    //para a login, pero que se vea el mensaje de registro correcto antes de redirigir.
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };
//input contiene el valor del estado email y actualiza el estado cada vez que el usuario escribe en el campo
//lo mismo para el campo de contraseña y confirmación de contraseña
//el onChange actualiza el estado cada vez que el usuario escribe en el campo,
// cogiendo el valor del input que pasa por la validacion y asignándolo al estado correspondiente(error o correcto), 

return (
  <form onSubmit={handleSubmit} className="form">
    <h2>Crear una cuenta</h2>

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

     <p className="registro-p">
      <Link to="/login" className="enlaceVolverLogin">Volver al login</Link>
    </p>
  </form>
);
}
