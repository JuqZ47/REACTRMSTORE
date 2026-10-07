import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const cartState = useCart();
  const cartCount = cartState?.cartCount ?? cartState?.carrito?.length ?? 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-sm">
      <div className="container">
        {/* LOGO */}
        <Link to="/" className="navbar-brand fw-black text-dark fs-3 me-4 tracking-tight" style={{ fontWeight: '900' }}>
          RM<span className="text-danger" style={{ color: '#d91b2b' }}>STORE</span>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3 fw-medium">
            <li className="nav-item">
              <NavLink 
                to="/" 
                end 
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
                className={({ isActive }) => 
                  `nav-link px-2 ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
                }
              >
                Contacto
              </NavLink>
            </li>
          </ul>

          {/* OPCIONES DE ACCESO Y CARRITO */}
          <div className="d-flex align-items-center gap-3">
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `text-decoration-none small ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
              }
            >
              Iniciar sesión
            </NavLink>

            <NavLink 
              to="/registro" 
              className={({ isActive }) => 
                `text-decoration-none small ${isActive ? 'text-danger fw-bold' : 'text-secondary'}`
              }
            >
              Registrar
            </NavLink>

            {/* BOTÓN CARRITO */}
            <Link 
              to="/carrito" 
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