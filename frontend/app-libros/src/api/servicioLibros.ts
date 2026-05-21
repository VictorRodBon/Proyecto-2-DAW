// src/api/servicioLibros.ts
import type { ILibro } from "@/types";

const API_URL = "https://openlibrary.org";

export const servicioLibros = {
    getByTitle: async (
        title: string = "", 
        pagina: number = 1, 
        cantidad: number = 10, 
        author_name: string = "", 
        options?: { signal?: AbortSignal }
    ): Promise<ILibro[]> => {
        const tieneTitulo = title && title.trim();
        const tieneAutor = author_name && author_name.trim();

        if (!tieneTitulo && !tieneAutor) {
            console.warn("Se requiere al menos un título o un autor para realizar la búsqueda.");
            return [];
        }
        
        const params = new URLSearchParams({
            fields: "key,title,author_name,cover_i",
            limit: cantidad.toString(),
            page: pagina.toString()
        });

        if (tieneTitulo) {
            params.append("title", title.trim());
        }
        
        if (tieneAutor) {
            params.append("author", author_name.trim());
        }

        const url = `${API_URL}/search.json?${params.toString()}`;

        try {
            const response = await fetch(url, { signal: options?.signal });
            
            if (!response.ok) {
                console.error("Error en la búsqueda:", response.status, response.statusText);
                return [];
            }
            
            const data = await response.json();
            return (data?.docs ?? []) as ILibro[];
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return [];
            }
            
            console.error("Error real en la petición:", error);
            return [];
        }
    },

    getData: async (key: string, options?: { signal?: AbortSignal }) => {
        const url = `${API_URL}/works/${key}.json`;
        const response = await fetch(url, { signal: options?.signal });
        if (!response.ok) throw new Error("No se encontro el libro");
        return await response.json();
    },

    getAutorNombre: async (authorKey: string, options?: { signal?: AbortSignal }): Promise<string | null> => {
        const url = `${API_URL}${authorKey}.json`;
        const response = await fetch(url, { signal: options?.signal });
        if (!response.ok) return null;
        const data = (await response.json()) as { name?: string };
        return data?.name ?? null;
    }
};