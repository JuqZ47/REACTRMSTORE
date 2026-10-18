import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import UsuarioForm from '../pages/admin/UsuarioForm';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    sesion: { email: 'admin@duoc.cl' }
  })
}));

describe('Pruebas en <UsuarioForm />', () => {
  it('debe renderizar los campos del formulario de usuario', () => {
    render(
      <BrowserRouter>
        <UsuarioForm />
      </BrowserRouter>
    );

    expect(screen.getByText(/Nuevo Usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo Electrónico \*/i)).toBeInTheDocument();
  });
});