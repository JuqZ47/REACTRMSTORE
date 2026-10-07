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
      const p = prods.find(item => (item.id || item.codigo) === editId);
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
    if (!formData.id || !formData.nombre || !formData.categoria || !formData.precio || !formData.stock) {
      alert("Por favor completa todos los campos requeridos.");
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
    alert(editId ? "¡Producto actualizado!" : "¡Producto creado exitosamente!");
    navigate('/admin/productos');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activo="productos" />
      <main className="admin-main">
        <header className="admin-header d-flex justify-content-between align-items-center">
          <h2 className="h4 fw-bold mb-0">{editId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <div className="admin-user text-end text-truncate" style={{ maxWidth: '300px' }}>
            <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">
                <i className="bi bi-person-circle me-2 text-danger"></i>
                {sesion?.email || 'admin@duoc.cl'}
            </span>
            </div>
        </header>

        <section className="admin-content p-4">
          <div className="card-admin shadow-sm p-4 bg-white rounded-3 mx-auto" style={{ maxWidth: '800px' }}>
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

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-danger fw-bold flex-grow-1">GUARDAR PRODUCTO</button>
                <Link to="/admin/productos" className="btn btn-secondary fw-semibold">Volver</Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductoForm;