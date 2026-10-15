import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductosStorage } from '../../services/storageService';
import { useCart } from '../../context/CartContext';

const DetalleProducto = () => {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();
  const [producto, setProducto] = useState(null);
  const [fotoActiva, setFotoActiva] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const catalogo = getProductosStorage();
    const prodEncontrado = catalogo.find(p => (p.id || p.codigo) === id);
    if (prodEncontrado) {
      setProducto(prodEncontrado);
      const imgInicial = (prodEncontrado.imagenes && prodEncontrado.imagenes.length > 0)
        ? prodEncontrado.imagenes[0]
        : (prodEncontrado.imagen || '/img/lego-default.png');
      setFotoActiva(imgInicial);
    }
  }, [id]);

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <h2 className="h4 text-muted mb-3">Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-outline-danger btn-sm fw-semibold">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const stockReal = Number(producto.stock) || 0;
  const listaFotos = (producto.imagenes && producto.imagenes.length > 0)
    ? producto.imagenes
    : [producto.imagen || '/img/lego-default.png'];

  const handleDecrementar = () => setCantidad(prev => Math.max(1, prev - 1));
  const handleIncrementar = () => setCantidad(prev => (prev < stockReal ? prev + 1 : prev));

  return (
    <main className="container my-4 my-md-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos" className="text-decoration-none text-muted">Productos</Link>
          </li>
          <li className="breadcrumb-item active text-danger fw-bold" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div className="row g-4 align-items-center">
          {/* Galería de Fotos */}
          <div className="col-12 col-md-6">
            <div className="bg-light rounded-4 p-3 text-center mb-3 d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
              <img
                src={fotoActiva}
                alt={producto.nombre}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            {listaFotos.length > 1 && (
              <div className="d-flex justify-content-center gap-2">
                {listaFotos.map((foto, idx) => (
                  <img
                    key={idx}
                    src={foto}
                    alt={`Miniatura ${idx + 1}`}
                    onClick={() => setFotoActiva(foto)}
                    className={`rounded-3 cursor-pointer border ${fotoActiva === foto ? 'border-danger border-2' : 'border-light'}`}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información y Compra */}
          <div className="col-12 col-md-6">
            <span className="badge bg-danger-subtle text-danger fw-semibold mb-2">{producto.categoria}</span>
            <h1 className="h3 fw-bold text-dark mb-2">{producto.nombre}</h1>
            <p className="text-muted small mb-3">Código: <span className="fw-semibold text-dark">{producto.id || producto.codigo}</span></p>

            <h2 className="fs-2 fw-bold text-danger mb-3">${Number(producto.precio).toLocaleString('es-CL')}</h2>

            <p className="text-secondary mb-4 small line-height-base">
              {producto.descripcion || "Set coleccionable de alta calidad."}
            </p>

            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-semibold small text-secondary">Cantidad:</span>
              <div className="btn-group btn-group-sm" role="group">
                <button className="btn btn-outline-secondary px-3" onClick={handleDecrementar} disabled={stockReal === 0}>-</button>
                <span className="btn btn-light px-3 disabled fw-bold text-dark">{cantidad}</span>
                <button className="btn btn-outline-secondary px-3" onClick={handleIncrementar} disabled={stockReal === 0 || cantidad >= stockReal}>+</button>
              </div>
              <span className="small text-muted">({stockReal} disponibles)</span>
            </div>

            <button
              className="btn btn-danger btn-lg w-100 fw-bold shadow-sm py-2 rounded-3"
              onClick={() => agregarAlCarrito(producto.id || producto.codigo, cantidad)}
              disabled={stockReal === 0}
            >
              <i className="bi bi-cart-plus me-2"></i>
              {stockReal === 0 ? 'AGOTADO' : 'AÑADIR AL CARRITO'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;