import { useState, useEffect } from 'react';
import type { ILibro } from '../../types/Libro';
import type { ILectura } from '../../types/Lectura';
import type { IOpinion } from '../../types/Opinion';
import type { IUsuario } from '../../types/Usuario';
import { useParams } from "react-router-dom";
import { ListaOpiniones } from '../componente-lista-opiniones/Lista-opiniones';
import { ListaLecturas } from './Lista-lecturas';
import { servicioUsuarios } from '../../api/servicioUsuarios';
import { servicioOpiniones } from '../../api/servicioOpiniones';
import { servicioLecturas } from '../../api/servicioLecturas';
import { servicioLibros } from '../../api/servicioLibros';
import styles from './UserSection.module.css';

export function Perfil() {
  const { id } = useParams<{ id?: string }>();
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [opiniones, setOpiniones] = useState<IOpinion[]>([]);
  const [lecturasActuales, setLecturasActuales] = useState<Array<{ lectura: ILectura; libro: ILibro }>>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [esPropietario, setEsPropietario] = useState<boolean>(false);

  function cargarDatos(): void {
    async function obtenerDatos(): Promise<void> {
      try {
        setCargando(true);

        const respuestaUsuario = await servicioUsuarios.getUsuarioActual();
        if (!respuestaUsuario.user || respuestaUsuario.error) {
          setError('No hay sesión activa');
          setCargando(false);
          return;
        }

        const idActual = respuestaUsuario.user.id;

        const idAMostrar = id || idActual;
        setEsPropietario(idActual === idAMostrar);
        
        const datosUsuario = await servicioUsuarios.getPorId(idAMostrar);
        if (datosUsuario) {
          setUsuario(datosUsuario);
        }

        const opinionesUsuario = await servicioOpiniones.getPorUsuario(idAMostrar);
        setOpiniones(opinionesUsuario || []);

        const lecturasUsuario = await servicioLecturas.getPorUsuario(idAMostrar);
        
        const lecturasConLibros: Array<{ lectura: ILectura; libro: ILibro }> = [];
        
        for (let i = 0; i < lecturasUsuario.length; i++) {
          const lectura = lecturasUsuario[i];
          
          let libro: ILibro;
          try {
            const libroObtenido = await servicioLibros.getData(lectura.id_libro);
            
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
            libro = {
              key: lectura.id_libro,
              title: 'Libro no disponible',
              author_name: 'Autor desconocido',
              cover_i: undefined
            };
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
  const tituloEncabezado = `Biblioteca de ${nombreUsuario}`;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.headerSection}>
          <div className={styles.headerGradientBg}></div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{tituloEncabezado}</h1>
            <p className={styles.appName}>Mi Biblioteca de libros</p>
          </div>
        </div>

        <div className={styles.sectionsContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.bar} ${styles.purple}`}></div>
              <h2 className={styles.sectionTitle}>Últimas opiniones</h2>
            </div>
            <ListaOpiniones opiniones={opiniones} cargando={cargando} />
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.bar} ${styles.orange}`}></div>
              <h2 className={styles.sectionTitle}>Últimas lecturas</h2>
            </div>
            <ListaLecturas
              lecturas={lecturasActuales}
              alEliminar={manejarEliminarLectura}
              alCambiarEstado={manejarCambiarEstadoLectura}
              cargando={cargando}
              esPropietario={esPropietario}
            />
          </section>
        </div>
      </div>
    </div>
  );
}