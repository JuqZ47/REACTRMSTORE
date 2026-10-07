import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProductosStorage } from '../services/storageService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("rmstore_carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  const [descuentoActivo, setDescuentoActivo] = useState(0);

  useEffect(() => {
    localStorage.setItem("rmstore_carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (idProducto, cantidad = 1) => {
    const catalogo = getProductosStorage();
    const producto = catalogo.find(p => (p.id || p.codigo) === idProducto);

    if (!producto) {
      alert("Producto no encontrado.");
      return;
    }

    const stockDisponible = Number(producto.stock) || 0;
    if (stockDisponible <= 0) {
      alert(`Lo sentimos, el producto "${producto.nombre}" está agotado.`);
      return;
    }

    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === idProducto);

      if (itemExistente) {
        if (itemExistente.cantidad + cantidad > stockDisponible) {
          alert(`No hay suficiente stock. Máximo disponible: ${stockDisponible}`);
          return prevCarrito;
        }
        return prevCarrito.map(item =>
          item.id === idProducto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        if (cantidad > stockDisponible) {
          alert(`No hay suficiente stock. Máximo disponible: ${stockDisponible}`);
          return prevCarrito;
        }
        const nuevaImagen = (producto.imagenes && producto.imagenes.length > 0) 
          ? producto.imagenes[0] 
          : (producto.imagen || "/img/lego-default.png");

        return [
          ...prevCarrito,
          {
            id: producto.id || producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: nuevaImagen,
            cantidad: cantidad,
            stockMax: stockDisponible
          }
        ];
      }
    });

    alert(`"${producto.nombre}" agregado al carrito.`);
  };

  const cambiarCantidad = (idProducto, delta) => {
    const catalogo = getProductosStorage();
    const prod = catalogo.find(p => (p.id || p.codigo) === idProducto);

    setCarrito(prevCarrito => {
      return prevCarrito.map(item => {
        if (item.id === idProducto) {
          const maxStock = prod ? Number(prod.stock) : item.stockMax;
          const nuevaCantidad = item.cantidad + delta;

          if (nuevaCantidad > maxStock) {
            alert(`Stock máximo disponible alcanzado (${maxStock} unidades).`);
            return item;
          }
          if (nuevaCantidad <= 0) return null;

          return { ...item, cantidad: nuevaCantidad, stockMax: maxStock };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const eliminarDelCarrito = (idProducto) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== idProducto));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setDescuentoActivo(0);
  };

  const aplicarCupon = (codigo) => {
    if (codigo.trim().toUpperCase() === "LEGOVIP") {
      setDescuentoActivo(0.10);
      return { exito: true, mensaje: "¡Cupón LEGOVIP aplicado (10% OFF)!" };
    }
    return { exito: false, mensaje: "Cupón no válido." };
  };

  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const montoDescuento = subtotal * descuentoActivo;
  const totalFinal = subtotal - montoDescuento;

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      cambiarCantidad,
      eliminarDelCarrito,
      vaciarCarrito,
      aplicarCupon,
      totalUnidades,
      subtotal,
      montoDescuento,
      totalFinal,
      descuentoActivo
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);