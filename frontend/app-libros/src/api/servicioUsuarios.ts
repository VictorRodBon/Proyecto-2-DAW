import { supabase } from "../lib/supabase";
import type { IUsuario } from "../types/Usuario";
import type { User, Session } from "@supabase/supabase-js";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    session: Session;
  };
  error?: string;
}
export const servicioUsuarios = {
  // LOGIN - Iniciar sesión
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: { user: data.user!, session: data.session! } };
  },
  // REGISTRO - Crear nueva cuenta
  registro: async (
    email: string,
    password: string,
    nombreUsuario: string
  ): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_usuario: nombreUsuario,
        },
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: { user: data.user!, session: data.session! } };
  },
  // LOGOUT - Cerrar sesión
  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
    localStorage.removeItem("sb-qnwjmetgvbyitgrloosg-auth-token");
  },
  // OBTENER SESIÓN ACTUAL
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },
  // OBTENER USUARIO ACTUAL (del token)
  getUsuarioActual: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },
  // GET /usuarios/me/:id - Obtener de la tabla usuarios (para datos adicionales)
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
  // PATCH /usuarios/me/:id - Actualizar en la tabla usuarios
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