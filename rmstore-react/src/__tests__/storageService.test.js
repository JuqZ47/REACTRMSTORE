import { describe, it, expect, beforeEach } from 'vitest';
// Ruta corregida apuntando a la carpeta services
import { getProductosStorage, saveProductoStorage } from '../services/storageService';

describe('Pruebas unitarias en storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe retornar la lista inicial de productos cuando localStorage está vacío', () => {
    const productos = getProductosStorage();
    expect(Array.isArray(productos)).toBe(true);
    expect(productos.length).toBeGreaterThan(0);
  });

  it('debe guardar un nuevo producto y actualizar localStorage', () => {
    const nuevoProducto = {
      id: 'TEST-001',
      codigo: 'TEST-001',
      nombre: 'Lego Test Set',
      precio: 19990,
      stock: 5,
      categoria: 'City'
    };

    saveProductoStorage(nuevoProducto);
    const productos = getProductosStorage();
    
    const existe = productos.some((p) => (p.id || p.codigo) === 'TEST-001');
    expect(existe).toBe(true);
  });
});