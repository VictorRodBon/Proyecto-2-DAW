import { supabase } from "@/lib/supabase";

const LLAVE_TOKEN = import.meta.env.LLAVE_TOKEN;

interface SesionAlmacenada {
  access_token?: string;
  expires_at?: number;
}

function obtenerSesionAlmacenada(): SesionAlmacenada | null {
  const raw = localStorage.getItem(LLAVE_TOKEN);
  if (!raw?.trim()) {
    return null;
  }
  try {
    return JSON.parse(raw) as SesionAlmacenada;
  } catch {
    return null;
  }
}

export function obtenerTokenAutenticacion(): string | null {
  return obtenerSesionAlmacenada()?.access_token ?? null;
}

export function cerrarSesionLocal(): void {
  localStorage.removeItem(LLAVE_TOKEN);
}

/** Comprueba solo localStorage: existencia del token y que no haya caducado. */
export function estaAutenticado(): boolean {
  const sesion = obtenerSesionAlmacenada();
  if (!sesion?.access_token?.trim()) {
    return false;
  }
  if (sesion.expires_at && Date.now() / 1000 >= sesion.expires_at) {
    return false;
  }
  return true;
}

/** Valida la sesión con Supabase (token revocado, expirado o inválido). */
export async function validarSesion(): Promise<boolean> {
  if (!estaAutenticado()) {
    await supabase.auth.signOut();
    cerrarSesionLocal();
    return false;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    await supabase.auth.signOut();
    cerrarSesionLocal();
    return false;
  }

  return true;
}

export async function enviarCorreoRecuperacion(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nueva-contrasena`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
