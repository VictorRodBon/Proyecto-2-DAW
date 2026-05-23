import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
describe('Opiniones (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  const sampleOpinion = {
    id_usuario: '05431d5a-6746-4d9a-9cf6-6f7bd28f0fda',
    id_libro: '/works/OL123W',
    puntuacion: 4,
    valoracion: 'Buen libro de prueba',
  };
  it('POST /opiniones debe crear una opinión', async () => {
    const res = await request(app.getHttpServer())
      .post('/opiniones')
      .send(sampleOpinion)
      .expect(201);
    expect(res.body.id_opinion).toBeDefined();
    expect(res.body.puntuacion).toBe(4);
  });
  it('GET /opiniones/libro/:id debe devolver opiniones', async () => {
    const res = await request(app.getHttpServer())
      .get(`/opiniones/libro/${encodeURIComponent(sampleOpinion.id_libro)}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('DELETE /opiniones/:id debe eliminar una opinión existente', async () => {
    // Primero crear
    const created = await request(app.getHttpServer())
      .post('/opiniones')
      .send(sampleOpinion);
    // Luego eliminar
    await request(app.getHttpServer())
      .delete(`/opiniones/${created.body.id_opinion}`)
      .expect(204);
    // Verificar que ya no existe
    await request(app.getHttpServer())
      .delete(`/opiniones/${created.body.id_opinion}`)
      .expect(404);
  });
  it('PATCH /opiniones/:id debe actualizar una opinión', async () => {
    const created = await request(app.getHttpServer())
      .post('/opiniones')
      .send(sampleOpinion);
    const res = await request(app.getHttpServer())
      .patch(`/opiniones/${created.body.id_opinion}`)
      .send({ puntuacion: 5 })
      .expect(200);
    expect(res.body.puntuacion).toBe(5);
  });
});
