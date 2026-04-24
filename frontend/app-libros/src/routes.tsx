import { createBrowserRouter } from "react-router-dom";
import { Login } from "./components/componente-login/Login";
import { Registro } from "./components/componente-registro/Registro";
import { Pagina404 } from "./components/componente-Pagina404/Pagina404";
import { BuscarLibro } from "./components/componente-buscar-libro/Buscar-libro";
import { Detalle } from "./components/componente-detalle-libro/Detalle-libro";
import { FormularioOpinion } from "./components/componente-formulario-opinion/Formulario-opinion";
import { Perfil } from "./components/componente-usuario/UserSection";
import { LayoutPrincipal } from "./components/componente-layout/Layout";
import { RutaProtegida } from "./auth/RutaProtegida";
import { RedirigirSiAutenticado } from "./auth/RedirigirSiAutenticado";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RedirigirSiAutenticado>
        <Login />
      </RedirigirSiAutenticado>
    ),
  },
  {
    path: "/login",
    element: (
      <RedirigirSiAutenticado>
        <Login />
      </RedirigirSiAutenticado>
    ),
  },
  {
    path: "/registro",
    element: (
      <RedirigirSiAutenticado>
        <Registro />
      </RedirigirSiAutenticado>
    ),
  },
  {
    element: (
      <RutaProtegida>
        <LayoutPrincipal />
      </RutaProtegida>
    ),
    children: [
      {
        path: "search",
        element: <BuscarLibro />,
      },
      {
        path: "detalle/:id/:cover",
        element: <Detalle />,
      },
      {
        path: "addOpinion/:id",
        element: <FormularioOpinion />,
      },
    ],
  },
  {
    path: "perfil",
    element: (
      <RutaProtegida>
        <Perfil nombreAplicacion="Mi Biblioteca de Libros" />
      </RutaProtegida>
    ),
  },
  {
    path: "*",
    element: <Pagina404 />,
  },
]);