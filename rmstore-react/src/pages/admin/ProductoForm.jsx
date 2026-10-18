import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProductosStorage, saveProductoStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const ProductoForm = () => {
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    descripcion: '',
    imagen: ''
  });

  useEffect(() => {
    if (editId) {
      const prods = getProductosStorage();
      const p = prods.find((item) => (item.id || item.codigo) === editId);
      if (p) {
        setFormData({
          id: p.id || p.codigo,
          nombre: p.nombre || '',
          categoria: p.categoria || '',
          precio: p.precio || '',
          stock: p.stock || '',
          descripcion: p.descripcion || '',
          imagen: (p.imagenes && p.imagenes[0]) || p.imagen || ''
        });
      }
    }
  }, [editId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.id ||
      !formData.nombre ||
      !formData.categoria ||
      !formData.precio ||
      !formData.stock
    ) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const productoGuardar = {
      id: formData.id.trim().toUpperCase(),
      codigo: formData.id.trim().toUpperCase(),
      nombre: formData.nombre.trim(),
      categoria: formData.categoria,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      descripcion: formData.descripcion.trim(),
      imagen: formData.imagen.trim() || '/img/lego-default.png',
      imagenes: [formData.imagen.trim() || '/img/lego-default.png']
    };

    saveProductoStorage(productoGuardar);
    alert(editId ? '¡Producto actualizado!' : '¡Producto creado exitosamente!');
    navigate('/admin/productos');
  };

  const userEmail = sesion?.usuario?.correo || sesion?.email || 'admin@duoc.cl';

  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* COLUMNA 1: Sidebar adaptable */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo="productos" />
        </div>

        {/* COLUMNA 2: Formulario de Producto */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          {/* Encabezado Responsivo */}
          <header className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h2 className="h5 h4-md fw-bold mb-0 text-dark">
                <i className="bi bi-box-seam text-danger me-2"></i>
                {editId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <div className="d-flex align-items-center gap-2 ms-auto ms-sm-0">
                <span className="badge bg-light text-dark border px-3 py-2 fw-semibold fs-6 shadow-sm">
                  <i className="bi bi-person-circle me-2 text-danger"></i>
                  {userEmail}
                </span>
              </div>
            </div>
          </header>

          {/* Tarjeta del Formulario */}
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Código ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={!!editId}
                    placeholder="Ej: LEG-007"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Categoría *</label>
                  <select
                    className="form-select"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="Star Wars">Star Wars</option>
                    <option value="Technic">Technic</option>
                    <option value="Harry Potter">Harry Potter</option>
                    <option value="City">City</option>
                    <option value="Icons">Icons</option>
                    <option value="Marvel">Marvel</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre del Set *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Lego Technic Bugatti"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Precio ($ CLP) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="99990"
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Stock Inicial *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">URL Imagen</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                ></textarea>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 pt-2">
                <button type="submit" className="btn btn-danger fw-bold flex-grow-1 py-2">
                  GUARDAR PRODUCTO
                </button>
                <Link to="/admin/productos" className="btn btn-outline-secondary fw-semibold py-2">
                  Volver
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoForm;