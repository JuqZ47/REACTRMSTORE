import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Carrito from '../pages/public/Carrito';

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [],
    carrito: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
    removeFromCart: vi.fn(),
    clearCart: vi.fn()
  })
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    sesion: { email: 'cliente@duoc.cl' }
  })
}));

describe('Pruebas en <Carrito />', () => {
  it('debe renderizar la vista de carrito de compras', () => {
    render(
      <BrowserRouter>
        <Carrito />
      </BrowserRouter>
    );

    expect(screen.getByText(/Carrito de Compras/i)).toBeInTheDocument();
  });
});