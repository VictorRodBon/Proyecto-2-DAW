// src/servicios/servicioLibros.ts
import type { ILibro } from "../types";

const API_URL = "https://openlibrary.org";

export const servicioLibros = {
    getByTitle: async (title: string, pagina: number = 1, cantidad:number = 10): Promise<ILibro[]> => {
        const newTitle = title.replace(/ /g, "+");
        
        const url = `${API_URL}/search.json?q=${newTitle}&fields=key,title,author_name,cover_i&limit=${cantidad}&page=${pagina}`;
        
        const response = await fetch(url);
        const data = await response.json();

        return (data?.docs ?? []) as ILibro[];
    },

    getData: async (key:string)=>{
        const url=`${API_URL}/works/${key}.json`

        const response = await fetch(url);

        if(!response.ok) throw new Error("No se encontro el libro")

        return await response.json();
    },

    getAutorNombre: async (authorKey: string): Promise<string | null> => {
        // authorKey típico: "/authors/OL23919A"
        const url = `${API_URL}${authorKey}.json`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = (await response.json()) as { name?: string };
        return data?.name ?? null;
    }
};