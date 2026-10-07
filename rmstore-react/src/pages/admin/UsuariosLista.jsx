import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getUsuariosStorage, deleteUsuarioStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const UsuariosLista = () => {
  const { sesion } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [rolSel, setRolSel] = useState('');

  const cargarUsuarios = () => {
    setUsuarios(getUsuariosStorage());
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = (identificador) => {
    if (sesion && (sesion.run === identificador || sesion.email === identificador)) {
      alert("Operación denegada: No puedes eliminar la cuenta con la que has iniciado sesión.");
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar este usuario (${identificador})?`)) {
      const actualizados = deleteUsuarioStorage(identificador);
      setUsuarios(actualizados);
    }
  };

  const obtenerNombreCompleto = (u) => {
    if (!u) return "Sin nombre";
    if (u.apellidos && u.apellidos.trim().length > 0) {
      return `${u.nombre.trim()} ${u.apellidos.trim()}`;
    }
    return (u.nombre || "").trim() || "Sin nombre";
  };

  const filtrados = usuarios.filter(u => {
    const texto = busqueda.toLowerCase().trim();
    const run = (u.run || "").toLowerCase();
    const nom = obtenerNombreCompleto(u).toLowerCase();
    const cor = (u.email || "").toLowerCase();
    const rol = (u.rol || "CLIENTE").toUpperCase();

    const coincideTexto = run.includes(texto) || nom.includes(texto) || cor.includes(texto);
    const coincideRol = !rolSel || rol === rolSel || (rolSel === "ADMIN" && rol === "ADMINISTRADOR");

    return coincideTexto && coincideRol;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar activo="usuarios" />
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
                <h3 className="h5 fw-bold mb-0">Usuarios Registrados</h3>
              </div>
              <div className="col-12 col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Buscar por RUN, nombre o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <select className="form-select" style={{ maxWidth: '140px' }} value={rolSel} onChange={(e) => setRolSel(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="CLIENTE">Cliente</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-3 text-md-end">
                <Link to="/admin/usuario-form" className="btn btn-danger fw-semibold w-100 w-md-auto">
                  + Nuevo Usuario
                </Link>
              </div>
            </div>

            <div className="table-responsive">
              <table className="tabla-datos table align-middle">
                <thead>
                  <tr>
                    <th>RUN</th>
                    <th>Nombre Completo</th>
                    <th>Correo</th>
                    <th>Región</th>
                    <th>Rol Asignado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">No se encontraron usuarios coincidentes.</td>
                    </tr>
                  ) : (
                    filtrados.map(u => {
                      const rol = (u.rol || "CLIENTE").toUpperCase();
                      const run = u.run || "S/R";
                      const identificador = u.run || u.email;

                      let badgeHTML = <span className="badge bg-secondary">Cliente</span>;
                      if (rol === "ADMIN" || rol === "ADMINISTRADOR") {
                        badgeHTML = <span className="badge bg-danger">Administrador</span>;
                      } else if (rol === "VENDEDOR") {
                        badgeHTML = <span className="badge bg-primary">Vendedor</span>;
                      }

                      return (
                        <tr key={identificador}>
                          <td><strong>{run}</strong></td>
                          <td>{obtenerNombreCompleto(u)}</td>
                          <td>{u.email}</td>
                          <td>{u.region || "Región Metropolitana"}</td>
                          <td>{badgeHTML}</td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <Link to={`/admin/usuario-form?run=${encodeURIComponent(run)}`} className="btn btn-sm btn-outline-dark">
                                ✏️ Editar
                              </Link>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(identificador)}>
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

export default UsuariosLista;