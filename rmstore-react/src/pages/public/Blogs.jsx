import React from 'react';

const Blogs = () => {
  const articulos = [
    {
      id: 1,
      titulo: 'Los 5 Sets de LEGO Star Wars más valiosos para coleccionar',
      fecha: '05 Octubre, 2026',
      categoria: 'Star Wars',
      img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=800&auto=format&fit=crop',
      resumen: 'Descubre cuáles son los modelos en escala UCS que no pueden faltar en la vitrina de todo fanático de la saga.'
    },
    {
      id: 2,
      titulo: 'Guía de armado: Consejos para organizar tus piezas Technic',
      fecha: '28 Septiembre, 2026',
      categoria: 'Technic',
      img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop',
      resumen: 'Tips prácticos para clasificar engranajes y conectores al armar superdeportivos de alta complejidad.'
    }
  ];

  return (
    <main className="container my-5 py-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-dark">Blog & Novedades</h1>
        <p className="text-muted">Noticias, consejos de armado y tendencias del mundo LEGO®</p>
      </div>

      <div className="row g-4">
        {articulos.map(art => (
          <div key={art.id} className="col-12 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
              <img src={art.img} alt={art.titulo} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge bg-danger rounded-pill px-3 py-1 mb-2 small">{art.categoria}</span>
                  <h4 className="fw-bold text-dark mb-2">{art.titulo}</h4>
                  <p className="text-muted small mb-3">{art.resumen}</p>
                </div>
                <span className="extra-small text-secondary">{art.fecha}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Blogs;