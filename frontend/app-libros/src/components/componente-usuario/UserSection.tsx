import { useState, useEffect } from 'react';
import type { ILibro } from '../../types/Libro';
import type { ILectura } from '../../types/Lectura';
import type { IOpinion } from '../../types/Opinion';
import type { IUsuario } from '../../types/Usuario';
import { ListaOpiniones } from '../componente-lista-opiniones/Lista-opiniones';
import { ReadingCard } from './ReadingCard';
import { servicioUsuarios } from '../../api/servicioUsuarios';
import { servicioOpiniones } from '../../api/servicioOpiniones';
import { servicioLecturas } from '../../api/servicioLecturas';
import { servicioLibros } from '../../api/servicioLibros';
import styles from './UserSection.module.css';

export function Perfil() {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [opiniones, setOpiniones] = useState<IOpinion[]>([]);
  const [lecturasActuales, setLecturasActuales] = useState<Array<{ lectura: ILectura; libro: ILibro }>>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function cargarDatos(): void {
    async function obtenerDatos(): Promise<void> {
      try {
        setCargando(true);
        
        // Obtener usuario actual autenticado
        const respuestaUsuario = await servicioUsuarios.getUsuarioActual();
        if (!respuestaUsuario.user || respuestaUsuario.error) {
          setError('No hay sesión activa');
          setCargando(false);
          return;
        }

        const idUsuario = respuestaUsuario.user.id;
        
        // Obtener datos del usuario de la tabla usuarios
        const datosUsuario = await servicioUsuarios.getPorId(idUsuario);
        if (datosUsuario) {
          setUsuario(datosUsuario);
        }

        // Obtener opiniones del usuario
        const opinionesUsuario = await servicioOpiniones.getPorUsuario(idUsuario);
        setOpiniones(opinionesUsuario || []);

        console.log(opiniones)

        // Obtener lecturas del usuario
        const lecturasUsuario = await servicioLecturas.getPorUsuario(idUsuario);
        
        // Procesar lecturas - obtener datos de libros de Open Library
        const lecturasConLibros: Array<{ lectura: ILectura; libro: ILibro }> = [];
        
        for (let i = 0; i < lecturasUsuario.length; i++) {
          const lectura = lecturasUsuario[i];
          
          let libro: ILibro;
          try {
            // Intentar obtener el libro de Open Library usando el id_libro como key
            const libroObtenido = await servicioLibros.getData(lectura.id_libro);
            
            // Extraer información del libro
            const primeraPortada = libroObtenido.covers && libroObtenido.covers.length > 0 
              ? libroObtenido.covers[0] 
              : undefined;
            
            libro = {
              key: lectura.id_libro,
              title: libroObtenido.title || 'Título desconocido',
              author_name: libroObtenido.authors && libroObtenido.authors.length > 0
                ? libroObtenido.authors[0].name
                : 'Autor desconocido',
              cover_i: primeraPortada
            };
          } catch (err) {
            // Si no se encuentra el libro, crear un mock
            libro = {
              key: lectura.id_libro,
              title: 'Libro no disponible',
              author_name: 'Autor desconocido',
              cover_i: undefined
            };
            console.log("error al solicitar los libros: "+err)
          }
          
          lecturasConLibros.push({
            lectura: lectura,
            libro: libro
          });
        }

        setLecturasActuales(lecturasConLibros || []);
        setError(null);
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error al cargar datos';
        setError(mensaje);
      } finally {
        setCargando(false);
      }
    }

    obtenerDatos();
  }

  useEffect(function() {
    cargarDatos();
  }, []);

  function manejarEliminarLectura(id: string): void {
    const lecturasActualizadas = lecturasActuales.filter(function(item) {
      return item.lectura.id_lectura !== id;
    });
    setLecturasActuales(lecturasActualizadas);
  }

  async function manejarCambiarEstadoLectura(id: string, nuevoEstado: string): Promise<void> {
    const datosActualizar: { estado: string; fecha_inicio?: string; fecha_fin?: string } = { estado: nuevoEstado };
    
    if (nuevoEstado === 'Leyendo') {
      datosActualizar.fecha_inicio = new Date().toISOString();
    } else if (nuevoEstado === 'Terminado') {
      datosActualizar.fecha_fin = new Date().toISOString();
    }
    
    const lecturaActualizada = await servicioLecturas.putLectura(id, datosActualizar);
    if (lecturaActualizada) {
      setLecturasActuales((prev) =>
        prev.map((item) =>
          item.lectura.id_lectura === id
            ? { ...item, lectura: { ...item.lectura, estado: nuevoEstado, fecha_inicio: lecturaActualizada.fecha_inicio, fecha_fin: lecturaActualizada.fecha_fin } }
            : item
        )
      );
    }
  }

  if (cargando) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headerSection}>
            <div className={styles.headerGradientBg}></div>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Cargando...</h1>
              <p className={styles.appName}>Mi Biblioteca de libros</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headerSection}>
            <div className={styles.headerGradientBg}></div>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Error</h1>
              <p className={styles.appName}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nombreUsuario = usuario?.nombre_usuario || 'Usuario';
  const tituloEncabezado = `Bienvenido ${nombreUsuario}`;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Encabezado */}
        <div className={styles.headerSection}>
          <div className={styles.headerGradientBg}></div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              {tituloEncabezado}
            </h1>
            <p className={styles.appName}>Mi Biblioteca de libros</p>
          </div>
        </div>

        {/* Contenedor de dos secciones lado a lado */}
        <div className={styles.sectionsContainer}>
          {/* Sección de Últimas opiniones - IZQUIERDA */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBar}></div>
              <h2 className={styles.sectionTitle}>
                Últimas opiniones
              </h2>
            </div>
            {opiniones.length > 0 ? (
              <ListaOpiniones opiniones={opiniones} cargando={cargando}/>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyMessage}>
                  No hay opiniones disponibles
                </p>
              </div>
            )}
          </section>

          {/* Sección de Últimas lecturas - DERECHA */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.sectionBar} ${styles.red}`}></div>
              <h2 className={styles.sectionTitle}>
                Últimas lecturas
              </h2>
            </div>
            {lecturasActuales.length > 0 ? (
              <div className={styles.sectionContent}>
                {lecturasActuales.map(function(item) {
                  return (
                    <ReadingCard
                      key={item.lectura.id_lectura}
                      lectura={item.lectura}
                      libro={item.libro}
                      alEliminar={manejarEliminarLectura}
                      alCambiarEstado={manejarCambiarEstadoLectura}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyMessage}>
                  No hay lecturas disponibles
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}