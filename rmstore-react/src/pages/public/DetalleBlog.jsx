import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsData } from '../../data/blogsData';

const DetalleBlog = () => {
  const { id } = useParams();
  const blog = blogsData.find((b) => b.id === parseInt(id) || b.slug === id);

  if (!blog) {
    return (
      <main className="container my-5 py-5 text-center">
        <h2 className="fw-bold text-dark mb-3">Blog no encontrado</h2>
        <p className="text-muted mb-4">El artículo que estás buscando no existe o fue removido.</p>
        <Link to="/blogs" className="btn btn-danger rounded-pill px-4 py-2 fw-bold">
          &larr; Volver a Blogs
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-4 my-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {/* Botón Volver */}
          <Link to="/blogs" className="text-decoration-none fw-semibold text-danger d-inline-flex align-items-center gap-1 mb-3">
            &larr; Volver a Blogs
          </Link>

          <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            {/* Título y Metadatos */}
            <header className="mb-4">
              <h1 className="display-6 fw-bold text-dark lh-sm mb-2">
                {blog.titulo}
              </h1>
              <p className="text-muted small mb-0">
                Publicado por <strong>{blog.autor}</strong> • {blog.fecha}
              </p>
            </header>

            {/* Contenedor de la Imagen Centrada */}
            <div className="bg-light border rounded-3 p-3 my-3 text-center d-flex align-items-center justify-content-center" style={{ maxHeight: '420px' }}>
              <img
                src={blog.imagenUrl}
                alt={blog.titulo}
                className="img-fluid rounded"
                style={{ maxHeight: '380px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            {/* Contenido del Artículo */}
            <div className="blog-contenido text-secondary mt-4" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
              {blog.contenido.map((parrafo, idx) => (
                <p key={idx} className={idx === blog.contenido.length - 1 ? 'mb-0' : ''}>
                  {parrafo}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default DetalleBlog;