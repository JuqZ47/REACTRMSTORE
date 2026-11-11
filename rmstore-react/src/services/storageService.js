import { usuariosIniciales } from '../data/mockData';

// URL base de tu microservicio de catálogo en Spring Boot
const API_URL = 'http://localhost:8080/api/v1/productos';

// ==========================================
// --- PRODUCTOS (SPRING BOOT API REST) ---
// ==========================================

// 1. Obtener todos los productos (GET)
export const getProductosStorage = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener productos desde el servidor');
    return await response.json();
  } catch (error) {
    console.error('Error en GET /api/v1/productos:', error);
    return [];
  }
};

// 2. Crear o actualizar un producto (POST)
export const saveProductoStorage = async (producto) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) throw new Error('Error al guardar el producto');
    return await response.json();
  } catch (error) {
    console.error('Error en POST /api/v1/productos/add:', error);
    return null;
  }
};

// 3. Eliminar un producto (DELETE)
export const deleteProductoStorage = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el producto');
    return await getProductosStorage();
  } catch (error) {
    console.error(`Error en DELETE /api/v1/productos/${id}:`, error);
    return [];
  }
};

// 4. Descontar stock tras una compra (Opcional por API)
export const descontarStock = async (itemsComprados) => {
  // Se obtiene el catálogo actual y se envían las actualizaciones correspondientes
  const productos = await getProductosStorage();
  for (const item of itemsComprados) {
    const prod = productos.find(p => (p.id || p.codigo) === item.id);
    if (prod) {
      const nuevoStock = Math.max(0, (Number(prod.stock) || 0) - item.cant);
      await saveProductoStorage({ ...prod, stock: nuevoStock });
    }
  }
  return await getProductosStorage();
};

// ==========================================
// --- USUARIOS (MANTENIDOS EN LOCALSTORAGE) ---
// ==========================================

export const getUsuariosStorage = () => {
  const users = localStorage.getItem("rmstore_usuarios");
  if (!users) {
    localStorage.setItem("rmstore_usuarios", JSON.stringify(usuariosIniciales));
    return usuariosIniciales;
  }
  return JSON.parse(users);
};

export const saveUsuarioStorage = (usuario) => {
  const usuarios = getUsuariosStorage();
  const index = usuarios.findIndex(u => u.run.toUpperCase() === usuario.run.toUpperCase());

  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...usuario };
  } else {
    usuarios.push(usuario);
  }

  localStorage.setItem("rmstore_usuarios", JSON.stringify(usuarios));
  return usuarios;
};

export const deleteUsuarioStorage = (identificador) => {
  const usuarios = getUsuariosStorage().filter(u => u.run !== identificador && u.email !== identificador);
  localStorage.setItem("rmstore_usuarios", JSON.stringify(usuarios));
  return usuarios;
};