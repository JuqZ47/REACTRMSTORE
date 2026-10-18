import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../components/store/ProductCard';

const mockProducto = {
  id: 'LEG-001',
  codigo: 'LEG-001',
  nombre: 'Lego Star Wars Millennium Falcon',
  precio: 169990,
  stock: 12,
  categoria: 'Star Wars',
  imagen: '/img/falcon.png'
};

describe('Pruebas en <ProductCard />', () => {
  it('debe renderizar el nombre y el precio del producto formateado en CLP', () => {
    render(
      <BrowserRouter>
        <ProductCard producto={mockProducto} onAddToCart={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Lego Star Wars Millennium Falcon')).toBeInTheDocument();
    expect(screen.getByText('$169.990')).toBeInTheDocument();
  });

  it('debe llamar a la función onAddToCart al hacer clic en Añadir al Carrito', () => {
    const handleAddToCart = vi.fn();

    render(
      <BrowserRouter>
        <ProductCard producto={mockProducto} onAddToCart={handleAddToCart} />
      </BrowserRouter>
    );

    const btnAgregar = screen.getByRole('button', { name: /añadir al carrito/i });
    fireEvent.click(btnAgregar);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    // Ajustado a los argumentos reales que envía tu componente: (id, cantidad)
    expect(handleAddToCart).toHaveBeenCalledWith('LEG-001', 1);
    
  });
});