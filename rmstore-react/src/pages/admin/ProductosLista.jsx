import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProductosStorage, deleteProductoStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const ProductosLista = () => {
  const { sesion } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [catSel, setCatSel] = useState('');

  const cargarDatos = () => {
    setProductos(getProductosStorage());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm(`¿Seguro que deseas eliminar el producto ${id}?`)) {
      const actualizados = deleteProductoStorage(id);
      setProductos(actualizados);
    }
  };

  const filtrados = productos.filter(p => {
    const texto = busqueda.toLowerCase().trim();
    const id = (p.id || p.codigo || '').toLowerCase();
    const nombre = (p.nombre || '').toLowerCase();
    const coincideTexto = id.includes(texto) || nombre.includes(texto);
    const coincideCat = !catSel || p.categoria === catSel;
    return coincideTexto && coincideCat;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar activo="productos" />
      <main className="admin-main">
        <header className="admin-header d-flex justify-content-between align-items-center gap-3 pe-3">
        <h2 className="h4 fw-bold mb-0">Terminal POS - Punto de Venta</h2>
        <div className="admin-user d-flex align-items-center ms-auto">
            <span className="badge bg-light text-dark border px-3 py-2 fw-semibold fs-6 shadow-sm">
            <i className="bi bi-person-circle me-2 text-danger"></i>
            {sesion?.email}
            </span>
        </div>
        </header>

        <section className="admin-content p-4">
          <div className="card-admin shadow-sm p-4 bg-white rounded-3">
            <div className="row g-3 align-items-center mb-4">
              <div className="col-12 col-md-4">
                <h3 className="h5 fw-bold mb-0">Catálogo de Productos</h3>
              </div>
              <div className="col-12 col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Buscar por código o nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <select className="form-select" style={{ maxWidth: '140px' }} value={catSel} onChange={(e) => setCatSel(e.target.value)}>
                    <option value="">Todas</option>
                    <option value="Star Wars">Star Wars</option>
                    <option value="Technic">Technic</option>
                    <option value="Harry Potter">Harry Potter</option>
                    <option value="City">City</option>
                    <option value="Icons">Icons</option>
                    <option value="Marvel">Marvel</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-3 text-md-end">
                <Link to="/admin/producto-form" className="btn btn-danger fw-semibold w-100 w-md-auto">
                  + Nuevo Producto
                </Link>
              </div>
            </div>

            <div className="table-responsive">
              <table className="tabla-datos table align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">No se encontraron productos coincidentes.</td>
                    </tr>
                  ) : (
                    filtrados.map(p => {
                      const id = p.id || p.codigo;
                      const img = (p.imagenes && p.imagenes.length > 0) ? p.imagenes[0] : (p.imagen || '/img/lego-default.png');
                      const stock = Number(p.stock) || 0;
                      return (
                        <tr key={id}>
                          <td><strong>{id}</strong></td>
                          <td><img src={img} alt={p.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                          <td>{p.nombre}</td>
                          <td><span className="badge bg-danger-subtle text-danger">{p.categoria}</span></td>
                          <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                          <td>
                            <span className={`badge ${stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                              {stock} un.
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <Link to={`/admin/producto-form?id=${encodeURIComponent(id)}`} className="btn btn-sm btn-outline-dark">
                                ✏️ Editar
                              </Link>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(id)}>
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductosLista;