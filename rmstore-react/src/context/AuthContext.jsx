import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsuariosStorage } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [sesion, setSesion] = useState(() => {
    const sesionGuardada = sessionStorage.getItem("rmstore_sesion_activa");
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  const iniciarSesion = (email, plainPass) => {
    const usuarios = getUsuariosStorage();
    const passCodificada = btoa(plainPass.trim());

    const usuario = usuarios.find(u => 
      u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
      u.pass === passCodificada
    );

    if (!usuario) {
      return { exito: false, mensaje: "Correo o contraseña incorrectos." };
    }

    const rolFinal = (usuario.rol || "CLIENTE").toUpperCase();
    const datosSesion = {
      run: usuario.run,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: rolFinal
    };

    sessionStorage.setItem("rmstore_sesion_activa", JSON.stringify(datosSesion));
    setSesion(datosSesion);

    return { exito: true, rol: rolFinal, nombre: usuario.nombre };
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("rmstore_sesion_activa");
    setSesion(null);
  };

  return (
    <AuthContext.Provider value={{ sesion, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);