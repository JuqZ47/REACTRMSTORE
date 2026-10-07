import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Proveedores de Contexto
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts y Seguridad
import PublicLayout from './components/common/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Vistas Públicas (Crearemos en el siguiente paso)
import Home from './pages/public/Home';
import Productos from './pages/public/Productos';
import DetalleProducto from './pages/public/DetalleProducto';
import Carrito from './pages/public/Carrito';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import Nosotros from './pages/public/Nosotros';
import Blogs from './pages/public/Blogs';
import Contacto from './pages/public/Contacto';

// Vistas Admin / POS
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ProductosLista from './pages/admin/ProductosLista';
import ProductoForm from './pages/admin/ProductoForm';
import UsuariosLista from './pages/admin/UsuariosLista';
import UsuarioForm from './pages/admin/UsuarioForm';
import VendedorPOS from './pages/admin/VendedorPOS';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas Públicas con Navbar y Footer */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<Productos />} />
              <Route path="detalle-producto/:id" element={<DetalleProducto />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contacto" element={<Contacto />} />
            </Route>

            {/* Rutas Protegidas de Administración (ADMIN) */}
            <Route path="/admin" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <UsuariosLista />
              </ProtectedRoute>
            } />
            <Route path="/admin/usuario-form" element={
              <ProtectedRoute rolesPermitidos={['ADMIN']}>
                <UsuarioForm />
              </ProtectedRoute>
            } />

            {/* Rutas Compartidas (ADMIN y VENDEDOR) */}
            <Route path="/admin/productos" element={
              <ProtectedRoute rolesPermitidos={['ADMIN', 'VENDEDOR']}>
                <ProductosLista />
              </ProtectedRoute>
            } />
            <Route path="/admin/producto-form" element={
              <ProtectedRoute rolesPermitidos={['ADMIN', 'VENDEDOR']}>
                <ProductoForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/pos" element={
              <ProtectedRoute rolesPermitidos={['ADMIN', 'VENDEDOR']}>
                <VendedorPOS />
              </ProtectedRoute>
            } />

            {/* Fallback para rutas no encontradas */}
            <Route path="*" element={<PublicLayout />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;