import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ activo }) => {
  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* Sidebar adaptable (arriba en celular, a la izquierda en PC) */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo={activo} />
        </div>

        {/* Contenido dinámico de las subpáginas (Dashboard, POS, Productos, etc.) */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;