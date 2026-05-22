
import type { IOpinion } from "@/types/Opinion";

const API_URL = import.meta.env.VITE_API_URL;
export const servicioOpiniones = {
  postOpinion: async (datos: {
    id_usuario: string;
    id_libro: string;
    puntuacion: number;
    valoracion: string;
  }, options?: { signal?: AbortSignal }): Promise<IOpinion | null> => {
    const response = await fetch(`${API_URL}/opiniones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: options?.signal,
    });

    if (!response.ok) {
      console.error("Error al crear opinión:", response.status, response.statusText);
      return null;
    }

    return (await response.json()) as IOpinion;
  },

  getPorLibro: async (id_libro: string, options?: { signal?: AbortSignal }): Promise<IOpinion[]> => {
    const response = await fetch(`${API_URL}/opiniones/libro/${id_libro}`, { signal: options?.signal });

    if (!response.ok) {
      console.error("Error al obtener opiniones por libro:", response.status, response.statusText);
      return [];
    }

    return (await response.json()) as IOpinion[];
  },

  getPorUsuario: async (id_usuario: string, options?: { signal?: AbortSignal }): Promise<IOpinion[]> => {
    const response = await fetch(`${API_URL}/opiniones/usuario/${id_usuario}`, { signal: options?.signal });

    if (!response.ok) {
      console.error("Error al obtener opiniones por usuario:", response.status, response.statusText);
      return [];
    }

    return (await response.json()) as IOpinion[];
  },

  putOpinion: async (
    id_opinion: number,
    datos: Partial<Pick<IOpinion, "puntuacion" | "valoracion">>,
    options?: { signal?: AbortSignal }
  ): Promise<IOpinion | null> => {
    const response = await fetch(`${API_URL}/opiniones/${id_opinion}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: options?.signal,
    });

    if (!response.ok) {
      console.error("Error al actualizar opinión:", response.status, response.statusText);
      return null;
    }

    return (await response.json()) as IOpinion;
  },

  deleteOpinion: async (id_opinion: number, options?: { signal?: AbortSignal }): Promise<boolean> => {
    const response = await fetch(`${API_URL}/opiniones/${id_opinion}`, {
      method: "DELETE",
      signal: options?.signal,
    });

    if (!response.ok) {
      console.error("Error al eliminar opinión:", response.status, response.statusText);
      return false;
    }

    return true;
  },
};