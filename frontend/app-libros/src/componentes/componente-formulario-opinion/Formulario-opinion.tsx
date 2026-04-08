import { useState } from "react";
import { useParams } from "react-router-dom";
import { servicioOpiniones } from "../../servicios/servicioOpiniones";
import { servicioUsuarios } from "../../servicios/servicioUsuarios";
import { RatingInput } from "./RatingInput";
export const FormularioOpinion = () => {
  const { id: id_libro } = useParams<{ id: string }>();
  const [puntuacion, setPuntuacion] = useState(0);
  const [valoracion, setValoracion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (puntuacion === 0) {
      alert("Selecciona una puntuación");
      return;
    }
    setEnviando(true);
    try {
      // Obtener ID del usuario de Supabase (implementar según tu auth)
      const { user } = await servicioUsuarios.getUsuarioActual();
      const id_usuario = user?.id;
      if (!id_usuario) {
        alert("Debes iniciar sesión");
        return;
      }
      await servicioOpiniones.postOpinion({
        id_usuario,
        id_libro: id_libro || "",
        puntuacion,
        valoracion,
      });
      // Resetear formulario
      setPuntuacion(0);
      setValoracion("");
      alert("Opinión enviada");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Puntuación:</label>
        <RatingInput value={puntuacion} onChange={setPuntuacion} />
      </div>
      <div>
        <label>Tu opinión:</label>
        <textarea
          value={valoracion}
          onChange={(e) => setValoracion(e.target.value)}
          placeholder="Escribe tu opinión..."
          rows={4}
        />
      </div>
      <button type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : "Enviar opinión"}
      </button>
    </form>
  );
};