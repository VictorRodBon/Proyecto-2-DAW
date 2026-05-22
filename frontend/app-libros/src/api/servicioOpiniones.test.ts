import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('servicioOpiniones', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('postOpinion debe crear una opinion correctamente', async () => {
        const fakeResponse = {
            id_opinion: 11,
            id_usuario: '545a16bf-1fb2-45a7-a3a5-8995f55e4f36',
            id_libro: '/worksOL123w',
            puntuacion: 4,
            valoracion: 'Buen libro'
        };
        
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(fakeResponse)
        });

        const { servicioOpiniones } = await import('./servicioOpiniones');
        const result = await servicioOpiniones.postOpinion({
            id_usuario: 'user-1', // Corregido: id_usuario
            id_libro: 'works/OL123W',
            puntuacion: 4,
            valoracion: 'Buen libro',
        });

        expect(result).toEqual(fakeResponse);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/opiniones',
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('postOpinion debe devolver null si la API falla', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        });

        // Interceptamos el console.error para que no "ensucie" la terminal del test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { servicioOpiniones } = await import('./servicioOpiniones');
        const result = await servicioOpiniones.postOpinion({
            id_usuario: 'user-1', // Corregido: id_usuario
            id_libro: 'works/OL123W',
            puntuacion: 4,
            valoracion: 'Buen libro',
        });

        expect(result).toBeNull();
        
        expect(consoleSpy).toHaveBeenCalled();
    });
});