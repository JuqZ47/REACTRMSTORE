import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ activo }) => {
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  const esAdmin = sesion && (sesion.rol === 'ADMIN' || sesion.rol === 'ADMINISTRADOR');

  return (
    <aside className="bg-dark text-white p-3 d-flex flex-column justify-content-between h-100 rounded-3 shadow-sm">
      <div>
        {/* Encabezado del Menú */}
        <div className="d-flex align-items-center justify-content-between border-bottom border-secondary pb-3 mb-3">
          <div className="fs-5 fw-bold tracking-tight">
            RM<span className="text-danger">STORE</span> <small className="text-muted fs-6 fw-normal">Admin</small>
          </div>
        </div>

        {/* Menú de navegación adaptable */}
        <ul className="nav nav-pills flex-column flex-sm-row flex-md-column gap-2 p-0 m-0 list-unstyled">
          {esAdmin && (
            <li className="nav-item">
              <Link
                to="/admin"
                className={`nav-link text-white d-flex align-items-center gap-2 py-2 px-3 rounded-3 ${
                  activo === 'dashboard' ? 'bg-danger fw-bold shadow-sm' : 'opacity-75 hover-bg-secondary'
                }`}
              >
                <i className="bi bi-speedometer2"></i>
                <span>📊 Dashboard</span>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link
              to="/admin/pos"
              className={`nav-link text-white d-flex align-items-center gap-2 py-2 px-3 rounded-3 ${
                activo === 'pos' ? 'bg-danger fw-bold shadow-sm' : 'opacity-75 hover-bg-secondary'
              }`}
            >
              <i className="bi bi-calculator"></i>
              <span>💳 Punto de Venta (POS)</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/admin/productos"
              className={`nav-link text-white d-flex align-items-center gap-2 py-2 px-3 rounded-3 ${
                activo === 'productos' ? 'bg-danger fw-bold shadow-sm' : 'opacity-75 hover-bg-secondary'
              }`}
            >
              <i className="bi bi-box-seam"></i>
              <span>📦 Productos LEGO</span>
            </Link>
          </li>

          {esAdmin && (
            <li className="nav-item">
              <Link
                to="/admin/usuarios"
                className={`nav-link text-white d-flex align-items-center gap-2 py-2 px-3 rounded-3 ${
                  activo === 'usuarios' ? 'bg-danger fw-bold shadow-sm' : 'opacity-75 hover-bg-secondary'
                }`}
              >
                <i className="bi bi-people"></i>
                <span>👥 Usuarios y Roles</span>
              </Link>
            </li>
          )}

          <li className="nav-item mt-md-2">
            <Link to="/" className="nav-link text-white-50 d-flex align-items-center gap-2 py-2 px-3 rounded-3 hover-bg-secondary">
              <i className="bi bi-shop"></i>
              <span>🛒 Ir a la Tienda</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Pie del Sidebar - Cerrar Sesión */}
      <div className="pt-3 mt-3 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;