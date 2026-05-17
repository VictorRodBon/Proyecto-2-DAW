import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { servicioUsuarios } from "../../api/servicioUsuarios";
import styles from "../form.module.css";

export const UpdateUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    async function cargarUsuario() {
      if (!id) return;
      
      const usuario = await servicioUsuarios.getPorId(id);
      if (usuario) {
        setNombreUsuario(usuario.nombre_usuario);
        setFotoPreview(usuario.foto_perfil || null);
      }
      setCargandoDatos(false);
    }
    cargarUsuario();
  }, [id]);

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (fotoFile) {
        const usuarioActualizado = await servicioUsuarios.actualizarFotoPerfil(id, fotoFile);
        if (usuarioActualizado) {
          setSuccess("Foto de perfil actualizada");
        } else {
          setError("Error al subir la foto");
        }
      }

      if (nombreUsuario.trim()) {
        const resultado = await servicioUsuarios.putPorId(id, { 
          nombre_usuario: nombreUsuario 
        });
        if (resultado) {
          setSuccess((prev) => prev ? prev + ", nombre actualizado" : "Nombre actualizado");
        }
      }
      
      setTimeout(() => navigate(`/perfil/${id}`), 1500);
    } catch (err) {
      setError("Error al actualizar los datos "+err);
    } finally {
      setLoading(false);
    }
  }

  if (cargandoDatos) {
    return <div className={styles.form} role="status" aria-live="polite">Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} aria-label="Formulario de edición de perfil">
      <h2>Editar perfil</h2>
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img 
          src={fotoPreview || "/avatar-default.svg"} 
          alt="Foto de perfil"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid rgba(99, 102, 241, 0.5)",
            marginBottom: "10px"
          }}
        />
        <label htmlFor="foto-perfil" style={{ display: "block", cursor: "pointer", color: "rgba(99, 102, 241, 0.92)" }}>
          Cambiar foto
          <input 
            id="foto-perfil"
            type="file" 
            accept="image/*" 
            onChange={handleFotoChange} 
            style={{ display: "none" }}
            aria-describedby="foto-hint"
          />
        </label>
        <span id="foto-hint" className="sr-only">Selecciona una imagen para tu foto de perfil</span>
      </div>

      <label htmlFor="nombre-usuario">Nombre de usuario:</label>
      <input 
        id="nombre-usuario"
        type="text" 
        value={nombreUsuario} 
        onChange={(e) => setNombreUsuario(e.target.value)}
        placeholder="Tu nombre de usuario"
        aria-required="true"
      />

      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Actualizando..." : "Guardar cambios"}
      </button>

      {error && <p style={{ color: "rgba(239, 68, 68, 0.92)" }} role="alert">{error}</p>}
      {success && <p style={{ color: "rgba(16, 185, 129, 0.92)" }} role="status" aria-live="polite">{success}</p>}

      <p>
        <Link to={`/perfil/${id}`} className={styles.enlaceVolverLogin}>
          Volver al perfil
        </Link>
      </p>
    </form>
  );
};