import React, { useState, useEffect } from 'react';
import { inspireSlides } from '../../data/slidesData';

const InspireCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Transición automática cada 3.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % inspireSlides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const slideActual = inspireSlides[activeIndex];

  return (
    <div 
      className="carousel slide rounded-4 overflow-hidden shadow-sm position-relative" 
      style={{ height: '350px' }}
    >
      {/* Imagen de fondo dinámica */}
      <div 
        className="w-100 h-100 position-absolute top-0 start-0"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 60%), url('${slideActual.imagenUrl}') ${slideActual.bgPosition}/cover no-repeat`,
          transition: 'background 0.8s ease-in-out'
        }}
      />

      {/* Textos y contenido */}
      <div className="p-4 h-100 d-flex flex-column justify-content-end text-white position-relative" style={{ zIndex: 2 }}>
        <span className={`badge ${slideActual.badgeBg} rounded-pill px-3 py-1 mb-2 align-self-start fw-bold small`}>
          {slideActual.badge}
        </span>
        <h4 className="fw-bold mb-1 text-white">
          {slideActual.titulo}
        </h4>
        <p className="small text-white-50 mb-3">
          {slideActual.descripcion}
        </p>

        {/* BARRAS / GUIONES INDICADORES ALARGADOS */}
        <div className="d-flex align-items-center gap-2 mt-1" style={{ zIndex: 3 }}>
          {inspireSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="border-0 p-0 rounded-1"
              style={{
                width: '50px',
                height: '4px',
                backgroundColor: index === activeIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspireCarousel;