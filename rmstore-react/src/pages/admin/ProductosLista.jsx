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

  // Filtrado que descarta registros vacíos o corruptos
  const filtrados = productos.filter((p) => {
    if (!p || !p.nombre || p.nombre.trim() === '') return false;

    const texto = busqueda.toLowerCase().trim();
    const id = (p.id || p.codigo || '').toLowerCase();
    const nombre = (p.nombre || '').toLowerCase();
    const coincideTexto = id.includes(texto) || nombre.includes(texto);
    const coincideCat = !catSel || p.categoria === catSel;
    return coincideTexto && coincideCat;
  });

  const userEmail = sesion?.usuario?.correo || sesion?.email || 'admin@duoc.cl';

  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* COLUMNA 1: Sidebar adaptable (Arriba en cel, izquierda en PC) */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo="productos" />
        </div>

        {/* COLUMNA 2: Contenido Principal de Gestión de Productos */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          {/* Encabezado Responsivo */}
          <header className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h2 className="h5 h4-md fw-bold mb-0 text-dark">
                <i className="bi bi-box-seam text-danger me-2"></i>Gestión de Productos LEGO
              </h2>
              <div className="d-flex align-items-center gap-2 ms-auto ms-sm-0">
                <span className="badge bg-light text-dark border px-3 py-2 fw-semibold fs-6 shadow-sm">
                  <i className="bi bi-person-circle me-2 text-danger"></i>
                  {userEmail}
                </span>
              </div>
            </div>
          </header>

          {/* Tarjeta de Lista y Filtros */}
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
            <div className="row g-3 align-items-center mb-4">
              <div className="col-12 col-md-4">
                <h3 className="h5 fw-bold mb-0 text-dark">Catálogo Inventariado</h3>
              </div>
              <div className="col-12 col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="Buscar por código o nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <select
                    className="form-select bg-light"
                    style={{ maxWidth: '140px' }}
                    value={catSel}
                    onChange={(e) => setCatSel(e.target.value)}
                  >
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
                  <i className="bi bi-plus-circle me-1"></i>Nuevo Producto
                </Link>
              </div>
            </div>

            {/* Tabla con scroll horizontal responsivo */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
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
                      <td colSpan="7" className="text-center text-muted py-4">
                        <i className="bi bi-inbox fs-2 d-block mb-1"></i>
                        No se encontraron productos coincidentes.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((p) => {
                      const id = p.id || p.codigo;
                      const img =
                        p.imagenes && p.imagenes.length > 0
                          ? p.imagenes[0]
                          : p.imagen || '/img/lego-default.png';
                      const stock = Number(p.stock) || 0;
                      const precioValido = isNaN(Number(p.precio)) ? 0 : Number(p.precio);

                      return (
                        <tr key={id}>
                          <td>
                            <strong>{id}</strong>
                          </td>
                          <td>
                            <img
                              src={img}
                              alt={p.nombre || 'Producto'}
                              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                          </td>
                          <td>{p.nombre}</td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                              {p.categoria || 'Sin cat.'}
                            </span>
                          </td>
                          <td className="fw-semibold">${precioValido.toLocaleString('es-CL')}</td>
                          <td>
                            <span
                              className={`badge ${
                                stock <= 3 ? 'bg-warning text-dark' : 'bg-success'
                              }`}
                            >
                              {stock} un.
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <Link
                                to={`/admin/producto-form?id=${encodeURIComponent(id)}`}
                                className="btn btn-sm btn-outline-dark"
                              >
                                <i className="bi bi-pencil me-1"></i>Editar
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminar(id)}
                              >
                                <i className="bi bi-trash me-1"></i>Eliminar
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
        </div>
      </div>
    </div>
  );
};

export default ProductosLista;