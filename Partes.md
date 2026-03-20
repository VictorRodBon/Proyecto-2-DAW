# FRONT (REACT):
**Llamadas a apis:**
  - *Propias:*
    - Usuarios:
      - Login
      - Registro
      - Modificar -> creador/admin
      - Eliminar
    - Opiniones:
      - Crear
      - Listar-id
      - Listar-todas
      - Modificar -> creador
      - Eliminar -> creador/admin
      
  - *Externas:*
    - Listar-libros:
      - filtros: autor, titulo, genero
    - Información-libro-id
    - Obtener-portada
  
**Pantallas:**
  - *Usuarios Normales:*
    - Usuarios:
      - Login
      - Registro
      - Modificar
      - Eliminar
      - Eliminar
    - Opiniones:
      - Crear
      - Modificar
      - Listar
      - Detalle
      - Eliminar
    - Libros:
      - Lsitar-todos
      - Detalle

  - *Usuarios administradores:*
    - Panel de control de usuarios
    - Panel de control de opiniones

# BACK (NestJS):
**Usuarios:**
  - Login
  - Registro
  - Modificar
  - Eliminar

**Opiniones:**
  - Crear
  - Listar-id
  - Listar-todas
  - Modificar
  - Eliminar

**Lecturas Usuarios:**
  - Crear
  - Listar-id
  - Listar-todas
  - Modificar (cambiar estado)


# BBDD (SUPABASE):
**Usuarios:**
  - ID-usuario (ID / PK)
  - Nombre-usuario (VARCHAR / UNIC / NotNull)
  - Correo (VARCHAR / NotNull)
  - Contraseña (VARCHAR / NotNull)
  - Fecha-creación (DATE / NootNull)
  - Estado (VARCHAR / NotNull): "Activo", "No activo"
  - Rol (VARCHAR / NotNull): "usario", "admin"
  - Foto-perfil ()
  
**Opiniones:**
  - ID-opinion (ID / PK)
  - ID-usuario (ID / FK / NotNull)
  - ID-libro (VARCHAR / FK / NotNull)
  - Puntuación (Int / NotNull)
  - Valoración (VARCHAR)
  - Fecha-Creacion (DATE / NotNull)
  - Privada (BOOLEAN)

**Lecturas Usuarios:**
  - ID-Lectura (ID / PK)
  - ID-Usuario (ID / FK / NotNull)
  - ID-Libro (VARCHAR / FK / NotNull)
  - Fecha-Inicio (Fecha)
  - Fecha-Fin (Fecha): Si es nulo, significa que lo estás leyendo actualmente.
  - Estado (Texto / NotNull): "Pendiente", "Leyendo", "Terminado", "Abandonado".