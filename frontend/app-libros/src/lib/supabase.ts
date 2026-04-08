import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si alguna variable es undefined, createClient lanzará error aquí mismo
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno de Supabase");
}

console.log("URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);