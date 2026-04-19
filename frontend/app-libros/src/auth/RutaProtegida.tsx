
import { Navigate } from "react-router-dom";
import { estaAutenticado } from "./gestorAutenticacion";

export function RutaProtegida(props: { children: any; }) {
  const autenticado = estaAutenticado();

  if (autenticado === false) {
    return <Navigate to="/" replace />;
  }

  return props.children;
}
