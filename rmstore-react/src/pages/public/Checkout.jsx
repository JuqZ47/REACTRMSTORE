import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getProductosStorage } from '../../services/storageService';

const Checkout = () => {
  const { carrito, totalFinal, vaciarCarrito } = useCart();
  const { sesion } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: sesion?.nombre || '',
    email: sesion?.email || '',
    direccion: '',
    comuna: 'Cerrillos',
    region: 'Región Metropolitana de Santiago',
    indicaciones: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePagar = () => {
    if (!form.nombre || !form.email || !form.direccion) {
      alert('Por favor completa todos los datos de envío requeridos.');
      return;
    }

    const numOrden = '#' + Math.floor(10000000 + Math.random() * 90000000);

    // Simulación limpia: si la dirección contiene "error", redirige a la vista de error
    if (form.direccion.toLowerCase().includes('error')) {
      navigate('/pago-error', { 
        state: { orden: { numOrden, cliente: form, items: carrito, total: totalFinal } } 
      });
      return;
    }

    // Validar stock antes de procesar
    if (typeof getProductosStorage === 'function') {
      const productosStorage = getProductosStorage() || [];
      for (const item of carrito) {
        const prod = productosStorage.find((p) => p.id === item.id);
        if (prod && prod.stock < item.cant) {
          alert(`Stock insuficiente para "${item.nombre}". Stock actual: ${prod.stock}`);
          return;
        }
      }
    }

    const nuevaOrden = {
      numOrden,
      fecha: new Date().toISOString(),
      cliente: form,
      items: carrito,
      total: totalFinal,
    };

    try {
      const ventasGuardadas = JSON.parse(localStorage.getItem('rmstore_ventas') || '[]');
      ventasGuardadas.push(nuevaOrden);
      localStorage.setItem('rmstore_ventas', JSON.stringify(ventasGuardadas));
    } catch (e) {
      console.error('Error al guardar la orden:', e);
    }

    vaciarCarrito();
    navigate('/pago-exitoso', { state: { orden: nuevaOrden } });
  };

  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Tu carrito está vacío</h3>
        <button className="btn btn-danger mt-3" onClick={() => navigate('/productos')}>
          Ir a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card p-4 shadow-sm max-w-900 mx-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Carrito de compra</h3>
          <span className="btn btn-danger fw-bold">Total a pagar: ${Math.round(totalFinal || 0).toLocaleString('es-CL')}</span>
        </div>

        <table className="table align-middle">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              const cant = item.cant || 1;
              const precio = Number(item.precio) || 0;
              return (
                <tr key={item.id}>
                  <td>
                    <img src={item.imagen || '/img/lego-default.png'} alt={item.nombre} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  </td>
                  <td className="fw-semibold">{item.nombre}</td>
                  <td>${precio.toLocaleString('es-CL')}</td>
                  <td>{cant}</td>
                  <td>${(precio * cant).toLocaleString('es-CL')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h4 className="fw-bold mt-4 mb-3">Información del cliente</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        <h4 className="fw-bold mt-4 mb-3">Dirección de entrega de los productos</h4>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Calle y Número</label>
            <input type="text" name="direccion" className="form-control" placeholder="Ej: Los Crisantemos 123 (escribe 'error' para probar flujo de rechazo)" value={form.direccion} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Comuna</label>
            <input type="text" name="comuna" className="form-control" value={form.comuna} onChange={handleChange} />
          </div>
        </div>

        <div className="mt-4 pt-2">
          <button className="btn btn-success btn-lg w-100 fw-bold py-3" onClick={handlePagar}>
            Pagar ahora ${Math.round(totalFinal || 0).toLocaleString('es-CL')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;