import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductoForm from '../pages/admin/ProductoForm';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    sesion: { email: 'admin@duoc.cl' }
  })
}));

describe('Pruebas en <ProductoForm />', () => {
  it('debe renderizar el formulario para nuevo producto', () => {
    render(
      <BrowserRouter>
        <ProductoForm />
      </BrowserRouter>
    );

    expect(screen.getByText(/Nuevo Producto/i) || screen.getByText(/Editar Producto/i)).toBeInTheDocument();
  });
});