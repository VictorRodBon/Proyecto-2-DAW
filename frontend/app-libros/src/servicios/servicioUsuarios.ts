//hay que cambiar servicioUsuarios, INCOMPLETO
import type { IUsuario } from "../types/Usuario";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const servicioUsuarios = {
    getPorId: async (id: string): Promise<IUsuario | null> => {
        const url = `${API_URL}/usuarios/me/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error("Error al obtener usuario:", response.status, response.statusText);
            return null;
        }

        const data = (await response.json()) as IUsuario;
        return data;
    },

    putPorId: async (
        id: string,
        datos: Partial<Pick<IUsuario, "nombre_usuario" | "estado" | "foto_perfil">>
    ): Promise<IUsuario | null> => {
        const url = `${API_URL}/usuarios/me/${id}`;

        const response = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        if (!response.ok) {
            console.error("Error al actualizar usuario:", response.status, response.statusText);
            return null;
        }

        const data = (await response.json()) as IUsuario;
        return data;
    },
};