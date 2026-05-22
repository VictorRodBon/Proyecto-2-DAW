# Documentación del Frontend — App Libros

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Configuración y Scripts](#3-configuración-y-scripts)
4. [Sistema de Enrutamiento](#4-sistema-de-enrutamiento)
5. [Autenticación](#5-autenticación)
6. [Servicios / API Layer](#6-servicios--api-layer)
7. [Tipos e Interfaces](#7-tipos-e-interfaces)
8. [Componentes](#8-componentes)
9. [Sistema de Estilos](#9-sistema-de-estilos)
10. [Loading / Skeletons](#10-loading--skeletons)
11. [Flujo de Datos](#11-flujo-de-datos)

---

## 1. Stack Tecnológico

| Categoría        | Tecnología        | Versión  |
| ------------------| -------------------| ----------|
| Framework        | React             | ^19.2.4  |
| Lenguaje         | TypeScript        | ~5.9.3   |
| Build tool       | Vite              | ^8.0.1   |
| Routing          | react-router-dom  | ^7.13.1  |
| UI               | Material UI (MUI) | ^9.0.0   |
| Backend/Database | Supabase          | ^2.103.3 |
| Skeletons        | boneyard-js       | ^1.7.1   |

### Dependencias principales

```json
{
  "@mui/icons-material": "^9.0.0",
  "@mui/material": "^9.0.0",
  "@supabase/supabase-js": "^2.103.3",
  "boneyard-js": "^1.7.1",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.13.1"
}
```

### Variables de entorno (`.env`)

| Variable                 | Propósito                                        |
| --------------------------| --------------------------------------------------|
| `VITE_API_URL`           | URL del backend propio                           |
| `VITE_SUPABASE_URL`      | URL del proyecto Supabase                        |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase                        |
| `LLAVE_TOKEN`            | Clave en localStorage para la sesión de Supabase |

---

## 2. Estructura del Proyecto

```
frontend/app-libros/
├── index.html                       # Entry point HTML (Vite)
├── package.json                     # Dependencias y scripts
├── vite.config.ts                   # Configuración de Vite
├── tsconfig.json                    # TS raíz (project references)
├── tsconfig.app.json                # TS configuración de la app
├── tsconfig.node.json               # TS para vite.config
├── eslint.config.js                 # ESLint flat config
├── vercel.json                      # Reglas de deploy en Vercel (SPA fallback)
│
├── public/                          # Assets estáticos
│   ├── avatar-default.svg
│   ├── favicon.svg
│
└── src/
    ├── main.tsx                     # Punto de entrada
    ├── App.tsx                      # Componente raíz (ErrorBoundary + Router)
    ├── index.css                    # Estilos globales (reset, body, layout base)
    │
    ├── styles/
    │   └── variables.css            # CSS custom properties (design tokens)
    │
    ├── routes.tsx                   # Definición de rutas (createBrowserRouter)
    │
    ├── lib/
    │   └── supabase.ts              # Cliente Supabase inicializado
    │
    ├── auth/
    │   ├── gestorAutenticacion.ts   # Lógica de autenticación (token, sesión)
    │   ├── RutaProtegida.tsx        # Guard para rutas autenticadas
    │   └── RedirigirSiAutenticado.tsx # Redirect si ya está autenticado
    │
    ├── api/
    │   ├── servicioUsuarios.ts      # Backend API + Supabase Auth + Storage
    │   ├── servicioOpiniones.ts     # CRUD de opiniones
    │   └── servicioLecturas.ts      # CRUD de lecturas
    │
    ├── types/
    │   ├── index.ts                 # Barrel export
    │   ├── Usuario.ts               # IUsuario
    │   ├── Libro.ts                 # ILibro
    │   ├── DetalleLibro.ts          # IDetalleLibro
    │   ├── Lectura.ts               # ILectura
    │   └── Opinion.ts               # IOpinion
    │
    ├── hooks/
    │   └── useTruncar.ts            # Función de truncado de texto
    │
    ├── bones/                       # Configuración de skeletons (boneyard-js)
    │   ├── registry.js
    │   ├── tarjeta-libro.bones.json
    │   └── detalle-libro.bones.json
    │
    └── components/
        ├── ErrorBoundary.tsx
        ├── form.module.css          # Estilos compartidos de formularios
        │
        ├── componente-layout/       # Layout principal (header + menú + outlet)
        │
        ├── componente-menu/         # Menú de navegación (MUI dropdown)
        │
        ├── componente-login/        # Página de inicio de sesión
        ├── componente-registro/     # Página de registro
        ├── componente-recuperar/    # Recuperación de contraseña
        │
        ├── componente-buscar-libro/ # Búsqueda de libros
        ├── componente-libro/        # Tarjeta individual de libro
        ├── componente-detalle-libro/# Detalle de libro
        │
        ├── componente-boton-detalle/ # Botón "Detalle"
        ├── componente-boton-atras/   # Botón "Atrás"
        │
        ├── componente-formulario-opinion/ # Formulario de opinión
        ├── componente-lista-opiniones/    # Lista de opiniones
        ├── componente-opinion-listada/    # Opinión individual
        │
        ├── componente-usuario/            # Perfil de usuario
        ├── componente-update-user/        # Editar perfil
        │
        └── componente-Pagina404/    # Página 404
```

### Convención de nomenclatura

- Directorios de componentes con prefijo `componente-` seguido del nombre en kebab-case.
- Archivos de componentes en PascalCase (e.g. `Buscar-libro.tsx`, `Detalle-libro.tsx`) con CSS Modules asociados (`Nombre.module.css`).
- Servicios, hooks y utilidades en camelCase.

---

## 3. Configuración y Scripts

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite |
| `npm run build` | Compila TypeScript + build de producción Vite |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto |
| `npm run preview` | Previsualiza el build de producción |

### Aliases

- `@` → `src/` (configurado en `vite.config.ts` y `tsconfig.app.json`)

### Vercel (`vercel.json`)

Redirección catch-all para SPA:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 4. Sistema de Enrutamiento

Definido en `src/routes.tsx` usando `createBrowserRouter` de react-router-dom v7.

Todas las rutas de páginas se cargan con `React.lazy()` + `lazy()` para code-splitting.

### Rutas públicas

| Path | Componente | Comportamiento |
|------|-----------|----------------|
| `/` | `Login` | Redirige a `/search` si ya autenticado |
| `/login` | `Login` | Redirige a `/search` si ya autenticado |
| `/registro` | `Registro` | Redirige a `/search` si ya autenticado |
| `/recuperar` | `SolicitarRecuperacion` | Sin restricciones |
| `/nueva-contrasena` | `NuevaContrasena` | Sin restricciones |
| `*` | `Pagina404` | Catch-all |

### Rutas protegidas (requieren autenticación)

Agrupadas bajo una ruta padre que envuelve con `RutaProtegida` + `LayoutPrincipal` (header común con `<Outlet />`).

| Path | Componente | Descripción |
|------|-----------|-------------|
| `/search` | `BuscarLibro` | Búsqueda de libros |
| `/detalle/:id/:cover?` | `Detalle` | Detalle de un libro |
| `/addOpinion/:id` | `FormularioOpinion` | Añadir opinión a un libro |
| `/perfil/:id` | `Perfil` | Perfil de usuario |
| `/update/:id` | `UpdateUser` | Editar perfil |

### Guardas de autenticación

- **`RutaProtegida`**: Verifica `validarSesion()` al montar. Suscribe a `onAuthStateChange` de Supabase. Estados: `comprobando` → `autorizado` → `rechazado` (navega a `/`).
- **`RedirigirSiAutenticado`**: Si el usuario ya tiene sesión activa, redirige a `/search`. Se usa en login y registro.

### Layout

`LayoutPrincipal` (`componente-layout/Layout.tsx`) es el shell de la aplicación autenticada. Incluye:
- El menú de navegación (`MiMenu`)
- Barra de búsqueda con inputs de título, autor y selector de resultados por página
- Versión responsive con formulario colapsable en móvil
- `<Outlet />` para renderizar el contenido de la ruta anidada

---

## 5. Autenticación

### Gestor de autenticación (`src/auth/gestorAutenticacion.ts`)

Funciones puras para manejo de sesión local:

| Función | Descripción |
|---------|-------------|
| `obtenerTokenAutenticacion()` | Lee el token de localStorage |
| `estaAutenticado()` | Verifica existencia + expiración del token |
| `validarSesion()` | Comprueba localStorage y `supabase.auth.getUser()` |
| `cerrarSesionLocal()` | Elimina token de localStorage |
| `enviarCorreoRecuperacion(email)` | Envía email de reset mediante Supabase |

### Cliente Supabase (`src/lib/supabase.ts`)

Inicializado con `createClient()` usando las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Se usa para:
- **Auth**: `signInWithPassword`, `signUp`, `signOut`, `getUser`, `getSession`, `onAuthStateChange`, `resetPasswordForEmail`, `updateUser`
- **Storage**: Subida de fotos de perfil al bucket `avatars`

---

## 6. Servicios / API Layer

Todos los servicios siguen el patrón de objetos con métodos asíncronos. Reciben un `AbortSignal` opcional para cancelación.

### `servicioUsuarios.ts`

Gestiona usuarios contra el backend propio y Supabase.

| Método | Descripción |
|--------|-------------|
| `login(email, password)` | Inicia sesión con Supabase Auth |
| `registro(email, password, nombreUsuario)` | Registro con `signUp` + metadata |
| `logout()` | Cierra sesión (Supabase + localStorage) |
| `getSession()` | Obtiene sesión actual de Supabase |
| `getUsuarioActual()` | Obtiene usuario autenticado de Supabase |
| `getPorId(id)` | `GET /usuarios/me/{id}` |
| `putPorId(id, datos)` | `PATCH /usuarios/me/{id}` |
| `subirFotoPerfil(file, userId)` | Sube foto al bucket `avatars` de Supabase Storage |
| `actualizarFotoPerfil(userId, file)` | Sube foto + actualiza DB en una llamada |

### `servicioOpiniones.ts`

CRUD de opiniones contra el backend.

| Método | Descripción |
|--------|-------------|
| `postOpinion(datos)` | `POST /opiniones` |
| `getPorLibro(id_libro)` | `GET /opiniones/libro/{id}` |
| `getPorUsuario(id_usuario)` | `GET /opiniones/usuario/{id}` |
| `putOpinion(id_opinion, datos)` | `PATCH /opiniones/{id}` |
| `deleteOpinion(id_opinion)` | `DELETE /opiniones/{id}` |

### `servicioLecturas.ts`

CRUD de listas de lectura contra el backend.

| Método | Descripción |
|--------|-------------|
| `postLectura(datos)` | `POST /lecturas` |
| `getPorUsuario(id_usuario)` | `GET /lecturas/usuario/{id}` |
| `putLectura(id_lectura, datos)` | `PATCH /lecturas/{id}` |
| `deleteLectura(id_lectura)` | `DELETE /lecturas/{id}` |

---

## 7. Tipos e Interfaces

Definidos en `src/types/`.

### `ILibro` (Libro.ts)

```typescript
export interface ILibro {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}
```

### `IDetalleLibro` (DetalleLibro.ts)

```typescript
export interface IDetalleLibro {
  title: string;
  description?: { type?: string; value?: string } | string;
  subject_places?: string[];
  covers?: number[];
  first_publish_date?: string;
  key: string;
  authors?: { author: { key: string } }[];
  subjects?: string[];
}
```

### `IUsuario` (Usuario.ts)

```typescript
export interface IUsuario {
  id: string;
  nombre_usuario: string;
  estado: string;
  rol: string;
  foto_perfil: string;
  fecha_creacion: string;
}
```

### `ILectura` (Lectura.ts)

```typescript
export interface ILectura {
  id_lectura: number;
  id_usuario: string;
  id_libro: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: string; // "Pendiente" | "Leyendo" | "Terminado" | "Abandonado"
}
```

### `IOpinion` (Opinion.ts)

```typescript
export interface IOpinion {
  id_opinion: number;
  id_usuario: string;
  id_libro: string;
  puntuacion: number;
  valoracion: string;
  fecha_creacion: string;
}
```

### `SesionAlmacenada` (gestorAutenticacion.ts, interno)

```typescript
interface SesionAlmacenada {
  access_token?: string;
  expires_at?: number;
}
```

---

## 8. Componentes

### 8.1 Estructurales

#### `App.tsx`
- Renderiza `<ErrorBoundary>` y dentro `<Suspense fallback="Cargando...">` con `<RouterProvider router={router} />`.

#### `ErrorBoundary.tsx`
- Error boundary de clase. Muestra UI de fallback con botón "Recargar página" y detalles del error.

#### `Layout.tsx` (LayoutPrincipal)
- Shell de la app autenticada. Incluye:
  - Menú hamburguesa (`MiMenu`)
  - Barra de búsqueda (título + autor + límite de resultados)
  - Versión responsive (formulario colapsable en móvil)
  - `<Outlet />` para rutas hijas

### 8.2 Autenticación

#### `Login.tsx`
- Formulario email + contraseña.
- Validación de dominio (gmail, yahoo, outlook, hotmail).
- Enlaces a registro y recuperación de contraseña.

#### `Registro.tsx`
- Formulario nombre de usuario + email + contraseña + confirmar.
- Validación de contraseña (>=6 chars, mayúscula, minúscula, especial).
- Lista blanca de dominios + bloqueo de emails temporales.

#### `SolicitarRecuperacion.tsx`
- Formulario solo email. Envía correo de recuperación via Supabase.

#### `NuevaContrasena.tsx`
- Formulario nueva contraseña + confirmar. Llama a `supabase.auth.updateUser()` directamente.

### 8.3 Búsqueda y Libros

#### `Buscar-libro.tsx`
- Lee parámetros de búsqueda de la URL (`q`, `page`, `limit`, `author`).
- Búsqueda con fetch a OpenLibrary.
- Paginación incremental ("Cargar más").
- Muestra sugerencias aleatorias por defecto (lista predefinida).
- Estados: carga (skeleton), resultados, sin resultados, error.

#### `Libro.tsx`
- Tarjeta individual de libro: portada (o placeholder), título, autor.
- Botón "Detalle" y botón "Añadir/Eliminar de biblioteca".
- Verifica si el libro ya está en la biblioteca del usuario.
- Texto truncado con `truncarTexto()`.

#### `Detalle-libro.tsx`
- Página de detalle. Carga datos del libro y opiniones.
- Renderiza `DetalleContent` envuelto en skeleton.

#### `Detalle-content.tsx`
- Muestra: portada, valoración media, descripción, autores, fecha publicación, géneros (máx. 5).
- Botones "Ver opiniones", "Añadir Opinión", "Atrás".

### 8.4 Sistema de Opiniones

#### `Formulario-opinion.tsx`
- Formulario de opinión con `RatingInput` (1-5 estrellas) + textarea.
- Envía via `servicioOpiniones.postOpinion()`.

#### `RatingInput.tsx`
- Wrapper del componente `Rating` de MUI con `StarIcon`.

#### `Lista-opiniones.tsx`
- Renderiza lista de `OpinionListada`. Estados: carga, vacío, con datos.

#### `Opinion-listada.tsx`
- Muestra una opinión: nombre de usuario, foto de perfil, puntuación, texto.
- Context-aware: en perfil enlaza al libro; fuera del perfil enlaza al usuario.

### 8.5 Perfil de Usuario

#### `UserSection.tsx` (Perfil)
- Carga datos del usuario, sus opiniones y su lista de lectura.
- Determina si es el propio perfil (`esPropietario`).
- Foto de perfil clickable → navega a `/update/:id`.

#### `Lista-lecturas.tsx`
- Contenedor de tarjetas de lectura. Callbacks: `alEliminar`, `alCambiarEstado`.

#### `ReadingCard.tsx`
- Tarjeta de lectura: portada, título, autor, selector de estado, fecha fin, botones Eliminar/Ver detalle.
- Cambio de estado via `servicioLecturas.putLectura()` con manejo automático de fechas.

#### `update.tsx` (UpdateUser)
- Formulario para cambiar nombre de usuario y/o foto de perfil.
- Subida de foto a Supabase Storage + actualización via PATCH.

### 8.6 Utilidades

#### `Boton-detalle.tsx`
- Navega a `/detalle/:key/:cover` pasando `authorName` via `location.state`.

#### `Boton-atras.tsx`
- `navigate(-1)`.

#### `Pagina404.tsx`
- Página 404 con botones "Volver" e "Ir al Login".

---

## 9. Sistema de Estilos

### Design Tokens (`src/styles/variables.css`)

Variables CSS personalizadas (CSS custom properties) organizadas en:

- **Colores**: primarios, secundarios, danger, success, orange, fondos, bordes, textos.
- **Sombras**: sm, md, lg, xl, card.
- **Radios**: sm, md, lg, xl, full.
- **Transiciones**: fast (0.2s), normal (0.3s).

### CSS Modules

Cada componente con estilo propio tiene un archivo `.module.css` importa `variables.css` via `@import`. Esto proporciona scoping de clases automático.

### Estilos globales (`index.css`)

- Reset CSS
- Fondo con degradado oscuro (`#0b1220` → `#070a12`)
- Tipografía base (Helvetica Neue)
- Scroll suave

### Formularios compartidos (`form.module.css`)

Estilos reutilizables para inputs, botones, mensajes de error/éxito y enlaces. Usado por Login, Registro, UpdateUser, SolicitarRecuperacion y NuevaContrasena.

### MUI `sx` prop

Usado en `Menu.tsx` y `RatingInput.tsx` para estilos inline de componentes MUI.

---

## 10. Loading / Skeletons

El proyecto usa **boneyard-js** para mostrar skeletons durante la carga:

- **`tarjeta-libro.bones.json`**: Definiciones de huesos para tarjetas de libro, con breakpoints responsivos (375px, 768px, 1280px).
- **`detalle-libro.bones.json`**: Huesos para la página de detalle de libro.
- **`registry.js`**: Registro automático de las definiciones.

### Uso

```tsx
<Skeleton name="tarjeta-libro" loading={cargando}>
  {/* contenido real */}
</Skeleton>
```

Los skeletons se aplican en `Buscar-libro.tsx` (resultados de búsqueda) y `Detalle-libro.tsx` (detalle del libro).

---

## 11. Flujo de Datos

### Patrón general

```
Componente
  → useEffect (al montar / cambio de parámetros)
    → Crear AbortController
    → Llamar método del servicio
      → fetch() / Supabase client
        → Backend propio / Supabase
    → Guardar resultado en useState
    → Cleanup: abortar controller
```

### Gestión de estado

El estado es completamente local a cada componente mediante hooks de React:

| Hook | Uso |
|------|-----|
| `useState` | Datos de fetch, loading, errores, toggles, inputs |
| `useEffect` | Fetch al montar, listeners, subscripciones |
| `useMemo` | URLs de portadas, sugerencias |
| `useSearchParams` | Parámetros de búsqueda en URL |
| `useParams` | Parámetros de ruta |
| `useLocation` | Estado de navegación (`location.state`) |
| `useNavigate` | Navegación programática |

### Orígenes de datos

1. **Supabase Auth** — Login, registro, sesión, recuperación de contraseña.
2. **Supabase Storage** — Fotos de perfil (bucket `avatars`).
3. **Backend propio** — CRUD de usuarios, opiniones y lecturas.
4. **OpenLibrary** (externa) — Búsqueda y detalle de libros (gestionado en `servicioLibros.ts`).

### Cancelación de peticiones

Los servicios aceptan un parámetro `options` con `signal?: AbortSignal`. Los componentes crean un `AbortController` en el `useEffect` y llaman a `controller.abort()` en el cleanup, evitando peticiones en componentes desmontados.

---

## Convenciones del Código

- **Nombres en español** para funciones, variables y comentarios (consistente en todo el frontend).
- **Componentes con exportación nombrada** (no default exports).
- **CSS Modules** para estilos con scoping.
- **TypeScript estricto**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`.
- **Formularios**: todos los inputs tienen `<label>` asociado con `htmlFor`/`id`.
