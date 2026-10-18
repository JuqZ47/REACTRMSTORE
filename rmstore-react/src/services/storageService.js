import { setsIniciales, usuariosIniciales } from '../data/mockData';

// --- PRODUCTOS ---
export const getProductosStorage = () => {
  const prods = localStorage.getItem("rmstore_productos");
  if (!prods) {
    localStorage.setItem("rmstore_productos", JSON.stringify(setsIniciales));
    return setsIniciales;
  }
  return JSON.parse(prods);
};

export const saveProductoStorage = (producto) => {
  const productos = getProductosStorage();
  const index = productos.findIndex(p => (p.id || p.codigo) === (producto.id || producto.codigo));

  if (index !== -1) {
    productos[index] = { ...productos[index], ...producto };
  } else {
    productos.push(producto);
  }

  localStorage.setItem("rmstore_productos", JSON.stringify(productos));
  return productos;
};

export const deleteProductoStorage = (id) => {
  const productos = getProductosStorage().filter(p => (p.id || p.codigo) !== id);
  localStorage.setItem("rmstore_productos", JSON.stringify(productos));
  return productos;
};

// --- USUARIOS ---
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

// --- DESCUENTO DE INVENTARIO (CARRITO / POS) ---
export const descontarStock = (itemsComprados) => {
  const productos = getProductosStorage();
  itemsComprados.forEach(item => {
    const idx = productos.findIndex(p => (p.id || p.codigo) === item.id);
    if (idx !== -1) {
      const stockActual = Number(productos[idx].stock) || 0;
      productos[idx].stock = Math.max(0, stockActual - item.cantidad);
    }
  });
  localStorage.setItem("rmstore_productos", JSON.stringify(productos));
  return productos;
};