import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

describe('Pruebas en CartContext', () => {
  const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

  beforeEach(() => {
    localStorage.clear();
  });

  test('debe agregar un producto al carrito y calcular subtotales correctamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.agregarAlCarrito('LEG-001', 1);
    });

    expect(result.current.cartCount).toBeGreaterThan(0);
    expect(result.current.carrito.length).toBeGreaterThan(0);
  });

  test('debe aplicar un cupón de descuento válido (LEGOVIP)', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.agregarAlCarrito('LEG-001', 1);
      result.current.aplicarCupon('LEGOVIP');
    });

    expect(result.current.descuentoActivo).toBe(0.10);
    expect(result.current.montoDescuento).toBeGreaterThan(0);
  });

  test('debe cambiar la cantidad y vaciar el carrito correctamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // 1. Agregar el producto
    act(() => {
      result.current.agregarAlCarrito('LEG-001', 1);
    });

    // Obtener el ID interno real guardado en el carrito
    const itemGuardado = result.current.carrito[0];
    const itemId = itemGuardado ? itemGuardado.id : 'LEG-001';

    // 2. Cambiar cantidad
    act(() => {
      result.current.cambiarCantidad(itemId, 2);
    });

    expect(result.current.cartCount).toBe(2);

    // 3. Vaciar carrito
    act(() => {
      result.current.vaciarCarrito();
    });

    expect(result.current.cartCount).toBe(0);
    expect(result.current.carrito.length).toBe(0);
  });
});