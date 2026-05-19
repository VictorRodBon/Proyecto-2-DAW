import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { cerrarSesionLocal, validarSesion } from "./gestorAutenticacion";

export function RutaProtegida(props: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<"comprobando" | "autorizado" | "rechazado">("comprobando");

  useEffect(() => {
    let activo = true;

    const comprobar = async () => {
      const ok = await validarSesion();
      if (activo) {
        setEstado(ok ? "autorizado" : "rechazado");
      }
    };

    comprobar();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        cerrarSesionLocal();
        setEstado("rechazado");
      }
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  if (estado === "comprobando") {
    return null;
  }

  if (estado === "rechazado") {
    return <Navigate to="/" replace />;
  }

  return props.children;
}
