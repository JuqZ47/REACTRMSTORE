import React from 'react';

const Contacto = () => {
  return (
    <main className="container my-5 py-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-dark">Contacto</h1>
        <p className="text-muted">¿Tienes alguna duda sobre tu pedido o un set específico? ¡Escríbenos!</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark small">Nombre completo</label>
                <input type="text" className="form-control rounded-3" placeholder="Tu nombre" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark small">Correo electrónico</label>
                <input type="email" className="form-control rounded-3" placeholder="correo@ejemplo.com" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark small">Mensaje</label>
                <textarea className="form-control rounded-3" rows="4" placeholder="Escribe tu consulta aquí..." required></textarea>
              </div>
              <button type="submit" className="btn btn-danger fw-bold w-100 rounded-pill py-2 shadow-sm">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contacto;