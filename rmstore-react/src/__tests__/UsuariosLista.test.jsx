import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import UsuariosLista from '../pages/admin/UsuariosLista';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    sesion: { email: 'admin@duoc.cl' }
  })
}));

describe('Pruebas en <UsuariosLista />', () => {
  it('debe renderizar el título de gestión de usuarios y el botón nuevo usuario', () => {
    render(
      <BrowserRouter>
        <UsuariosLista />
      </BrowserRouter>
    );

    expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Nuevo Usuario/i)).toBeInTheDocument();
  });
});