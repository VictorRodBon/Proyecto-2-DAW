import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3000';
const OPEN_LIBRARY = 'https://openlibrary.org';

export const handlers = [
  http.get(`${API_URL}/opiniones/libro/:id`, ({ params }) => {
    return HttpResponse.json([
      { id_opinion: 1, id_libro: params.id, puntuacion: 4, valoracion: 'Buen libro' },
    ]);
  }),

  http.get(`${OPEN_LIBRARY}/works/:key.json`, ({ params }) => {
    return HttpResponse.json({
      key: `/works/${params.key}`,
      title: 'Cien Años de Soledad',
      description: { value: 'Una obra maestra' },
      covers: [12345],
      first_publish_date: '1967',
      authors: [{ author: { key: '/authors/OL123A' } }],
    });
  }),

  http.get(`${OPEN_LIBRARY}/authors/:key.json`, () => {
    return HttpResponse.json({ name: 'Gabriel García Márquez' });
  }),
];
