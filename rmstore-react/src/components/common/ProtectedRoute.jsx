import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, rolesPermitidos = [] }) => {
  const { sesion } = useAuth();

  // Si no hay sesión iniciada, redirigir al Login
  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  const rolUsuario = (sesion.rol || '').toUpperCase();
  const rolesNormalizados = rolesPermitidos.map(r => r.toUpperCase());

  // Verificar si el rol del usuario está permitido
  const tienePermiso = rolesNormalizados.length === 0 || 
    rolesNormalizados.includes(rolUsuario) ||
    (rolesNormalizados.includes('ADMIN') && (rolUsuario === 'ADMINISTRADOR' || rolUsuario === 'ADMIN'));

  if (!tienePermiso) {
    // Si es vendedor intentando acceder a una zona solo de Admin
    if (rolUsuario === 'VENDEDOR') {
      return <Navigate to="/admin/pos" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;