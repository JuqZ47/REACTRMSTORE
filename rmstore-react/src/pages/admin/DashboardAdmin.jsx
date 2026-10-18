import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProductosStorage, getUsuariosStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const DashboardAdmin = () => {
  const { sesion } = useAuth();
  const [stats, setStats] = useState({ totalProds: 0, stockCritico: 0, totalUsers: 0 });

  useEffect(() => {
    const prods = getProductosStorage();
    const users = getUsuariosStorage();

    const criticos = prods.filter(p => Number(p.stock) <= (Number(p.stockCritico) || 3)).length;

    setStats({
      totalProds: prods.length,
      stockCritico: criticos,
      totalUsers: users.length
    });
  }, []);

  const userEmail = sesion?.usuario?.correo || sesion?.email || 'admin@duoc.cl';

  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* COLUMNA 1: Sidebar adaptable (Arriba en celular, a la izquierda en PC) */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo="dashboard" />
        </div>

        {/* COLUMNA 2: Contenido Principal Dashboard */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          {/* Encabezado Responsivo */}
          <header className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <h2 className="h5 h4-md fw-bold mb-0 text-dark">
                <i className="bi bi-speedometer2 text-danger me-2"></i>Dashboard - Panel General
              </h2>
              <div className="d-flex align-items-center gap-2 ms-auto ms-sm-0">
                <span className="badge bg-light text-dark border px-3 py-2 fw-semibold fs-6 shadow-sm">
                  <i className="bi bi-person-circle me-2 text-danger"></i>
                  {userEmail}
                </span>
              </div>
            </div>
          </header>

          {/* Tarjetas de Métricas Estadísticas */}
          <section className="bg-white p-3 p-md-4 rounded-4 shadow-sm">
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="card-admin bg-white p-3 p-md-4 rounded-3 shadow-sm border-start border-4 border-primary h-100">
                  <h6 className="text-muted small fw-semibold mb-2">TOTAL PRODUCTOS</h6>
                  <h3 className="fw-bold mb-0 text-primary">{stats.totalProds}</h3>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="card-admin bg-white p-3 p-md-4 rounded-3 shadow-sm border-start border-4 border-warning h-100">
                  <h6 className="text-muted small fw-semibold mb-2">STOCK CRÍTICO / AGOTADO</h6>
                  <h3 className="fw-bold text-warning mb-0">{stats.stockCritico}</h3>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card-admin bg-white p-3 p-md-4 rounded-3 shadow-sm border-start border-4 border-danger h-100">
                  <h6 className="text-muted small fw-semibold mb-2">USUARIOS REGISTRADOS</h6>
                  <h3 className="fw-bold text-danger mb-0">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;