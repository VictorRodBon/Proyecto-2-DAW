import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Detalle } from './Detalle-libro';

describe('DetalleLibro (integracion)', () => {
    it('debe mostrar las opiniones cargadas desde la API', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter initialEntries={['/libro/OL123W']}>
                <Routes>
                    <Route path="/libro/:id" element={<Detalle />} />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByRole('button', { name: /ver opiniones/i });
        await user.click(screen.getByRole('button', { name: /ver opiniones/i }));

        expect(await screen.findByText('Buen libro')).toBeInTheDocument();
    });
});
