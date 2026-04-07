import type { ILectura } from "../types/Lectura";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const servicioLecturas = {
  // Crear lectura
  postLectura: async (datos: {
    id_usuario: string;
    id_libro: string;
    fecha_inicio?: string; 
    fecha_fin?: string;    
    estado: string;
  }): Promise<ILectura | null> => {
    //
    const response = await fetch(`${API_URL}/lecturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      console.error("Error al crear lectura:", response.status, response.statusText);
      return null;
    }

    return (await response.json()) as ILectura;
  },

  // Obtener lecturas por usuario
  getPorUsuario: async (id_usuario: string): Promise<ILectura[]> => {
    const response = await fetch(`${API_URL}/lecturas/usuario/${id_usuario}`);

    if (!response.ok) {
      console.error("Error al obtener lecturas por usuario:", response.status, response.statusText);
      return [];
    }

    return (await response.json()) as ILectura[];
  },

  // Actualizar lectura
  putLectura: async (
    id_lectura: string,
    datos: Partial<Pick<ILectura, "fecha_inicio" | "fecha_fin" | "estado">>
  ): Promise<ILectura | null> => {
    const response = await fetch(`${API_URL}/lecturas/${id_lectura}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      console.error("Error al actualizar lectura:", response.status, response.statusText);
      return null;
    }

    return (await response.json()) as ILectura;
  },

  // Eliminar lectura
  deleteLectura: async (id_lectura: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/lecturas/${id_lectura}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Error al eliminar lectura:", response.status, response.statusText);
      return false;
    }

    return true;
  },
};
