// src/servicios/servicioLibros.ts
import type { ILibro } from "../types";

const API_URL = "https://openlibrary.org/search.json";

export const servicioLibros = {
    getByTitle: async (title: string, pagina: number = 1, cantidad:number = 10): Promise<ILibro[]> => {
        const newTitle = title.replace(/ /g, "+");
        // Añadimos &page y &limit a la URL
        const url = `${API_URL}?q=${newTitle}&fields=key,title,author_name,cover_i&limit=${cantidad}&page=${pagina}`;
        
        const response = await fetch(url);
        const data = await response.json();

        return (data?.docs ?? []) as ILibro[];
    },
};