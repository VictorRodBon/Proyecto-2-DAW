import { createBrowserRouter, Navigate } from "react-router-dom";
// Importamos tus componentes
import { Login } from "./componentes/componente-login/Login";
import { Registro } from "./componentes/componente-registro/Registro";
import { Prueba } from "./componentes/componente-prueba/Prueba";
import { Pagina404 } from "./componentes/componente-Pagina404/Pagina404";
import { Search } from "./componentes/componente-search/Search";
import { Detalle } from "./componentes/componente-detalle-libro/Detalle-libro";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registro",
    element: <Registro />,
  },
  {
    path: "/prueba",
    element: <Prueba />,
  },
  {
    path:"search",
    element: <Search />,
  },
  {
    path:"detalle/:id/:cover",
    element: <Detalle />,
  },
  {
    path: "*",
    element: <Pagina404 />,
  }
]);