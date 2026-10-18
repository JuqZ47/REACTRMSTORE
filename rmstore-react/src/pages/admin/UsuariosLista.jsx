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

  const userEmail = sesion?.usuario?.correo || sesion?.email || 'admin@duoc.cl';

  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* COLUMNA 1: Sidebar adaptable (Arriba en celular, a la izquierda en PC) */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo="usuarios" />
        </div>

        {/* COLUMNA 2: Contenido Principal de Gestión de Usuarios */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          {/* Encabezado Responsivo */}
          <header className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h2 className="h5 h4-md fw-bold mb-0 text-dark">
                <i className="bi bi-people text-danger me-2"></i>Gestión de Usuarios y Roles
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
                <h3 className="h5 fw-bold mb-0 text-dark">Usuarios Registrados</h3>
              </div>
              <div className="col-12 col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="Buscar por RUN, nombre o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <select
                    className="form-select bg-light"
                    style={{ maxWidth: '140px' }}
                    value={rolSel}
                    onChange={(e) => setRolSel(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="CLIENTE">Cliente</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-3 text-md-end">
                <Link to="/admin/usuario-form" className="btn btn-danger fw-semibold w-100 w-md-auto">
                  <i className="bi bi-person-plus me-1"></i>Nuevo Usuario
                </Link>
              </div>
            </div>

            {/* Tabla con scroll horizontal en móviles */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
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
                      <td colSpan="6" className="text-center text-muted py-4">
                        <i className="bi bi-people fs-2 d-block mb-1"></i>
                        No se encontraron usuarios coincidentes.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((u) => {
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
                          <td>
                            <strong>{run}</strong>
                          </td>
                          <td>{obtenerNombreCompleto(u)}</td>
                          <td>{u.email}</td>
                          <td>{u.region || "Región Metropolitana"}</td>
                          <td>{badgeHTML}</td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <Link
                                to={`/admin/usuario-form?run=${encodeURIComponent(run)}`}
                                className="btn btn-sm btn-outline-dark"
                              >
                                <i className="bi bi-pencil me-1"></i>Editar
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminar(identificador)}
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

export default UsuariosLista;