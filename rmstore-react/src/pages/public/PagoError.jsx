import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PagoError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orden = location.state?.orden;

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm text-center max-w-700 mx-auto">
        <div className="alert alert-danger fs-4 fw-bold">
          🚫 No se pudo realizar el pago. nro {orden?.numOrden || '#20240705'}
        </div>
        <p className="text-muted">Hubo un problema al procesar la transacción o verificar la disponibilidad del pago.</p>
        <button className="btn btn-success btn-lg mt-3 fw-bold" onClick={() => navigate('/checkout')}>
          VOLVER A REALIZAR EL PAGO
        </button>
      </div>
    </div>
  );
};

export default PagoError;