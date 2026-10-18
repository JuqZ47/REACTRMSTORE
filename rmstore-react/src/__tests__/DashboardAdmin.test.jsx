import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import DashboardAdmin from '../pages/admin/DashboardAdmin';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    sesion: { email: 'admin@duoc.cl', rol: 'ADMINISTRADOR' }
  })
}));

describe('Pruebas en <DashboardAdmin />', () => {
  it('debe renderizar los títulos de métricas y el correo del usuario', () => {
    render(
      <BrowserRouter>
        <DashboardAdmin />
      </BrowserRouter>
    );

    expect(screen.getByText(/TOTAL PRODUCTOS/i)).toBeInTheDocument();
    expect(screen.getByText(/STOCK CRÍTICO/i)).toBeInTheDocument();
    expect(screen.getByText(/USUARIOS REGISTRADOS/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@duoc.cl/i)).toBeInTheDocument();
  });
});