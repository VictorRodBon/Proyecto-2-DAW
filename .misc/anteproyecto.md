# APLICACIÓN DIARIO DE LECTURAS
## INTRODUCCIÓN:
### Descripción
El proyecto consiste en el desarrollo de una aplicación web orientada a la gestión y seguimiento de lecturas personales. La plataforma permite a los usuarios registrar los libros que han leído, los que tienen pendientes y el que están leyendo actualmente. Adicionalmente, ofrece la posibilidad de añadir reseñas y puntuaciones a los títulos completados o abandonados. Como funcionalidad ampliada, se contempla la incorporación de un componente social que permita descubrir y compartir opiniones entre usuarios.
### Motivación:
Actualmente, muchos lectores llevan un seguimiento de sus lecturas de forma manual (cuadernos, hojas de cálculo) o mediante aplicaciones con interfaces poco atractivas o funcionalidades limitadas. Este proyecto nace de la necesidad de contar con una herramienta moderna, intuitiva y visualmente atractiva que centralice la experiencia lectora. A largo plazo, la incorporación de un apartado social facilitaría encontrar reseñas de forma cómoda y cercana, sin depender de plataformas generalistas.
### Beneficios esperados:
- Llevar un registro organizado de lecturas (pendientes, en curso, terminadas y aabandonadas).
- Valorar y opinar sobre los títulos leídos mediante puntuaciones y reseñas escritas.
- Acceder rápidamente a información detallada de los libros mediante la integración de Open Library API.
- Descubrir opiniones de otros lectores a través del apartado social.
### Relevandia del proyecto:
El hábito de la lectura está en auge, especialmente entre jóvenes. Sin embargo, no existe una solución sencilla y moderna que combine el seguimiento personal con la dimensión social de las lecturas. Este proyecto aporta valor al reunir en un único espacio la gestión personal y la comunidad lectora, con una interfaz actual desarrollada con tecnologías vigentes en el mercado laboral (React, Node.js, PostgreSQL).
##  OBJETIVOS GENERALES DEL PROYECTO:
Desarrollar una aplicación web que permita a los usuarios gestionar su historial de lecturas, expresar sus opiniones sobre los libros leídos y, opcionalmente, compartir dichas opiniones con una comunidad de lectores.
## OBJETIVOS ESPECÍFICOS:
- **Buscar libros:**
  - Implementar una funcionalidad de búsqueda que realice peticiones a la API de Open Library utilizando parámetros como título, autor o género, mostrando los resultados de forma clara y paginada.
- **Gestionar biblioteca personal:**
  - Permitir al usuario añadir libros a su biblioteca asignándoles uno de los siguientes estados: en espera, en proceso, terminado o abandonado, y modificar dicho estado en cualquier momento
- **Almacenamiento de reseñas y puntuaciones:**
  - Cuando un libro alcance el estado terminado o abandonado, habilitar un formulario para que el usuario añada una puntuación numérica y, opcionalmente, un texto de opinión.
- **Visualización de la biblioteca:**
  - Mostrar la biblioteca personal de cada usuario con sus libros organizados por estado, incluyendo las reseñas de los títulos terminados o abandonados.
- **Autenticación y gestión de usuarios:**
  - Implementar un sistema de registro e inicio de sesión seguro mediante JWT, garantizando que cada usuario acceda únicamente a su propia información.
- **Funcionalidad social:**
  - Desarrollar un feed o sección pública donde se muestren las reseñas de otros usuarios, con la posibilidad de filtrar por título o autor.
## CONTEXTO ACTUAL:
### Estado del arte:
Existen varias plataformas orientadas a la gestión de lecturas, siendo las más destacadas las siguientes:
- Goodreads (goodreads.com): es la plataforma más popular del sector, con millones de
usuarios. Permite llevar un registro de lecturas, escribir reseñas y seguir a otros lectores. Sin embargo, su interfaz es anticuada, su rendimiento lento y lleva años sin recibir mejoras significativas desde su adquisición por Amazon.
- The StoryGraph (thestorygraph.com): surgió como alternativa moderna a Goodreads. Ofrece estadísticas de lectura detalladas y recomendaciones basadas en el estado de ánimo. Su interfaz es más limpia, aunque su versión gratuita tiene limitaciones.
- Bookwyrm (bookwyrm.social): plataforma de código abierto y descentralizada basada en ActivityPub. Es una opción para usuarios que valoran la privacidad, aunque su usabilidad es más técnica y su comunidad es reducida. El presente proyecto se diferencia de los anteriores por ofrecer una interfaz moderna desarrollada con React, una API REST propia con Node.js y PostgreSQL, y una experiencia de usuario simplificada y centrada en las funcionalidades esenciales.
### Conceptos clave:
- **API REST**: arquitectura de comunicación entre cliente y servidor mediante peticiones HTTP (GET, POST, PUT, DELETE) con respuestas en formato JSON.
- **Open Library API**: API pública y gratuita que proporciona información sobre libros (título, autor, portada, descripción, género, etc.) a partir de búsquedas por texto.
- **JWT (JSON Web Token)**: estándar para la transmisión segura de información entre cliente y servidor mediante tokens firmados, utilizado habitualmente para la autenticación de usuarios.
- **ORM (Object-Relational Mapping)**: técnica que permite interactuar con la base de datos mediante objetos del lenguaje de programación en lugar de sentencias SQL directas. En este proyecto se valorará el uso de un ORM como Sequelize o Prisma.
- **CRUD**: acrónimo de las operaciones básicas sobre datos: Create (crear), Read (leer), Update (actualizar) y Delete (eliminar).
## PLANIFICACIÓN DEL PROYECTO:
### Bloque 1: Análisis y diseño:
- Definición de requisitos funcionales y no funcionales.
- Diseño del modelo entidad-relación y esquema de la base de datos PostgreSQL.
- Creación de wireframes y prototipo visual de la entidad de usuario.
- Definición de los endpoints de la API REST.
### Bloque 2: Desarrollo del Backent:
- Configuración del servidor Node js y NestJS.
- Diseño e implantación de la base de datos en PostgreSQL.
- Implementación del sistema de autenticación (registro, login, protección de rutas).
- Desarrollo de los endpoints para la gestión de libros, biblioteca y reseñas.
- Integración con la API de Open Library. 
### Bloque 3: Desarrollo del Frontend:
- Configuración del proyecto React con React Router.
- Desarrollo de los ocmponentes de Layout, Navegación y Formularios.
- Implementación de la vista de búsqueda de libros.
- Implementación del formulario de reseñas y puntuaciones.
- Desarrollo del apartado social. 
### Bloque 4: Pruebas y despliegue:
- Pruebas funcionales de los endpoints cont Postman o ThunderClient.
- Pruebas de integración frontend-backend.
- Corrección de errores y optimización.
- Despliegue en plataforma en la nube.
## TEMPORALIZACIÓN Y SECUENCIACIÓN:
| Tarea | Descripción | Duración | Inicio | Fin |
| -------| -------------| ----------| --------| -----|

## RELACIÓN DEL PROYECTO CON LOS CONTENIDOS DEL CICLO:
El proyecto integra conocimientos y competencias adquiridas a lo largo del ciclo formativo de Desarrollo de Aplicaciones Web (DAW). A continuación se detalla la relación con los principales módulos:
**Desarrollo Web en Entorno Cliente**:
El frontend de la aplicación se desarrolla íntegramente con React, aplicando los conceptos de componentes, estado, props, ciclo de vida, y enrutado con React Router. Se trabaja también la comunicación con APIs mediante fetch, el manejo asíncrono con promesas y async/await, y la gestión del almacenamiento de tokens en el cliente.
**Desarrollo Web en Entorno Servidor**:
El backend se construye con Node.js y Express.js, desarrollando una API REST con los métodos HTTP correspondientes. Se aplican conceptos como middleware, gestión de rutas, validación de datos, manejo de errores y autenticación mediante JWT.
**Bases de Datos**:
La capa de persistencia utiliza PostgreSQL, aplicando los conocimientos de diseño de esquemas relacionales, normalización, creación de tablas, relaciones entre entidades (usuarios, libros, reseñas) y consultas SQL. Opcionalmente, se puede utilizar un ORM como Prisma.
**Ampliación de Desarrollo Web en Entorno Cliente**:
La comunicación entre frontend y backend se realiza mediante JSON. El frontend utiliza JSX (extensión de JavaScript con sintaxis similar a HTML) para definir la estructura visual de los componentes React.
**Despliegue de Aplicaciones Web**:
El proyecto contempla el despliegue de la aplicación en servicios en la nube como Railway (para el backend y la base de datos) y Vercel o Netlify (para el frontend), poniendo en práctica los conocimientos de configuración de entornos de producción y variables de entorno.
