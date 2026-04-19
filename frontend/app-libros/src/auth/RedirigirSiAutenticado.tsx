import { Navigate } from "react-router-dom";
import { estaAutenticado } from "./gestorAutenticacion";

export function RedirigirSiAutenticado(props: { children: any; }) {
  const autenticado = estaAutenticado();

  if (autenticado === true) {
    return <Navigate to="/search" replace />;
  }

  return props.children;
}