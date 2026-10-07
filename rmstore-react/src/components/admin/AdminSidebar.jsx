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
    <aside className="sidebar">
      <div className="sidebar-brand">RM<span>STORE</span> Admin</div>
      <ul className="sidebar-menu">
        {esAdmin && (
          <li>
            <Link to="/admin" className={activo === 'dashboard' ? 'active' : ''}>
              <i className="bi bi-speedometer2 me-2"></i>📊 Dashboard
            </Link>
          </li>
        )}
        <li>
          <Link to="/admin/pos" className={activo === 'pos' ? 'active' : ''}>
            <i className="bi bi-calculator me-2"></i>💳 Punto de Venta (POS)
          </Link>
        </li>
        <li>
          <Link to="/admin/productos" className={activo === 'productos' ? 'active' : ''}>
            <i className="bi bi-box-seam me-2"></i>📦 Productos LEGO
          </Link>
        </li>
        {esAdmin && (
          <li>
            <Link to="/admin/usuarios" className={activo === 'usuarios' ? 'active' : ''}>
              <i className="bi bi-people me-2"></i>👥 Usuarios y Roles
            </Link>
          </li>
        )}
        <li>
          <Link to="/">
            <i className="bi bi-shop me-2"></i>🛒 Ir a la Tienda
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-link text-white text-decoration-none p-0 w-100 text-start" style={{ cursor: 'pointer' }}>
          <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;