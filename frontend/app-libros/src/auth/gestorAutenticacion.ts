const LLAVE_TOKEN = "sb-qnwjmetgvbyitgrloosg-auth-token";

export function obtenerTokenAutenticacion(): string | null {
  const token = localStorage.getItem(LLAVE_TOKEN);

  if (token === null) {
    return null;
  }

  return token;
}


export function estaAutenticado(): boolean {
  const token = obtenerTokenAutenticacion();

  if (token === null) {
    return false;
  }

  if (token.trim() === "") {
    return false;
  }

  return true;
}

import { supabase } from '../lib/supabase';

export async function enviarCorreoRecuperacion(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nueva-contrasena`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}