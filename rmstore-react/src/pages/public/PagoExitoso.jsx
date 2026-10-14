import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PagoExitoso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orden = location.state?.orden;

  if (!orden) {
    return <div className="container py-5 text-center"><h3>No hay información de orden.</h3></div>;
  }

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm text-center max-w-700 mx-auto">
        <div className="alert alert-success fs-4 fw-bold">
          ✅ Se ha realizado la compra. nro {orden.numOrden}
        </div>
        <div className="text-start mt-3">
          <h5><strong>Cliente:</strong> {orden.cliente.nombre}</h5>
          <p className="mb-1"><strong>Correo:</strong> {orden.cliente.email}</p>
          <p className="mb-1"><strong>Dirección:</strong> {orden.cliente.direccion}, {orden.cliente.comuna}</p>
          <p className="fs-5 mt-3 fw-bold text-success">Total pagado: ${orden.total.toLocaleString('es-CL')}</p>
        </div>
        <button className="btn btn-danger mt-4" onClick={() => navigate('/')}>
          Volver a la Tienda
        </button>
      </div>
    </div>
  );
};

export default PagoExitoso;