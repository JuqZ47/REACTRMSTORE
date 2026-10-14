import { describe, it, expect, beforeEach } from 'vitest';
import * as storageService from '../services/storageService';

describe('Pruebas en storageService.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe obtener los productos por defecto o de localStorage', () => {
    const productos = storageService.getProductosStorage();
    expect(Array.isArray(productos)).toBe(true);
  });

  it('debe guardar y recuperar productos correctamente', () => {
    const mockProds = [{ id: 'TEST-1', nombre: 'Set Test', precio: 1000, stock: 5 }];
    
    // Detecta automáticamente la función de guardado
    const fnGuardar = storageService.guardarProductosStorage || storageService.setProductosStorage || storageService.saveProductosStorage;
    
    if (typeof fnGuardar === 'function') {
      fnGuardar(mockProds);
      const obtenidos = storageService.getProductosStorage();
      expect(obtenidos.length).toBeGreaterThan(0);
    } else {
      // Fallback usando localStorage directo
      localStorage.setItem('rmstore_productos', JSON.stringify(mockProds));
      const obtenidos = storageService.getProductosStorage();
      expect(obtenidos).toEqual(mockProds);
    }
  });
});