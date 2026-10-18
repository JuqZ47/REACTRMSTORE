import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

describe('Pruebas en el componente <Navbar />', () => {
  test('debe renderizar correctamente los enlaces de navegación del sitio público', () => {
    render(
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    );

    // 1. Verificar el logo
    expect(screen.getByText('RM')).toBeInTheDocument();
    expect(screen.getByText('STORE')).toBeInTheDocument();

    // 2. Verificar el menú principal (usando getAllByText para evitar ambigüedad con el dropdown)
    const productosLinks = screen.getAllByText(/productos/i);
    expect(productosLinks.length).toBeGreaterThan(0);

    // 3. Verificar los demás enlaces
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/nosotros/i)).toBeInTheDocument();
    expect(screen.getByText(/blogs/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto/i)).toBeInTheDocument();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });
});