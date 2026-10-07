import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/store/ProductCard';
import { getProductosStorage } from '../../services/storageService';
import { useCart } from '../../context/CartContext';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSel, setCategoriaSel] = useState('Todos');
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    setProductos(getProductosStorage());
  }, []);

  const categorias = ['Todos', 'Star Wars', 'Technic', 'Harry Potter', 'City', 'Icons', 'Marvel'];

  const filtrados = categoriaSel === 'Todos'
    ? productos
    : productos.filter(p => p.categoria.toLowerCase() === categoriaSel.toLowerCase());

  return (
    <main className="container my-4">
      <div className="text-center mb-4">
        <h1 className="h2 fw-bold text-dark">Catálogo LEGO</h1>
        <p className="text-muted small">Explora nuestros sets exclusivos en stock</p>

        <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSel(cat)}
              className={`btn btn-sm rounded-pill fw-semibold px-3 ${categoriaSel === cat ? 'btn-danger' : 'btn-outline-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filtrados.length > 0 ? (
          filtrados.map(prod => (
            <ProductCard key={prod.id || prod.codigo} producto={prod} onAddToCart={agregarAlCarrito} />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">No hay sets disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Productos;