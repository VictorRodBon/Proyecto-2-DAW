import { createBrowserRouter } from "react-router-dom";
// Importamos tus componentes
import { Login } from "./components/componente-login/Login";
import { Registro } from "./components/componente-registro/Registro";
import { Prueba } from "./components/componente-prueba/Prueba";
import { Pagina404 } from "./components/componente-Pagina404/Pagina404";
import { BuscarLibro } from "./components/componente-buscar-libro/Buscar-libro";
import { Detalle } from "./components/componente-detalle-libro/Detalle-libro";
import { FormularioOpinion } from "./components/componente-formulario-opinion/Formulario-opinion";

export const router = createBrowserRouter([
  
  {
    path: "/",
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