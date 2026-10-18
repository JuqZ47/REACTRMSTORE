import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProductosLista from '../pages/admin/ProductosLista';
import { AuthProvider } from '../context/AuthContext';
import * as storageService from '../services/storageService';

vi.mock('../services/storageService', () => ({
  getProductosStorage: vi.fn(),
  deleteProductoStorage: vi.fn(),
  getUsuariosStorage: vi.fn(() => []),
}));

describe('Pruebas en <ProductosLista />', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.clearAllMocks();

    storageService.getProductosStorage.mockReturnValue([
      {
        id: 'LEG-001',
        codigo: 'LEG-001',
        nombre: 'Lego Millennium Falcon',
        precio: 169990,
        stock: 5,
        categoria: 'Star Wars',
      },
    ]);
  });

  it('debe renderizar la tabla con la lista de productos', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProductosLista />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Lego Millennium Falcon')).toBeInTheDocument();
    
    // Usamos getAllByText porque "Star Wars" aparece en el selector y en la tabla
    const elementosStarWars = screen.getAllByText('Star Wars');
    expect(elementosStarWars.length).toBeGreaterThan(0);
  });

  it('debe filtrar productos al escribir en el buscador', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProductosLista />
        </AuthProvider>
      </BrowserRouter>
    );

    const inputBuscar = screen.getByPlaceholderText(/buscar por código o nombre/i) || screen.getByRole('textbox');
    fireEvent.change(inputBuscar, { target: { value: 'Inexistente' } });

    expect(screen.queryByText('Lego Millennium Falcon')).not.toBeInTheDocument();
  });
});