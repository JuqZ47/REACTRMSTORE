import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ producto, onAddToCart }) => {
  const { id, codigo, nombre, categoria, precio, stock, imagenes, imagen } = producto;
  const idProducto = id || codigo;
  const stockReal = Number(stock) || 0;
  const imagenPrincipal = (imagenes && imagenes.length > 0) ? imagenes[0] : (imagen || '/img/lego-default.png');

  return (
    <div className="col">
      <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-danger-subtle text-danger fw-semibold">{categoria}</span>
            <span className="badge bg-success-subtle text-success fw-semibold">Nuevo</span>
          </div>
          <div className="text-center my-2 bg-light rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ height: '140px' }}>
            <img src={imagenPrincipal} alt={nombre} style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
          <h6 className="fw-bold text-dark text-truncate mb-1 small" title={nombre}>{nombre}</h6>
          <p className="fw-bold text-danger mb-3 small">${Number(precio).toLocaleString('es-CL')}</p>
        </div>
        <div className="d-grid gap-2">
          <Link to={`/detalle-producto/${encodeURIComponent(idProducto)}`} className="btn btn-primary btn-sm fw-bold rounded-3 py-1">
            Ver Detalle
          </Link>
          <button 
            className="btn btn-danger btn-sm fw-bold shadow-sm rounded-3 py-1" 
            onClick={() => onAddToCart(idProducto, 1)} 
            disabled={stockReal === 0}
          >
            <i className="bi bi-cart-plus me-1"></i> {stockReal === 0 ? 'Sin Stock' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;