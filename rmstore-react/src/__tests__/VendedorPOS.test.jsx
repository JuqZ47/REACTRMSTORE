import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import VendedorPOS from '../pages/admin/VendedorPOS';
import { AuthProvider } from '../context/AuthContext';
import * as storageService from '../services/storageService';

// Mock de storageService
vi.mock('../services/storageService', () => ({
  getProductosStorage: vi.fn(),
  getUsuariosStorage: vi.fn(() => []),
  saveVentaStorage: vi.fn(),
  getCarritoStorage: vi.fn(() => []),
}));

describe('Pruebas en el componente <VendedorPOS />', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.clearAllMocks();

    // Mock global para window.alert y window.print
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'print').mockImplementation(() => {});

    // Productos de prueba para el POS
    storageService.getProductosStorage.mockReturnValue([
      {
        id: 'LEG-001',
        codigo: 'LEG-001',
        nombre: 'Lego Hogwarts Castle',
        precio: 399990,
        stock: 5,
        categoria: 'Harry Potter',
      },
    ]);
  });

  it('debe renderizar la interfaz del POS y mostrar los productos en la grilla', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <VendedorPOS />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Lego Hogwarts Castle')).toBeInTheDocument();
  });

  it('debe agregar el producto al ticket de venta al seleccionarlo', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <VendedorPOS />
        </AuthProvider>
      </BrowserRouter>
    );

    // Seleccionar la tarjeta del producto o el botón de agregar
    const tarjetaProducto = screen.getByText('Lego Hogwarts Castle');
    fireEvent.click(tarjetaProducto);

    // Debe figurar en el detalle o resumen de la boleta
    const elementosNombre = screen.getAllByText('Lego Hogwarts Castle');
    expect(elementosNombre.length).toBeGreaterThan(1);
  });
});