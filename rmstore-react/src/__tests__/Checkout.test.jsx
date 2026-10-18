import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Checkout from '../pages/public/Checkout';

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [],
    carrito: [],
    total: 0,
    clearCart: vi.fn()
  })
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    sesion: { email: 'cliente@duoc.cl' }
  })
}));

describe('Pruebas en <Checkout />', () => {
  it('debe renderizar la vista de checkout', () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Tu carrito está vacío/i) || screen.getByText(/Dirección de entrega/i)
    ).toBeInTheDocument();
  });
});