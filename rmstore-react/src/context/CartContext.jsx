import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProductosStorage } from '../services/storageService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('rmstore_carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const [cupon, setCupon] = useState(null);

  // Estado para controlar la notificación emergente global
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', producto: '' });

  useEffect(() => {
    localStorage.setItem('rmstore_carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Función interna para mostrar y ocultar el toast en 2.5 segundos
  const mostrarNotificacion = (mensaje, producto = '') => {
    setNotificacion({ visible: true, mensaje, producto });
    setTimeout(() => {
      setNotificacion({ visible: false, mensaje: '', producto: '' });
    }, 2500);
  };

  // Agregar al carrito con revalidación estricta de stock y notificación global
  const agregarAlCarrito = (productoId, cantidadDeseada = 1) => {
    const productos = getProductosStorage();
    const productoOriginal = productos.find((p) => p.id === productoId || p.codigo === productoId);

    if (!productoOriginal) {
      alert('El producto no existe en el catálogo.');
      return { exito: false, mensaje: 'Producto no encontrado' };
    }

    const itemEnCarrito = carrito.find((item) => item.id === productoOriginal.id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cant : 0;
    const nuevaCantidadTotal = cantidadActual + cantidadDeseada;

    if (nuevaCantidadTotal > productoOriginal.stock) {
      const disponibles = productoOriginal.stock - cantidadActual;
      const msj = disponibles > 0
        ? `Solo quedan ${disponibles} unidades disponibles en stock.`
        : 'Has alcanzado el límite máximo de stock disponible para este producto.';
      alert(msj);
      return { exito: false, mensaje: msj };
    }

    if (itemEnCarrito) {
      setCarrito(
        carrito.map((item) =>
          item.id === productoOriginal.id
            ? { ...item, cant: nuevaCantidadTotal, precio: productoOriginal.precio }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          id: productoOriginal.id,
          codigo: productoOriginal.codigo,
          nombre: productoOriginal.nombre,
          precio: productoOriginal.precio,
          imagen: productoOriginal.imagen,
          categoria: productoOriginal.categoria,
          cant: cantidadDeseada,
          stockMaximo: productoOriginal.stock,
        },
      ]);
    }

    // DISPARAR NOTIFICACIÓN GLOBAL CON EL NOMBRE DEL PRODUCTO
    mostrarNotificacion('¡Producto agregado al carrito!', productoOriginal.nombre);

    return { exito: true };
  };

  const cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const productos = getProductosStorage();
    const productoOriginal = productos.find((p) => p.id === productoId || p.codigo === productoId);

    if (productoOriginal && nuevaCantidad > productoOriginal.stock) {
      alert(`No puedes agregar más de ${productoOriginal.stock} unidades de este producto.`);
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.id === productoId ? { ...item, cant: nuevaCantidad } : item
      )
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter((item) => item.id !== productoId));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setCupon(null);
  };

  const aplicarCupon = (codigo) => {
    if (codigo.trim().toUpperCase() === 'LEGOVIP') {
      setCupon(0.10); // 10% de descuento
      return { exito: true, mensaje: '¡Cupón LEGOVIP del 10% aplicado!' };
    }
    return { exito: false, mensaje: 'Cupón inválido' };
  };

  // Cálculos consolidados
  const subtotal = carrito.reduce((acc, item) => acc + (Number(item.precio) || 0) * (item.cant || 0), 0);
  const descuentoActivo = cupon ? cupon : 0;
  const montoDescuento = subtotal * descuentoActivo;
  const totalFinal = subtotal - montoDescuento;
  const cartCount = carrito.reduce((acc, item) => acc + (item.cant || 0), 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        aplicarCupon,
        subtotal,
        montoDescuento,
        totalFinal,
        descuentoActivo,
        cartCount,
      }}
    >
      {children}

      {/* TOAST GLOBAL VISIBLE EN TODA LA APLICACIÓN */}
      {notificacion.visible && (
        <div 
          className="position-fixed top-0 end-0 p-3" 
          style={{ zIndex: 1090, marginTop: '70px' }}
        >
          <div className="alert alert-success border-0 shadow-lg d-flex align-items-center gap-3 rounded-4 py-3 px-4 text-white bg-success">
            <i className="bi bi-cart-check-fill fs-3"></i>
            <div>
              <strong className="d-block">{notificacion.mensaje}</strong>
              <small className="opacity-90">{notificacion.producto}</small>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white ms-auto" 
              onClick={() => setNotificacion({ visible: false, mensaje: '', producto: '' })}
            ></button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);