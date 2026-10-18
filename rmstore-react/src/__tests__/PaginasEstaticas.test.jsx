import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Nosotros from '../pages/public/Nosotros';
import Contacto from '../pages/public/Contacto';
import Blogs from '../pages/public/Blogs';
import Registro from '../pages/public/Registro';

describe('Pruebas de renderizado en Páginas Públicas Estáticas', () => {
  it('debe renderizar la página Nosotros', () => {
    render(
      <BrowserRouter>
        <Nosotros />
      </BrowserRouter>
    );
    expect(screen.getByText(/Nosotros/i) || screen.getByText(/RMSTORE/i)).toBeInTheDocument();
  });

  it('debe renderizar la página Contacto', () => {
    render(
      <BrowserRouter>
        <Contacto />
      </BrowserRouter>
    );
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it('debe renderizar la página Blogs', () => {
    render(
      <BrowserRouter>
        <Blogs />
      </BrowserRouter>
    );
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
  });

  it('debe renderizar la página Registro', () => {
    render(
      <BrowserRouter>
        <Registro />
      </BrowserRouter>
    );
    expect(screen.getByText(/REGISTRO DE USUARIO/i)).toBeInTheDocument();
  });
});