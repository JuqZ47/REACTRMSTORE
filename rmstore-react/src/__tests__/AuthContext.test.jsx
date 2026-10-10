import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as storageService from '../services/storageService';

// Simulación de los usuarios guardados en storageService
vi.mock('../services/storageService', () => ({
  getUsuariosStorage: vi.fn(),
}));

// Componente auxiliar para ejecutar las pruebas
const ComponentePruebaAuth = () => {
  const { sesion, iniciarSesion, cerrarSesion } = useAuth();

  return (
    <div>
      <span data-testid="user-email">{sesion?.email || 'Sin sesión'}</span>
      <span data-testid="user-nombre">{sesion?.nombre || ''}</span>
      <span data-testid="user-rol">{sesion?.rol || ''}</span>

      <button
        onClick={() => iniciarSesion('camila@gmail.com', 'camila123')}
      >
        Login Exitoso
      </button>

      <button
        onClick={() => iniciarSesion('camila@gmail.com', 'clave_erronea')}
      >
        Login Fallido
      </button>

      <button onClick={cerrarSesion}>Cerrar Sesión</button>
    </div>
  );
};

describe('Pruebas en AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();

    // Mock de usuario registrado con clave codificada en Base64 (btoa('camila123') -> 'Y2FtaWxhMTIz')
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

  it('debe iniciar sin sesión activa en sessionStorage', () => {
    render(
      <AuthProvider>
        <ComponentePruebaAuth />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-email')).toHaveTextContent('Sin sesión');
  });

  it('debe iniciar sesión correctamente con credenciales válidas', () => {
    render(
      <AuthProvider>
        <ComponentePruebaAuth />
      </AuthProvider>
    );

    const btnLogin = screen.getByText('Login Exitoso');
    fireEvent.click(btnLogin);

    expect(screen.getByTestId('user-email')).toHaveTextContent('camila@gmail.com');
    expect(screen.getByTestId('user-nombre')).toHaveTextContent('Camila');
    expect(screen.getByTestId('user-rol')).toHaveTextContent('VENDEDOR');
  });

  it('no debe iniciar sesión si la contraseña es incorrecta', () => {
    render(
      <AuthProvider>
        <ComponentePruebaAuth />
      </AuthProvider>
    );

    const btnLoginFallido = screen.getByText('Login Fallido');
    fireEvent.click(btnLoginFallido);

    expect(screen.getByTestId('user-email')).toHaveTextContent('Sin sesión');
  });

  it('debe borrar sessionStorage y limpiar estado al cerrar sesión', () => {
    render(
      <AuthProvider>
        <ComponentePruebaAuth />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login Exitoso'));
    expect(screen.getByTestId('user-email')).toHaveTextContent('camila@gmail.com');

    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(screen.getByTestId('user-email')).toHaveTextContent('Sin sesión');
  });
});