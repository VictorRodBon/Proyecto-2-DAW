import { createBrowserRouter, Navigate } from "react-router-dom";
// Importamos tus componentes
import { Login } from "./componentes/componente-login/Login";
import { Registro } from "./componentes/componente-registro/Registro";
import { Prueba } from "./componentes/componente-prueba/Prueba";
import { Pagina404 } from "./componentes/componente-Pagina404/Pagina404";
import { BuscarLibro } from "./componentes/componente-buscar-libro/Buscar-libro";
import { Detalle } from "./componentes/componente-detalle-libro/Detalle-libro";
import { FormularioOpinion } from "./componentes/componente-formulario-opinion/Formulario-opinion";

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
    element: <BuscarLibro />,
  },
  {
    path:"detalle/:id/:cover",
    element: <Detalle />,
  },
  {
    path:"addOpinion/:id",
    element: <FormularioOpinion />,

  },
  {
    path: "*",
    element: <Pagina404 />,
  }
]);