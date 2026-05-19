import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { validarSesion } from "./gestorAutenticacion";

interface RedirigirSiAutenticadoProps {
  children: ReactNode;
}

export function RedirigirSiAutenticado({ children }: RedirigirSiAutenticadoProps) {
  const [estado, setEstado] = useState<"comprobando" | "autenticado" | "anonimo">("comprobando");

  useEffect(() => {
    let activo = true;

    validarSesion().then((ok) => {
      if (activo) {
        setEstado(ok ? "autenticado" : "anonimo");
      }
    });

    return () => {
      activo = false;
    };
  }, []);

  if (estado === "comprobando") {
    return null;
  }

  if (estado === "autenticado") {
    return <Navigate to="/search" replace />;
  }

  return children;
}
