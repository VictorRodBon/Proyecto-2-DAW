import type { ILectura } from "@/types/Lectura";

const API_URL = import.meta.env.VITE_API_URL;

export const servicioLecturas = {
  postLectura: async (datos: {
    id_usuario: string;
    id_libro: string;
    fecha_inicio?: string; 
    fecha_fin?: string;    
    estado: string;
  }, options?: { signal?: AbortSignal }): Promise<ILectura | null> => {
    const response = await fetch(`${API_URL}/lecturas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: options?.signal,
    });

    if (!response.ok) {
      console.error("Error al crear lectura:", response.status, response.statusText);
      return null;
    }

    return (await response.json()) as ILectura;
  },

  getPorUsuario: async (id_usuario: string, options?: { signal?: AbortSignal }): Promise<ILectura[]> => {
    const response = await fetch(`${API_URL}/lecturas/usuario/${id_usuario}`, { signal: options?.signal });

    if (!response.ok) {
      console.error("Error al obtener lecturas por usuario:", response.status, response.statusText);
      return [];
    }

    return (await response.json()) as ILectura[];
  },

  putLectura: async (
    id_lectura: string,
    datos: Partial<Pick<ILectura, "fecha_inicio" | "fecha_fin" | "estado">>,
    options?: { signal?: AbortSignal }
  ): Promise<ILectura | null> => {
    const response = await fetch(`${API_URL}/lecturas/${id_lectura}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: options?.signal,
    });

    if (!response.ok) {
      console.error("Error al actualizar lectura:", response.status, response.statusText);
      return null;
    }

    return (await response.json()) as ILectura;
  },

  deleteLectura: async (id_lectura: string, options?: { signal?: AbortSignal }): Promise<boolean> => {
    const response = await fetch(`${API_URL}/lecturas/${id_lectura}`, {
      method: "DELETE",
      signal: options?.signal,
    });

    if (!response.ok) {
      console.error("Error al eliminar lectura:", response.status, response.statusText);
      return false;
    }

    return true;
  },
};
