import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/store/ProductCard';
import { getProductosStorage } from '../../services/storageService';
import { useCart } from '../../context/CartContext';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { agregarAlCarrito } = useCart();

  // Filtros locales
  const categoriaURL = searchParams.get('categoria') || 'Todos';
  const [categoriaSel, setCategoriaSel] = useState(categoriaURL);
  const [rangoPrecio, setRangoPrecio] = useState('todos');
  const [orden, setOrden] = useState('relevancia');

  useEffect(() => {
    setProductos(getProductosStorage());
  }, []);

  useEffect(() => {
    if (searchParams.has('categoria')) {
      setCategoriaSel(searchParams.get('categoria'));
    } else {
      setCategoriaSel('Todos');
    }
  }, [searchParams]);

  const categorias = ['Todos', 'Star Wars', 'Technic', 'Harry Potter', 'Icons', 'Marvel', 'City'];

  const handleSeleccionarCategoria = (cat) => {
    setCategoriaSel(cat);
    if (cat === 'Todos') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: cat });
    }
  };

  // Lógica de Filtrado y Ordenamiento
  let productosFiltrados = productos.filter((p) => {
    // Omite automáticamente productos vacíos o corruptos (sin nombre)
    if (!p || !p.nombre || p.nombre.trim() === '') return false;

    // Filtro Categoría
    const pasaCategoria =
      categoriaSel === 'Todos' ||
      (p.categoria && p.categoria.toLowerCase() === categoriaSel.toLowerCase());

    // Filtro Rango de Precio
    let pasaPrecio = true;
    const precio = Number(p.precio) || 0;
    if (rangoPrecio === 'bajo') pasaPrecio = precio < 50000;
    if (rangoPrecio === 'medio') pasaPrecio = precio >= 50000 && precio <= 150000;
    if (rangoPrecio === 'alto') pasaPrecio = precio > 150000;

    return pasaCategoria && pasaPrecio;
  });

  // Ordenamiento
  if (orden === 'menor') {
    productosFiltrados.sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
  } else if (orden === 'mayor') {
    productosFiltrados.sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
  } else if (orden === 'nombre') {
    productosFiltrados.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
  }

  return (
    <main className="container my-4 my-md-5">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1 className="h2 fw-extrabold text-dark mb-1" style={{ fontWeight: 800 }}>
          Catálogo Completo de Sets LEGO
        </h1>
        <p className="text-muted small">
          Selecciona una categoría para filtrar los modelos disponibles:
        </p>

        {/* Botones de Categorías */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSeleccionarCategoria(cat)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold transition-all ${
                categoriaSel.toLowerCase() === cat.toLowerCase()
                  ? 'btn-danger shadow-sm'
                  : 'btn-outline-secondary bg-white text-dark border-secondary-subtle'
              }`}
              style={
                categoriaSel.toLowerCase() === cat.toLowerCase()
                  ? { backgroundColor: '#d91b2b', borderColor: '#d91b2b' }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Filtros (Rango de Precio y Ordenamiento) */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="bg-white rounded-4 shadow-sm p-3 border d-flex flex-wrap align-items-center justify-content-center gap-3 gap-md-4">
            {/* Rango de Precio */}
            <div className="d-flex align-items-center gap-2">
              <label className="text-muted small fw-semibold text-nowrap">Rango de Precio:</label>
              <select
                className="form-select form-select-sm rounded-3 border-secondary-subtle"
                value={rangoPrecio}
                onChange={(e) => setRangoPrecio(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="todos">Todos los precios</option>
                <option value="bajo">Menos de $50.000</option>
                <option value="medio">$50.000 - $150.000</option>
                <option value="alto">Más de $150.000</option>
              </select>
            </div>

            {/* Ordenar */}
            <div className="d-flex align-items-center gap-2">
              <label className="text-muted small fw-semibold text-nowrap">Ordenar:</label>
              <select
                className="form-select form-select-sm rounded-3 border-secondary-subtle"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="relevancia">Relevancia</option>
                <option value="menor">Menor a Mayor precio</option>
                <option value="mayor">Mayor a Menor precio</option>
                <option value="nombre">Nombre (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Productos (3 columnas en desktop) */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <ProductCard
              key={prod.id || prod.codigo}
              producto={prod}
              onAddToCart={agregarAlCarrito}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5 mb-0">No hay sets disponibles con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Productos;