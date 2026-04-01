export interface ILectura {
  id_lectura: string;
  id_usuario: string;
  id_libro: string;
  fecha_inicio?: string; 
  fecha_fin?: string;    
  estado: string;
}
