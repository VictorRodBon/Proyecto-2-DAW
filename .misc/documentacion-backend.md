# Documentación del Proyecto

## Tabla de Contenidos

- [Backend](#backend)
  - [Tecnologías](#tecnologías)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Modelos de Base de Datos](#modelos-de-base-de-datos)
  - [API Endpoints](#api-endpoints)
  - [Configuración](#configuración)

---

## Backend

### Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| NestJS | ^11.0.1 | Framework de Node.js para construir aplicaciones del lado del servidor |
| Prisma | ^7.6.0 | ORM para PostgreSQL |
| PostgreSQL | - | Sistema de gestión de base de datos relacional |
| TypeScript | ^5.7.3 | Lenguaje de programación tipado |
| class-validator | ^0.14.1 | Biblioteca para validación de datos |
| dotenv | ^17.3.1 | Carga de variables de entorno |

### Estructura del Proyecto

```
backend/
├── src/
│   ├── main.ts                      # Punto de entrada de la aplicación
│   ├── app.module.ts                # Módulo principal de la aplicación
│   ├── prisma/
│   │   ├── prisma.module.ts         # Módulo de Prisma
│   │   └── prisma.service.ts        # Servicio de conexión a la base de datos
│   ├── usuarios/
│   │   ├── usuarios.module.ts       # Módulo de usuarios
│   │   ├── usuarios.controller.ts   # Controlador de usuarios
│   │   ├── usuarios.service.ts      # Servicio de usuarios
│   │   └── dto/                     # Data Transfer Objects
│   ├── lecturas/
│   │   ├── lecturas.module.ts      # Módulo de lecturas
│   │   ├── lecturas.controller.ts  # Controlador de lecturas
│   │   ├── lecturas.service.ts     # Servicio de lecturas
│   │   └── dto/                     # Data Transfer Objects
│   └── opiniones/
│       ├── opiniones.module.ts      # Módulo de opiniones
│       ├── opiniones.controller.ts  # Controlador de opiniones
│       ├── opiniones.service.ts      # Servicio de opiniones
│       └── dto/                     # Data Transfer Objects
├── prisma/
│   └── schema.prisma               # Esquema de la base de datos
├── dist/                           # Archivos compilados
├── package.json                    # Dependencias del proyecto
├── tsconfig.json                   # Configuración de TypeScript
└── nest-cli.json                   # Configuración de NestJS
```

### Modelos de Base de Datos

#### Usuario

| Campo          | Tipo          | Descripción                                   |
| ----------------| ---------------| -----------------------------------------------|
| id             | String (UUID) | Identificador único del usuario               |
| nombre_usuario | String        | Nombre de usuario                             |
| estado         | String        | Estado del usuario (por defecto: "no-activo") |
| rol            | String        | Rol del usuario (por defecto: "usuario")      |
| foto_perfil    | String?       | URL de la foto de perfil (opcional)           |
| fecha_creacion | DateTime      | Fecha de creación del usuario                 |

**Relaciones:**
- Un usuario puede tener muchas opiniones
- Un usuario puede tener muchas lecturas

#### Opiniones

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_opinion | BigInt | Identificador único de la opinión |
| id_usuario | String | FK al usuario que crea la opinión |
| id_libro | String | Identificador del libro |
| puntuacion | Int | Puntuación dada al libro (1-5) |
| valoracion | String? | Comentario o valoración textual (opcional) |
| fecha_creacion | DateTime | Fecha de creación de la opinión |

**Relaciones:**
- Cada opinión pertenece a un usuario

#### LecturasUsuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_lectura | String (UUID) | Identificador único de la lectura |
| id_usuario | String | FK al usuario |
| id_libro | String | Identificador del libro |
| fecha_inicio | DateTime? | Fecha de inicio de la lectura (opcional) |
| fecha_fin | DateTime? | Fecha de fin de la lectura (opcional) |
| estado | String | Estado de la lectura (ej: "leyendo", "completado") |

**Relaciones:**
- Cada lectura pertenece a un usuario

#### Diagrama

```mermaid
erDiagram
    auth.users ||--|| Usuarios : "extiende"
    Usuarios ||--|| Opiniones : "opina"
    Usuarios ||--|| LecturasUsuarios : "realiza"


    auth.users {
        String(UUID) id PK
        String correo
    }

    Usuarios {
        String(UUID) id_usuario PK FK
        String nombre de usuario
        String estado "activo/no-activo"
        String rol "usuario/admin"
        Stirng? foto_perfil "opcional"
        DateTime fecha_creacion
    }

    Opiniones {
        BigInt id_opinion PK
        String id_usuario FK
        String id_libro FK
        Int puntuacion "(1-5)"
        String? valoracion
        DateTime fecha_creacion
    }

    LecturasUsuarios {
        String(UUID) id_lectura PK
        String id_usuario FK
        String id_libro FK
        DateTime? fecha_inicio
        DateTime? fecha_fin
        String estado "sin empezar/leyendo/terminado/abandonado"
    }

```
---

## API Endpoints

### Módulo de Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios/me/:id` | Obtiene los datos de un usuario por su ID |
| PATCH | `/usuarios/me/:id` | Actualiza los datos de un usuario |

#### Respuesta GET /usuarios/me/:id

```json
{
  "id": "uuid-del-usuario",
  "nombre_usuario": "nombre",
  "estado": "no-activo",
  "rol": "usuario",
  "foto_perfil": "https://...",
  "fecha_creacion": "2024-01-01T00:00:00.000Z"
}
```

#### Body para PATCH /usuarios/me/:id

```json
{
  "nombre_usuario": "nuevo_nombre",
  "estado": "activo",
  "foto_perfil": "https://..."
}
```

---

### Módulo de Lecturas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/lecturas` | Crea un nuevo registro de lectura |
| GET | `/lecturas/usuario/:id_usuario` | Obtiene todas las lecturas de un usuario |
| PATCH | `/lecturas/:id_lectura` | Actualiza una lectura existente |
| DELETE | `/lecturas/:id_lectura` | Elimina una lectura |

#### Body para POST /lecturas

```json
{
  "id_usuario": "uuid-del-usuario",
  "id_libro": "id-del-libro",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-01-15",
  "estado": "completado"
}
```

#### Respuesta GET /lecturas/usuario/:id_usuario

```json
[
  {
    "id_lectura": "uuid",
    "id_usuario": "uuid",
    "id_libro": "id-libro",
    "fecha_inicio": "2024-01-01T00:00:00.000Z",
    "fecha_fin": "2024-01-15T00:00:00.000Z",
    "estado": "completado"
  }
]
```

---

### Módulo de Opiniones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/opiniones` | Crea una nueva opinión |
| GET | `/opiniones/libro/:id_libro` | Obtiene todas las opiniones de un libro |
| GET | `/opiniones/usuario/:id_usuario` | Obtiene todas las opiniones de un usuario |
| PATCH | `/opiniones/:id_opinion` | Actualiza una opinión existente |
| DELETE | `/opiniones/:id_opinion` | Elimina una opinión |

#### Body para POST /opiniones

```json
{
  "id_usuario": "uuid-del-usuario",
  "id_libro": "id-del-libro",
  "puntuacion": 5,
  "valoracion": "¡Excelente libro!"
}
```

#### Respuesta GET /opiniones/libro/:id_libro

```json
[
  {
    "id_opinion": 1,
    "id_usuario": "uuid",
    "id_libro": "id-libro",
    "puntuacion": 5,
    "valoracion": "¡Excelente libro!",
    "fecha_creacion": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Configuración

### Variables de Entorno

El proyecto utiliza un archivo `.env` para la configuración. Copiar `.env.example` y renombrarlo a `.env`:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_base_datos
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala las dependencias |
| `npm run start` | Inicia la aplicación en modo producción |
| `npm run start:dev` | Inicia la aplicación en modo desarrollo con watch |
| `npm run start:debug` | Inicia la aplicación en modo debug |
| `npm run start:prod` | Inicia la aplicación compilada |
| `npm run build` | Compila la aplicación |
| `npm run test` | Ejecuta los tests unitarios |
| `npm run test:e2e` | Ejecuta los tests end-to-end |
| `npm run test:cov` | Ejecuta los tests con cobertura |
| `npm run lint` | Ejecuta el linter |

### Generación del Cliente Prisma

Para actualizar el cliente de Prisma después de modificar el esquema:

```bash
cd backend
npx prisma generate
```

### Migraciones de Base de Datos

Para crear y aplicar migraciones:

```bash
# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (desarrollo)
npx prisma migrate reset
```

---

## Arquitectura

El backend sigue una arquitectura modular de NestJS:

1. **Módulos**: Cada funcionalidad principal tiene su propio módulo
2. **Controladores**: Manejan las rutas y respuestas HTTP
3. **Servicios**: Contienen la lógica de negocio
4. **DTOs**: Data Transfer Objects para validación de entrada
5. **Prisma**: Acceso a la base de datos a través del servicio PrismaService
