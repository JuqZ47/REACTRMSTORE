import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { regionesYComunas } from '../../data/mockData';
import { getUsuariosStorage, saveUsuarioStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const UsuarioForm = () => {
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editRun = searchParams.get('run');

  const [formData, setFormData] = useState({
    run: '',
    rol: '',
    nombre: '',
    apellidos: '',
    email: '',
    regionIdx: '',
    comuna: '',
    direccion: '',
    pass: '',
    pass2: ''
  });

  useEffect(() => {
    if (editRun) {
      const usuarios = getUsuariosStorage();
      const u = usuarios.find(
        (usr) =>
          (usr.run && usr.run.toUpperCase() === editRun.toUpperCase()) ||
          (usr.email && usr.email.toLowerCase() === editRun.toLowerCase())
      );
      if (u) {
        const rIdx = regionesYComunas.findIndex((reg) => reg.region === u.region);
        setFormData({
          run: u.run || '',
          rol: u.rol || 'CLIENTE',
          nombre: u.nombre || '',
          apellidos: u.apellidos || '',
          email: u.email || '',
          regionIdx: rIdx !== -1 ? rIdx : '',
          comuna: u.comuna || '',
          direccion: u.direccion || '',
          pass: '',
          pass2: ''
        });
      }
    }
  }, [editRun]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellidos || !formData.email || !formData.rol) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const usuarios = getUsuariosStorage();
    const regionTexto =
      formData.regionIdx !== '' ? regionesYComunas[Number(formData.regionIdx)]?.region : '';

    if (editRun) {
      const idx = usuarios.findIndex(
        (u) =>
          (u.run && u.run.toUpperCase() === editRun.toUpperCase()) ||
          (u.email && u.email.toLowerCase() === editRun.toLowerCase())
      );
      if (idx !== -1) {
        usuarios[idx].nombre = formData.nombre.trim();
        usuarios[idx].apellidos = formData.apellidos.trim();
        usuarios[idx].email = formData.email.trim().toLowerCase();
        usuarios[idx].rol = formData.rol.toUpperCase();
        usuarios[idx].region = regionTexto;
        usuarios[idx].comuna = formData.comuna;
        usuarios[idx].direccion = formData.direccion.trim();

        if (formData.pass.trim().length >= 4) {
          usuarios[idx].pass = btoa(formData.pass.trim());
        }

        localStorage.setItem('rmstore_usuarios', JSON.stringify(usuarios));
        alert('¡Usuario actualizado exitosamente!');
        navigate('/admin/usuarios');
      }
    } else {
      const nuevo = {
        run: formData.run.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim().toLowerCase(),
        rol: formData.rol.toUpperCase(),
        region: regionTexto,
        comuna: formData.comuna,
        direccion: formData.direccion.trim(),
        pass: btoa(formData.pass.trim())
      };
      saveUsuarioStorage(nuevo);
      alert('¡Usuario registrado exitosamente!');
      navigate('/admin/usuarios');
    }
  };

  const userEmail = sesion?.usuario?.correo || sesion?.email || 'admin@duoc.cl';

  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* COLUMNA 1: Sidebar adaptable */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo="usuarios" />
        </div>

        {/* COLUMNA 2: Formulario de Usuario */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          {/* Encabezado Responsivo */}
          <header className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h2 className="h5 h4-md fw-bold mb-0 text-dark">
                <i className="bi bi-person-plus text-danger me-2"></i>
                {editRun ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                  <label className="form-label fw-semibold">RUN *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.run}
                    onChange={(e) => setFormData({ ...formData, run: e.target.value })}
                    disabled={!!editRun}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Rol en el Sistema *</label>
                  <select
                    className="form-select"
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    required
                  >
                    <option value="">-- Seleccionar Rol --</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="CLIENTE">Cliente</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Apellidos *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Región *</label>
                  <select
                    className="form-select"
                    value={formData.regionIdx}
                    onChange={(e) =>
                      setFormData({ ...formData, regionIdx: e.target.value, comuna: '' })
                    }
                  >
                    <option value="">-- Selecciona región --</option>
                    {regionesYComunas.map((item, idx) => (
                      <option key={idx} value={idx}>
                        {item.region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Comuna *</label>
                  <select
                    className="form-select"
                    value={formData.comuna}
                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                    disabled={formData.regionIdx === ''}
                  >
                    <option value="">-- Selecciona comuna --</option>
                    {formData.regionIdx !== '' &&
                      regionesYComunas[Number(formData.regionIdx)].comunas.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Dirección *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {editRun ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.pass}
                    onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 pt-2">
                <button type="submit" className="btn btn-danger fw-bold flex-grow-1 py-2">
                  GUARDAR USUARIO
                </button>
                <Link to="/admin/usuarios" className="btn btn-outline-secondary fw-semibold py-2">
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

export default UsuarioForm;