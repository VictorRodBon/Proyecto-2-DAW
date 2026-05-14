import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { estaAutenticado } from "./gestorAutenticacion";

interface RedirigirSiAutenticadoProps {
  children: ReactNode;
}

export function RedirigirSiAutenticado({ children }: RedirigirSiAutenticadoProps) {
  const autenticado = estaAutenticado();

  if (autenticado === true) {
    return <Navigate to="/search" replace />;
  }

  return children;
}