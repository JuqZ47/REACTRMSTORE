import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar el hover
  const cartState = useCart();
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const esPaginaProductos = location.pathname.startsWith('/productos');

  const cartCount = cartState?.cartCount ?? cartState?.carrito?.length ?? 0;

  // Lista de categorías principales de LEGO
  const categoriasLego = ['Star Wars', 'Technic', 'Harry Potter', 'City', 'Icons', 'Marvel'];

  const handleCloseMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    if (cerrarSesion) {
      cerrarSesion();
    } else {
      localStorage.removeItem('rmstore_sesion');
    }
    handleCloseMenu();
    navigate('/');
    window.location.reload();
  };

  const handleSelectCategoria = (cat) => {
    handleCloseMenu();
    navigate(`/productos?categoria=${encodeURIComponent(cat)}`);
  };

  const nombreUsuario =
    sesion?.usuario?.nombre ||
    sesion?.nombre ||
    (sesion?.usuario?.correo
      ? sesion.usuario.correo.split('@')[0]
      : sesion?.email
      ? sesion.email.split('@')[0]
      : 'Usuario');

  const rolUsuario = (sesion?.rol || sesion?.usuario?.rol || '').toUpperCase();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-sm">
      <div className="container">
        {/* LOGO */}
        <Link 
          to="/" 
          className="navbar-brand fw-black text-dark fs-3 me-4 tracking-tight" 
          style={{ fontWeight: '900' }}
          onClick={handleCloseMenu}
        >
          RM<span className="text-danger" style={{ color: '#d91b2b' }}>STORE</span>
        </Link>

        {/* BOTÓN HAMBURGUESA PARA MÓVIL */}
        <button 
          className="navbar-toggler border-0 p-2" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO NAVEGACIÓN */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 gap-lg-3 fw-medium my-2 my-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink 
                to="/" 
                end 
                onClick={handleCloseMenu}
                className={({ isActive }) => 
                  `nav-link px-2 ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                }
              >
                Home
              </NavLink>
            </li>

            {/* MENÚ DESPLEGABLE CON HOVER EN PRODUCTOS */}
            <li 
              className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                className={`nav-link px-2 d-inline-flex align-items-center ${
                  esPaginaProductos ? 'text-danger fw-bold' : 'text-secondary'
                }`}
                to="/productos"
                onClick={handleCloseMenu}
              >
                Productos
                <i className="bi bi-chevron-down ms-1 text-danger small"></i>
              </Link>

              <ul 
                className={`dropdown-menu border-0 shadow rounded-3 p-2 ${dropdownOpen ? 'show' : ''}`}
                style={{ marginTop: 0 }}
              >
                <li>
                  <Link 
                    className="dropdown-item fw-bold text-dark rounded-2 py-2" 
                    to="/productos"
                    onClick={handleCloseMenu}
                  >
                    📦 Ver Todos los Productos
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                {categoriasLego.map((cat) => (
                  <li key={cat}>
                    <button
                      className="dropdown-item rounded-2 py-1 text-secondary"
                      onClick={() => handleSelectCategoria(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <NavLink 
                to="/nosotros" 
                onClick={handleCloseMenu}
                className={({ isActive }) => 
                  `nav-link px-2 ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                }
              >
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/blogs" 
                onClick={handleCloseMenu}
                className={({ isActive }) => 
                  `nav-link px-2 ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                }
              >
                Blogs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/contacto" 
                onClick={handleCloseMenu}
                className={({ isActive }) => 
                  `nav-link px-2 ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                }
              >
                Contacto
              </NavLink>
            </li>
          </ul>

          {/* OPCIONES DE SESIÓN Y CARRITO */}
          <div className="d-flex align-items-center gap-3 my-2 my-lg-0 flex-wrap">
            {sesion ? (
              <>
                {(rolUsuario === 'VENDEDOR' || rolUsuario === 'ADMIN' || rolUsuario === 'ADMINISTRADOR') && (
                  <Link
                    to={rolUsuario === 'VENDEDOR' ? '/admin/pos' : '/admin'}
                    onClick={handleCloseMenu}
                    className="btn btn-primary btn-sm fw-bold px-3 py-1 text-white"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {rolUsuario === 'VENDEDOR' ? 'Panel Vendedor' : 'Panel Admin'}
                  </Link>
                )}

                <span className="small text-secondary fw-medium">
                  Hola, <strong className="text-danger">{nombreUsuario}</strong>
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-link p-0 text-decoration-none small text-secondary fw-medium border-0 bg-transparent"
                  style={{ cursor: 'pointer' }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  onClick={handleCloseMenu}
                  className={({ isActive }) => 
                    `text-decoration-none small ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                  }
                >
                  Iniciar sesión
                </NavLink>

                <NavLink 
                  to="/registro" 
                  onClick={handleCloseMenu}
                  className={({ isActive }) => 
                    `text-decoration-none small ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                  }
                >
                  Registrar
                </NavLink>
              </>
            )}

            {/* BOTÓN CARRITO */}
            <Link 
              to="/carrito" 
              onClick={handleCloseMenu}
              className="btn btn-danger rounded-pill px-3 py-1 fw-bold btn-sm d-flex align-items-center gap-2 shadow-sm"
              style={{ backgroundColor: '#d91b2b', border: 'none' }}
            >
              <i className="bi bi-cart-fill fs-6"></i>
              <span>Carrito</span>
              <span 
                className="badge bg-dark rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '22px', height: '22px', fontSize: '0.75rem', padding: 0 }}
              >
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;