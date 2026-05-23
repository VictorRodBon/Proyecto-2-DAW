import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Libro } from './Libro';

const meta: Meta<typeof Libro> = {
    title: 'componentes/Libro',
    component: Libro,
    decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
};

export default meta;
type Story = StoryObj<typeof Libro>;

export const PorDefecto: Story = {
    args: {
        datos: {
            key: '/works/OL123W',
            title: 'Cien Años de Soledad',
            author_name: 'Gabriel García Márquez',
            cover_i: '123',
        },
    },
};

export const SinPortada: Story = {
    args: {
        datos: {
            key: '/works/OL456W',
            title: 'El Quijote',
            author_name: 'Miguel de Cervantes',
        },
    },
};

export const TituloLargo: Story = {
    args: {
        datos: {
            key: '/works/OL789W',
            title: 'Historia de dos ciudades que se parecen mucho entre sí pero no tanto',
            author_name: 'Charles Dickens',
            cover_i: '456',
        },
    },
};
