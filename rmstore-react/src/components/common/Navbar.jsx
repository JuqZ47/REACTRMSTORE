import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { sesion, cerrarSesion } = useAuth();
  const { totalUnidades } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-2">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3 text-dark text-decoration-none" to="/">
            RM<span className="text-danger">STORE</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
              <li className="nav-item"><Link className="nav-link text-secondary" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link text-secondary" to="/productos">Productos</Link></li>
              <li className="nav-item"><Link className="nav-link text-secondary" to="/nosotros">Nosotros</Link></li>
              <li className="nav-item"><Link className="nav-link text-secondary" to="/blogs">Blogs</Link></li>
              <li className="nav-item"><Link className="nav-link text-secondary" to="/contacto">Contacto</Link></li>
            </ul>

            <div className="d-flex align-items-center gap-3 flex-wrap mt-3 mt-lg-0">
              <div id="auth-links" className="d-flex align-items-center gap-2">
                {sesion ? (
                  <div className="d-flex align-items-center gap-2 small">
                    {(sesion.rol === "ADMIN" || sesion.rol === "ADMINISTRADOR") && (
                      <Link to="/admin" className="badge bg-danger text-decoration-none me-1">Panel Admin</Link>
                    )}
                    {sesion.rol === "VENDEDOR" && (
                      <Link to="/admin/pos" className="badge bg-primary text-decoration-none me-1">Panel Vendedor</Link>
                    )}
                    <span className="text-dark fw-semibold">Hola, <span className="text-danger">{sesion.nombre?.split(" ")[0]}</span></span>
                    <button onClick={handleLogout} className="btn btn-link text-muted text-decoration-none p-0 ms-1 small">Cerrar sesión</button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-decoration-none text-secondary small">Iniciar sesión</Link>
                    <Link to="/registro" className="text-decoration-none text-danger fw-bold small ms-2">Registrar</Link>
                  </>
                )}
              </div>

              <Link to="/carrito" className="btn btn-danger btn-sm fw-bold d-inline-flex align-items-center gap-2 shadow-sm rounded-3 px-3 py-1 ms-2">
                <i className="bi bi-cart3"></i>
                <span>Carrito</span>
                <span className="badge bg-dark rounded-pill" style={{ fontSize: '0.75rem', padding: '0.25em 0.6em' }}>
                  {totalUnidades}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;