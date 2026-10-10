import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Contexto de autenticación

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartState = useCart();
  const { sesion, cerrarSesion } = useAuth(); // Se obtiene la sesión y el método para cerrar sesión
  const navigate = useNavigate();

  const cartCount = cartState?.cartCount ?? cartState?.carrito?.length ?? 0;

  // Cierra el menú al hacer clic en un enlace
  const handleCloseMenu = () => setIsOpen(false);

  // Manejar el cierre de sesión
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

  // Obtener nombre dinámico para mostrar en la barra
  const nombreUsuario =
    sesion?.usuario?.nombre ||
    sesion?.nombre ||
    (sesion?.usuario?.correo
      ? sesion.usuario.correo.split('@')[0]
      : sesion?.email
      ? sesion.email.split('@')[0]
      : 'Usuario');

  const rolUsuario =
    (sesion?.rol || sesion?.usuario?.rol || '').toUpperCase();

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

        {/* CONTENIDO NAVEGACIÓN (SE DESPLIEGA EN MÓVIL) */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 gap-lg-3 fw-medium my-2 my-lg-0">
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
            <li className="nav-item">
              <NavLink 
                to="/productos" 
                onClick={handleCloseMenu}
                className={({ isActive }) => 
                  `nav-link px-2 ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                }
              >
                Productos
              </NavLink>
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
                {/* Botón para regresar al panel de Vendedor / Admin si tiene el rol */}
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

                {/* Texto Saludo Usuario */}
                <span className="small text-secondary fw-medium">
                  Hola, <strong className="text-danger">{nombreUsuario}</strong>
                </span>

                {/* Enlace Cerrar Sesión */}
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