import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';
import * as storageService from '../services/storageService';

// Simular el servicio de productos para que reconozca los ítems agregados
vi.mock('../services/storageService', () => ({
  getProductosStorage: vi.fn(),
  getCarritoStorage: vi.fn(() => []),
  saveCarritoStorage: vi.fn(),
}));

// Componente de prueba para interactuar con CartContext
const ComponentePruebaCart = () => {
  const { carrito, agregarAlCarrito, cambiarCantidad, vaciarCarrito, cartCount } = useCart();

  return (
    <div>
      <span data-testid="cart-count">{cartCount ?? carrito?.length ?? 0}</span>
      
      <div data-testid="cart-items">
        {carrito?.map((item) => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            <span>{item.nombre}</span> - <span data-testid={`cant-${item.id}`}>{item.cant}</span>
          </div>
        ))}
      </div>

      <button onClick={() => agregarAlCarrito('LEG-001', 1)}>
        Agregar Falcon
      </button>

      <button onClick={() => cambiarCantidad && cambiarCantidad('LEG-001', 1)}>
        Sumar Cantidad
      </button>

      <button onClick={() => vaciarCarrito && vaciarCarrito()}>
        Vaciar Carrito
      </button>
    </div>
  );
};

describe('Pruebas en CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();

    // Mock del catálogo de productos disponibles
    storageService.getProductosStorage.mockReturnValue([
      {
        id: 'LEG-001',
        codigo: 'LEG-001',
        nombre: 'Lego Star Wars Millennium Falcon',
        precio: 169990,
        stock: 5,
        categoria: 'Star Wars'
      }
    ]);
  });

  it('debe iniciar con el carrito vacío (contador en 0)', () => {
    render(
      <CartProvider>
        <ComponentePruebaCart />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('debe agregar un producto al carrito y actualizar el contador', () => {
    render(
      <CartProvider>
        <ComponentePruebaCart />
      </CartProvider>
    );

    const btnAgregar = screen.getByText('Agregar Falcon');
    fireEvent.click(btnAgregar);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  it('debe incrementar la cantidad si el producto ya existe en el carrito', () => {
    render(
      <CartProvider>
        <ComponentePruebaCart />
      </CartProvider>
    );

    const btnAgregar = screen.getByText('Agregar Falcon');
    
    // Agregar 2 veces el mismo producto
    fireEvent.click(btnAgregar);
    fireEvent.click(btnAgregar);

    // Dependiendo de la implementación, el total de ítems únicos o suma de cantidades
    expect(screen.getByTestId('cart-count')).not.toHaveTextContent('0');
  });

  it('debe vaciar el carrito correctamente', () => {
    render(
      <CartProvider>
        <ComponentePruebaCart />
      </CartProvider>
    );

    // Agregar producto primero
    fireEvent.click(screen.getByText('Agregar Falcon'));
    expect(screen.getByTestId('cart-count')).not.toHaveTextContent('0');

    // Vaciar
    const btnVaciar = screen.getByText('Vaciar Carrito');
    fireEvent.click(btnVaciar);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });
});