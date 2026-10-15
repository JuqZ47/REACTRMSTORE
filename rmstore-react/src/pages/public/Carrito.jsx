import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Carrito = () => {
  const {
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    aplicarCupon,
    subtotal,
    montoDescuento,
    totalFinal,
    descuentoActivo
  } = useCart();

  const { sesion } = useAuth();
  const navigate = useNavigate();

  const [inputCupon, setInputCupon] = useState('');
  const [msgCupon, setMsgCupon] = useState({ texto: '', esExito: false });
  const [mostrarModalAuth, setMostrarModalAuth] = useState(false);

  const handleAplicarCupon = () => {
    if (!inputCupon.trim()) return;
    const res = aplicarCupon(inputCupon);
    setMsgCupon({ texto: res.mensaje, esExito: res.exito });
  };

  const handleIniciarPago = () => {
    if (carrito.length === 0) return;

    if (sesion) {
      // Si el usuario ya está autenticado, va directo a Checkout
      navigate('/checkout');
    } else {
      // Si no ha iniciado sesión, abrimos el modal de opción
      setMostrarModalAuth(true);
    }
  };

  const handleContinuarInvitado = () => {
    setMostrarModalAuth(false);
    navigate('/checkout');
  };

  const handleIrALogin = () => {
    setMostrarModalAuth(false);
    navigate('/login');
  };

  return (
    <main className="container my-4 my-md-5">
      <h1 className="h3 fw-bold text-dark mb-4">Carrito de Compras</h1>

      {carrito.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
          <p className="text-muted fs-5 mb-3">Tu carrito está vacío.</p>
          <div>
            <Link to="/productos" className="btn btn-outline-danger fw-semibold px-4 py-2 rounded-3">
              Explorar catálogo LEGO
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Tabla de Productos */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Set</th>
                      <th>Precio</th>
                      <th className="text-center">Cant.</th>
                      <th>Subtotal</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map(item => {
                      const cantidadActual = item.cant || 1;
                      const precioNum = Number(item.precio) || 0;
                      const totalLinea = precioNum * cantidadActual;

                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img 
                                src={item.imagen || '/img/lego-default.png'} 
                                alt={item.nombre} 
                                style={{ width: '45px', height: '45px', objectFit: 'contain' }} 
                              />
                              <div>
                                <strong className="d-block text-dark small">{item.nombre}</strong>
                                <span className="text-muted small">{item.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="small">${precioNum.toLocaleString('es-CL')}</td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-secondary px-2" 
                                onClick={() => cambiarCantidad(item.id, cantidadActual - 1)}
                              >
                                -
                              </button>
                              <span className="btn btn-light px-2 disabled fw-bold text-dark">{cantidadActual}</span>
                              <button 
                                className="btn btn-outline-secondary px-2" 
                                onClick={() => cambiarCantidad(item.id, cantidadActual + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="fw-bold small text-dark">${totalLinea.toLocaleString('es-CL')}</td>
                          <td className="text-end">
                            <button 
                              className="btn btn-outline-danger btn-sm border-0" 
                              onClick={() => eliminarDelCarrito(item.id)} 
                              title="Quitar"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resumen de Compra y Pago */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Resumen de Orden</h5>

              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Subtotal:</span>
                <span className="fw-semibold text-dark">${Math.round(subtotal).toLocaleString('es-CL')}</span>
              </div>

              {descuentoActivo > 0 && (
                <div className="d-flex justify-content-between text-success small mb-2">
                  <span>Descuento (10%):</span>
                  <span className="fw-bold">-${Math.round(montoDescuento).toLocaleString('es-CL')}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between fs-5 fw-bold text-dark mb-4">
                <span>Total:</span>
                <span className="text-danger">${Math.round(totalFinal).toLocaleString('es-CL')}</span>
              </div>

              {/* Área de Cupones */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">¿Tienes cupón de descuento?</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: LEGOVIP"
                    value={inputCupon}
                    onChange={(e) => setInputCupon(e.target.value)}
                  />
                  <button className="btn btn-dark fw-semibold" onClick={handleAplicarCupon}>Aplicar</button>
                </div>
                {msgCupon.texto && (
                  <small className={`d-block mt-1 ${msgCupon.esExito ? 'text-success' : 'text-danger'}`}>
                    {msgCupon.texto}
                  </small>
                )}
              </div>

              <button 
                className="btn btn-success btn-lg w-100 fw-bold shadow-sm py-2 rounded-3" 
                onClick={handleIniciarPago}
              >
                <i className="bi bi-credit-card-fill me-2"></i>PAGAR AHORA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONTINUAR COMO INVITADO O INICIAR SESIÓN */}
      {mostrarModalAuth && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">¿Cómo deseas continuar?</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMostrarModalAuth(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="text-muted mb-4">
                  Inicia sesión para usar tus datos guardados o continúa directamente como invitado para completar tu pedido.
                </p>
                <div className="d-grid gap-3">
                  <button 
                    className="btn btn-danger btn-lg fw-bold rounded-3" 
                    onClick={handleIrALogin}
                  >
                    <i className="bi bi-person-fill me-2"></i>Iniciar Sesión
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-lg fw-bold rounded-3" 
                    onClick={handleContinuarInvitado}
                  >
                    <i className="bi bi-bag-check-fill me-2"></i>Continuar como Invitado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Carrito;