# Guía de Pruebas — Proyecto-2-DAW

## Stack del proyecto

| Capa | Tecnología |
|---|---|
| Backend | NestJS 11 + TypeScript + Prisma + PostgreSQL (Supabase) |
| Frontend | React 19 + TypeScript + Vite 8 + MUI 9 |
| Auth / Storage | Supabase |
| API externa | Open Library |

---

## Índice

1. [Unitarias](#1-pruebas-unitarias)
2. [Integración](#2-pruebas-de-integración)
3. [Extremo a extremo (E2E)](#3-pruebas-e2e)
4. [Visuales](#4-pruebas-visuales)
5. [Carga](#5-pruebas-de-carga)

---

## 1. Pruebas Unitarias

### Backend (NestJS + Jest)

El backend ya usa **Jest** con `ts-jest`. Los tests unitarios verifican servicios de forma aislada, mockeando Prisma.

#### Estructura básica

Los archivos de test se colocan junto al código fuente: `*.spec.ts`.

#### Mockear PrismaService

Crea un `PrismaService` mock en cada test para no depender de la base de datos real:

```typescript
// src/usuarios/usuarios.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: PrismaService;

  const mockPrisma = {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debe devolver un usuario existente', async () => {
    const fakeUser = {
      id: 'user-1',
      nombre_usuario: 'testuser',
      estado: 'activo',
      rol: 'usuario',
      foto_perfil: null,
      fecha_creacion: new Date(),
    };
    mockPrisma.usuario.findUnique.mockResolvedValue(fakeUser);

    const result = await service.findMe('user-1');
    expect(result).toEqual(fakeUser);
    expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: expect.any(Object),
    });
  });

  it('debe lanzar NotFoundException si el usuario no existe', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(null);

    await expect(service.findMe('no-existe')).rejects.toThrow(NotFoundException);
  });

  it('debe actualizar un usuario existente', async () => {
    const dto = { nombre_usuario: 'nuevoNombre' };
    const updatedUser = {
      id: 'user-1',
      nombre_usuario: 'nuevoNombre',
      estado: 'activo',
      rol: 'usuario',
      foto_perfil: null,
      fecha_creacion: new Date(),
    };

    mockPrisma.usuario.findUnique.mockResolvedValue(updatedUser);
    mockPrisma.usuario.update.mockResolvedValue(updatedUser);

    const result = await service.updateMe('user-1', dto);
    expect(result.nombre_usuario).toBe('nuevoNombre');
  });
});
```

#### OpinionesService — casos de error y flujo feliz

```typescript
// src/opiniones/opiniones.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesService } from './opiniones.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('OpinionesService', () => {
  let service: OpinionesService;
  const mockPrisma = {
    opiniones: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpinionesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OpinionesService>(OpinionesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debe crear una opinión', async () => {
      const dto = {
        id_usuario: 'user-1',
        id_libro: '/works/OL123W',
        puntuacion: 4,
        valoracion: 'Buen libro',
      };
      const created = { id_opinion: 1, ...dto, fecha_creacion: new Date() };
      mockPrisma.opiniones.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(mockPrisma.opiniones.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findByLibro', () => {
    it('debe devolver opiniones ordenadas por fecha', async () => {
      const opinions = [
        { id_opinion: 2, id_libro: '/works/OL123W', puntuacion: 5, fecha_creacion: new Date('2025-01-02') },
        { id_opinion: 1, id_libro: '/works/OL123W', puntuacion: 3, fecha_creacion: new Date('2025-01-01') },
      ];
      mockPrisma.opiniones.findMany.mockResolvedValue(opinions);

      const result = await service.findByLibro('/works/OL123W');
      expect(result).toHaveLength(2);
      expect(mockPrisma.opiniones.findMany).toHaveBeenCalledWith({
        where: { id_libro: '/works/OL123W' },
        orderBy: { fecha_creacion: 'desc' },
      });
    });
  });

  describe('update', () => {
    it('debe actualizar una opinión existente', async () => {
      const existing = { id_opinion: 1, puntuacion: 3, valoracion: 'OK' };
      mockPrisma.opiniones.findUnique.mockResolvedValue(existing);
      mockPrisma.opiniones.update.mockResolvedValue({ ...existing, puntuacion: 5 });

      const result = await service.update(1, { puntuacion: 5 });
      expect(result.puntuacion).toBe(5);
    });

    it('debe lanzar NotFoundException si la opinión no existe', async () => {
      mockPrisma.opiniones.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { puntuacion: 5 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar una opinión existente', async () => {
      mockPrisma.opiniones.findUnique.mockResolvedValue({ id_opinion: 1 });
      mockPrisma.opiniones.delete.mockResolvedValue({ id_opinion: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Opinión #1 eliminada correctamente' });
    });

    it('debe lanzar NotFoundException al eliminar una opinión inexistente', async () => {
      mockPrisma.opiniones.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
```

#### LecturasService — fechas y estados

```typescript
// src/lecturas/lecturas.service.spec.ts
describe('LecturasService', () => {
  // Mock similar al de opiniones. Casos clave:
  // - create con fechas y sin fechas
  // - findByUsuario ordenado
  // - update solo con campos proporcionados (spread condicional)
  // - remove con NotFoundException
});
```

#### Testear controladores

Los controladores se testean mockeando el servicio:

```typescript
// src/usuarios/usuarios.controller.spec.ts
describe('UsuariosController', () => {
  let controller: UsuariosController;
  const mockService = {
    findMe: jest.fn(),
    updateMe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: mockService }],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  it('GET /me/:id debe llamar al servicio', async () => {
    mockService.findMe.mockResolvedValue({ id: 'user-1', nombre_usuario: 'test' });
    const result = await controller.findMe('user-1');
    expect(mockService.findMe).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ id: 'user-1', nombre_usuario: 'test' });
  });
});
```

#### Comandos

```bash
cd backend
npm run test            # Un solo ciclo
npm run test:watch      # Modo watch
npm run test:cov        # Con cobertura
```

---

### Frontend (React + Vitest)

Actualmente el frontend **no tiene test framework**. Se recomienda **Vitest** (nativo de Vite).

#### Instalación

```bash
cd frontend/app-libros
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

#### Configuración en `vite.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

#### Setup (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom';
```

#### Añadir script en `package.json`

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

#### Test unitario de un servicio API

```typescript
// src/api/servicioOpiniones.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('servicioOpiniones', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('postOpinion debe crear una opinión correctamente', async () => {
    const fakeResponse = {
      id_opinion: 1,
      id_usuario: 'user-1',
      id_libro: '/works/OL123W',
      puntuacion: 4,
      valoracion: 'Buen libro',
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeResponse),
    });

    const { servicioOpiniones } = await import('./servicioOpiniones');
    const result = await servicioOpiniones.postOpinion({
      id_usuario: 'user-1',
      id_libro: '/works/OL123W',
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
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { servicioOpiniones } = await import('./servicioOpiniones');
    const result = await servicioOpiniones.postOpinion({
      id_usuario: 'user-1',
      id_libro: '/works/OL123W',
      puntuacion: 4,
      valoracion: 'Buen libro',
    });

    expect(result).toBeNull();
  });
});
```

#### Test unitario de un componente React

```typescript
// src/components/componente-libro/Libro.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Libro } from './Libro'; // Ajusta según el nombre real

describe('Libro', () => {
  const libroProps = {
    id: '/works/OL123W',
    titulo: 'Cien Años de Soledad',
    autor: 'Gabriel García Márquez',
    portada: 'https://covers.openlibrary.org/b/id/123.jpg',
  };

  it('debe renderizar el título y autor', () => {
    render(
      <MemoryRouter>
        <Libro {...libroProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Cien Años de Soledad')).toBeInTheDocument();
    expect(screen.getByText('Gabriel García Márquez')).toBeInTheDocument();
  });

  it('debe mostrar la imagen de portada', () => {
    render(
      <MemoryRouter>
        <Libro {...libroProps} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', libroProps.portada);
  });

  it('debe tener un enlace al detalle del libro', () => {
    render(
      <MemoryRouter>
        <Libro {...libroProps} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/works/OL123W'));
  });
});
```

---

## 2. Pruebas de Integración

### Backend (Servicio + Prisma real)

Usan una base de datos real (p.ej. PostgreSQL de pruebas o SQLite con Prisma).

#### Configurar base de datos de test

Crea un archivo `.env.test`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/proyecto2_test"
```

#### Test de integración para OpinionesService

```typescript
// src/opiniones/opiniones.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesService } from './opiniones.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('OpinionesService (integracion)', () => {
  let service: OpinionesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OpinionesService],
    }).compile();

    service = module.get<OpinionesService>(OpinionesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpiar datos de test
    await prisma.opiniones.deleteMany();
    // También limpiar lecturas y usuarios si afectan las FK
    // Insertar datos semilla si es necesario
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('debe crear y recuperar opiniones por libro', async () => {
    const dto = {
      id_usuario: 'user-test-1',
      id_libro: '/works/OL123W',
      puntuacion: 5,
      valoracion: 'Excelente',
    };

    const created = await service.create(dto);
    expect(created.id_opinion).toBeDefined();
    expect(created.puntuacion).toBe(5);

    const opinions = await service.findByLibro('/works/OL123W');
    expect(opinions).toHaveLength(1);
    expect(opinions[0].valoracion).toBe('Excelente');
  });
});
```

#### Script en package.json

```json
"test:integration": "dotenv -e .env.test -- jest --testMatch '**/*.integration.spec.ts'"
```

Se necesita `npm install -D dotenv-cli`.

---

### Frontend (Componente + API mockeada)

Usa **MSW** (Mock Service Worker) para interceptar peticiones HTTP reales:

```bash
npm install -D msw
```

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3000/opiniones/libro/:id', ({ params }) => {
    return HttpResponse.json([
      { id_opinion: 1, id_libro: params.id, puntuacion: 4, valoracion: 'Buen libro' },
    ]);
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

```typescript
// src/test/setup.ts (añadir)
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```typescript
// Test de componente con datos reales mockeados
import { render, screen } from '@testing-library/react';
import { DetalleLibro } from './DetalleLibro';

describe('DetalleLibro (integracion)', () => {
  it('debe mostrar las opiniones cargadas desde la API', async () => {
    render(<DetalleLibro idLibro="/works/OL123W" />);
    expect(await screen.findByText('Buen libro')).toBeInTheDocument();
  });
});
```

---

## 3. Pruebas E2E

### Backend (HTTP con supertest)

El proyecto ya tiene `supertest` y una base E2E en `backend/test/app.e2e-spec.ts`.

#### Test E2E de opiniones

```typescript
// backend/test/opiniones.e2e-spec.ts
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
    id_usuario: 'test-user-id',
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
      .get(`/opiniones/libro/${sampleOpinion.id_libro}`)
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
      .expect(200);

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
```

#### Ejecutar

```bash
cd backend
npm run test:e2e
```

---

### Full-stack (Playwright)

Las pruebas E2E completas (frontend + backend real desplegado) se hacen con **Playwright**.

#### Instalación

```bash
cd frontend/app-libros
npm install -D @playwright/test
npx playwright install chromium
```

#### Configuración (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

#### Test E2E — flujo de opiniones

```typescript
// frontend/app-libros/e2e/opiniones.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Flujo de opiniones', () => {
  test('usuario puede ver opiniones de un libro', async ({ page }) => {
    await page.goto('/libro/OL123W');
    await expect(page.locator('[data-testid="lista-opiniones"]')).toBeVisible();
  });

  test('usuario autenticado puede crear una opinión', async ({ page }) => {
    // Login primero
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="btn-login"]');
    await page.waitForURL('/');

    // Ir a un libro y opinar
    await page.goto('/libro/OL123W');
    await page.fill('[data-testid="valoracion"]', 'Gran libro de prueba');
    await page.click('[data-testid="puntuacion-5"]');
    await page.click('[data-testid="btn-enviar-opinion"]');

    await expect(page.locator('[data-testid="opinion-usuario"]')).toContainText(
      'Gran libro de prueba'
    );
  });
});
```

Añadir script:

```json
"test:e2e": "playwright test"
```

---

## 4. Pruebas Visuales

### Storybook + Chromatic

Verifican que los componentes se vean correctamente y detectan regresiones visuales.

#### Instalación

```bash
cd frontend/app-libros
npx storybook@latest init
```

#### Story de un componente

```typescript
// src/components/componente-libro/Libro.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Libro } from './Libro';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Libro> = {
  title: 'Componentes/Libro',
  component: Libro,
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  argTypes: {
    portada: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Libro>;

export const PorDefecto: Story = {
  args: {
    id: '/works/OL123W',
    titulo: 'Cien Años de Soledad',
    autor: 'Gabriel García Márquez',
    portada: 'https://covers.openlibrary.org/b/id/123.jpg',
  },
};

export const SinPortada: Story = {
  args: {
    id: '/works/OL456W',
    titulo: 'El Quijote',
    autor: 'Miguel de Cervantes',
    portada: '',
  },
};

export const TituloLargo: Story = {
  args: {
    id: '/works/OL789W',
    titulo: 'Historia de dos ciudades que se parecen mucho entre sí pero no tanto',
    autor: 'Charles Dickens',
    portada: 'https://covers.openlibrary.org/b/id/456.jpg',
  },
};
```

#### Chromatic (regresión visual)

```bash
npx chromatic --project-token=<CHROMATIC_TOKEN>
```

Se integra en CI para detectar cambios visuales no intencionados en cada PR.

---

## 5. Pruebas de Carga

### k6

Pruebas de estrés sobre los endpoints del backend.

#### Instalación

```bash
# Linux (Debian/Ubuntu)
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update && sudo apt install k6

# O con npm
npm install -g k6
```

#### Test de carga para opiniones

```javascript
// backend/test/load/opiniones.load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const fallos = new Rate('fallos');
const tiempoRespuesta = new Trend('tiempo_respuesta');

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Subir a 20 usuarios
    { duration: '1m', target: 20 },     // Mantener
    { duration: '30s', target: 50 },    // Subir a 50
    { duration: '1m', target: 50 },     // Mantener
    { duration: '30s', target: 0 },     // Bajar
  ],
  thresholds: {
    fallos: ['rate<0.01'],              // < 1% de errores
    http_req_duration: ['p(95)<2000'],  // 95% de peticiones < 2s
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  // GET opiniones de un libro
  const res = http.get(`${BASE_URL}/opiniones/libro/OL123W`);
  check(res, {
    'status es 200': (r) => r.status === 200,
    'respuesta es array': (r) => Array.isArray(JSON.parse(r.body)),
  });
  fallos.add(res.status !== 200);
  tiempoRespuesta.add(res.timings.duration);

  sleep(1);
}
```

#### Ejecutar

```bash
k6 run backend/test/load/opiniones.load.js
```

#### Test de carga para múltiples endpoints

```javascript
// backend/test/load/completo.load.js
export default function () {
  const endpoints = [
    { method: 'GET', url: '/usuarios/me/user-1' },
    { method: 'GET', url: '/opiniones/libro/OL123W' },
    { method: 'GET', url: '/lecturas/usuario/user-1' },
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

  const res = http.get(`${BASE_URL}${endpoint.url}`);
  check(res, { 'status es 200': (r) => r.status === 200 });
  fallos.add(res.status !== 200);

  sleep(0.5);
}
```

---

## Resumen de herramientas

| Tipo | Backend | Frontend |
|---|---|---|
| Unitarias | Jest (built-in) | Vitest + Testing Library |
| Integración | Jest + Prisma real | Vitest + MSW |
| E2E | supertest + NestJS | Playwright |
| Visuales | — | Storybook + Chromatic |
| Carga | k6 | — |

---

## Buenas prácticas generales

1. **Aislar dependencias externas** — mockea Prisma, Supabase, fetch
2. **Testear casos borde** — IDs inexistentes, payloads vacíos, fechas nulas
3. **Nombrar tests descriptivos** — `debe lanzar NotFoundException si el usuario no existe`
4. **Mantener tests rápidos** — unitarios < 100ms, integración < 1s, E2E < 30s
5. **Ejecutar en CI** — integra los tests en GitHub Actions para cada PR
6. **Data-testid** — usa `data-testid` en lugar de selectores CSS frágiles en tests E2E
