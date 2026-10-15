import React from 'react';

const Nosotros = () => {
  return (
    <main className="container my-5 py-4">
      <div className="text-center mb-5">
        <span className="badge bg-danger rounded-pill px-3 py-2 fw-bold text-uppercase mb-2">
          Comunidad rmSTORE
        </span>
        <h1 className="display-5 fw-bold text-dark">Sobre Nosotros</h1>
        <p className="text-muted col-12 col-md-8 mx-auto">
          Somos fanáticos apasionados por el universo LEGO®, dedicados a traer los mejores sets coleccionables, ediciones especiales y piezas icónicas a todo Chile.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100">
            <div className="text-danger mb-3">
              <i className="bi bi-patch-check-fill fs-1"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">100% Garantizados</h5>
            <p className="text-muted small mb-0">
              Todos nuestros productos son completamente originales con garantía oficial LEGO®.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100">
            <div className="text-danger mb-3">
              <i className="bi bi-truck fs-1"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">Envíos Rápidos</h5>
            <p className="text-muted small mb-0">
              Despachamos de forma segura y protegida a todas las regiones de Chile.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100">
            <div className="text-danger mb-3">
              <i className="bi bi-heart-fill fs-1"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">Pasión Coleccionista</h5>
            <p className="text-muted small mb-0">
              Seleccionamos cada set pensando en la mejor experiencia para niños y coleccionistas adultos.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Nosotros;