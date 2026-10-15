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

  return (
    <div className="admin-layout">
      <AdminSidebar activo="dashboard" />
      <main className="admin-main">
        <header className="admin-header d-flex justify-content-between align-items-center gap-3 pe-3">
        <h2 className="h4 fw-bold mb-0">Terminal POS - Punto de Venta</h2>
        <div className="admin-user d-flex align-items-center ms-auto">
            <span className="badge bg-light text-dark border px-3 py-2 fw-semibold fs-6 shadow-sm">
            <i className="bi bi-person-circle me-2 text-danger"></i>
            {sesion?.email}
            </span>
        </div>
        </header>

        <section className="admin-content p-4">
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card-admin bg-white p-4 rounded-3 shadow-sm border-start border-4 border-primary">
                <h6 className="text-muted small fw-semibold">TOTAL PRODUCTOS</h6>
                <h3 className="fw-bold mb-0">{stats.totalProds}</h3>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card-admin bg-white p-4 rounded-3 shadow-sm border-start border-4 border-warning">
                <h6 className="text-muted small fw-semibold">STOCK CRÍTICO / AGOTADO</h6>
                <h3 className="fw-bold text-warning mb-0">{stats.stockCritico}</h3>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card-admin bg-white p-4 rounded-3 shadow-sm border-start border-4 border-danger">
                <h6 className="text-muted small fw-semibold">USUARIOS REGISTRADOS</h6>
                <h3 className="fw-bold text-danger mb-0">{stats.totalUsers}</h3>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardAdmin;