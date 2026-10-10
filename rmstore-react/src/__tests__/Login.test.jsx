import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Login from '../pages/public/Login'; 
import { AuthProvider } from '../context/AuthContext';
import * as storageService from '../services/storageService';

// Mock de storageService
vi.mock('../services/storageService', () => ({
  getUsuariosStorage: vi.fn(),
  getProductosStorage: vi.fn(() => []),
  getCarritoStorage: vi.fn(() => []),
}));

describe('Pruebas en el componente <Login />', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.clearAllMocks();

    // Mock global para window.alert en JSDOM
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock del usuario Vendedor registrado (clave 'camila123' en Base64)
    storageService.getUsuariosStorage.mockReturnValue([
      {
        run: '12345678-9',
        nombre: 'Camila',
        email: 'camila@gmail.com',
        pass: btoa('camila123'),
        rol: 'VENDEDOR',
      },
    ]);
  });

  it('debe permitir escribir en los campos de correo y contraseña', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const inputEmail = screen.getByPlaceholderText(/correo@dominio.cl/i);
    const inputPass = screen.getByPlaceholderText(/tu contraseña/i);

    fireEvent.change(inputEmail, { target: { value: 'camila@gmail.com' } });
    fireEvent.change(inputPass, { target: { value: 'camila123' } });

    expect(inputEmail.value).toBe('camila@gmail.com');
    expect(inputPass.value).toBe('camila123');
  });

  it('debe mostrar mensaje de error interno al intentar enviar el formulario vacío', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const btnIngresar = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(btnIngresar);

    expect(screen.getByText(/por favor, completa ambos campos/i)).toBeInTheDocument();
  });

  it('debe llamar al alert de bienvenida e iniciar sesión correctamente con credenciales válidas', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const inputEmail = screen.getByPlaceholderText(/correo@dominio.cl/i);
    const inputPass = screen.getByPlaceholderText(/tu contraseña/i);
    const btnIngresar = screen.getByRole('button', { name: /ingresar/i });

    fireEvent.change(inputEmail, { target: { value: 'camila@gmail.com' } });
    fireEvent.change(inputPass, { target: { value: 'camila123' } });
    fireEvent.click(btnIngresar);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('¡Bienvenido al sistema de ventas, Camila!')
    );
  });
});