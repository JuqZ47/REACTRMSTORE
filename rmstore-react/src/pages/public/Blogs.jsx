import React from 'react';
import { Link } from 'react-router-dom';
import { blogsData } from '../../data/blogsData';

const Blogs = () => {
  return (
    <main className="container my-5 py-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-dark">Blog & Novedades</h1>
        <p className="text-muted">Noticias, historias curiosas y tendencias del universo LEGO®</p>
      </div>

      <div className="row g-4">
        {blogsData.map((art) => (
          <div key={art.id} className="col-12 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
              <img 
                src={art.imagenUrl} 
                alt={art.titulo} 
                className="card-img-top" 
                style={{ height: '220px', objectFit: 'cover' }} 
              />
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge bg-danger rounded-pill px-3 py-1 mb-2 small">{art.categoria}</span>
                  <h4 className="fw-bold text-dark mb-2">{art.titulo}</h4>
                  <p className="text-muted small mb-3">{art.resumen}</p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <span className="extra-small text-secondary">{art.fecha}</span>
                  <Link to={`/blogs/${art.id}`} className="btn btn-outline-danger btn-sm fw-bold rounded-pill px-3">
                    Leer más &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Blogs;