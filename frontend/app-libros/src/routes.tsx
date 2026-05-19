import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const Login = lazy(() => import("@/components/componente-login/Login").then(m => ({ default: m.Login })));
const Registro = lazy(() => import("@/components/componente-registro/Registro").then(m => ({ default: m.Registro })));
const Pagina404 = lazy(() => import("@/components/componente-Pagina404/Pagina404").then(m => ({ default: m.Pagina404 })));
const BuscarLibro = lazy(() => import("@/components/componente-buscar-libro/Buscar-libro").then(m => ({ default: m.BuscarLibro })));
const Detalle = lazy(() => import("@/components/componente-detalle-libro/Detalle-libro").then(m => ({ default: m.Detalle })));
const FormularioOpinion = lazy(() => import("@/components/componente-formulario-opinion/Formulario-opinion").then(m => ({ default: m.FormularioOpinion })));
const Perfil = lazy(() => import("@/components/componente-usuario/UserSection").then(m => ({ default: m.Perfil })));
const UpdateUser = lazy(() => import("@/components/componente-update-user/update").then(m => ({ default: m.UpdateUser })));
const LayoutPrincipal = lazy(() => import("@/components/componente-layout/Layout").then(m => ({ default: m.LayoutPrincipal })));
const RutaProtegida = lazy(() => import("@/auth/RutaProtegida").then(m => ({ default: m.RutaProtegida })));
const RedirigirSiAutenticado = lazy(() => import("@/auth/RedirigirSiAutenticado").then(m => ({ default: m.RedirigirSiAutenticado })));
const SolicitarRecuperacion = lazy(() => import("@/components/componente-recuperar/SolicitarRecuperacion").then(m => ({ default: m.SolicitarRecuperacion })));
const NuevaContrasena = lazy(() => import("@/components/componente-recuperar/NuevaContrasena").then(m => ({ default: m.NuevaContrasena })));

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
    path: "/recuperar",
    element: <SolicitarRecuperacion />,
  },
  {
    path: "/nueva-contrasena",
    element: <NuevaContrasena />,
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
        path: "detalle/:id/:cover?",
        element: <Detalle />,
      },
      {
        path: "addOpinion/:id",
        element: <FormularioOpinion />,
      },
      {
        path: "perfil/:id",
        element: <Perfil />
      },
      {
        path:"update/:id",
        element: <UpdateUser/>
      }
    ],
  },
  {
    path: "*",
    element: <Pagina404 />,
  },
]);