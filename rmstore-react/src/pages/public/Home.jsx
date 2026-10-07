import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/store/ProductCard';
import InspireCarousel from '../../components/store/InspireCarousel'; // Importación corregida
import { getProductosStorage } from '../../services/storageService';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [pestanaActiva, setPestanaActiva] = useState('Novedades');
  const [spotlightActivo, setSpotlightActivo] = useState('ferrari');
  const [heroIndex, setHeroIndex] = useState(0);
  const { agregarAlCarrito } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setProductos(getProductosStorage());
  }, []);

  // 1. DIAPOSITIVAS DEL HERO BANNER (Carrusel dinámico con videos de fondo)
  const heroSlides = [
    {
      badge: 'COLECCIÓN STAR WARS',
      badgeBg: 'bg-danger',
      tituloLine1: 'QUE LA FUERZA',
      tituloLine2: 'TE ACOMPAÑE',
      desc: 'El Millennium Falcon y naves icónicas te esperan en escala de coleccionista. Siente el hiperespacio en tus manos.',
      btnText: 'Explorar Set Star Wars',
      btnLink: '/detalle-producto/LEG-001',
      esVideo: true,
      videoUrl: '/img/starwarsmillenium.mp4'
    },
    {
      badge: 'EDICIÓN ESPECIAL 2026',
      badgeBg: 'bg-warning text-dark',
      tituloLine1: 'CONSTRUYE TU',
      tituloLine2: 'SÚPER HISTORIA',
      desc: 'Descubre sets exclusivos de Technic, Star Wars y Marvel para todas las edades. Diseñados con precisión y detalles incomparables.',
      btnText: 'Comprar Ahora',
      btnLink: '/productos',
      esVideo: true,
      videoUrl: '/img/tecnic,marvelystarwars.mp4'
    }
  ];

  const heroActual = heroSlides[heroIndex];

  const siguienteHero = () => {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const anteriorHero = () => {
    setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Filtrado de productos para el estante "Los mejores sets para ti"
  const obtenerSetsEstante = () => {
    if (pestanaActiva === 'Novedades') return productos.slice(0, 4);
    if (pestanaActiva === 'Marvel') return productos.filter(p => p.categoria === 'Marvel');
    if (pestanaActiva === 'Vehículos') return productos.filter(p => p.categoria === 'Technic');
    if (pestanaActiva === 'Star Wars') return productos.filter(p => p.categoria === 'Star Wars');
    if (pestanaActiva === 'Botánica & Icons') return productos.filter(p => p.categoria === 'Icons');
    return productos.slice(0, 4);
  };

  const setsMostrados = obtenerSetsEstante();

  // Datos para el Spotlight interactivo (Sección inferior)
  const datosSpotlight = {
    ferrari: {
      titulo: 'Lego Technic - Ferrari Daytona SP3',
      desc: 'Modelo a escala 1:8 con caja de cambios secuencial de 8 velocidades y motor V12 funcional. Una obra maestra de ingeniería para coleccionistas.',
      id: 'LEG-002',
      esVideo: true,
      mediaUrl: '/img/ferrari-daytonavid.mp4'
    },
    hogwarts: {
      titulo: 'Lego Harry Potter - Castillo de Hogwarts',
      desc: 'Réplica detallada a microescala del icónico castillo con aulas, torres, la Cámara de los Secretos y el Gran Comedor.',
      id: 'LEG-003',
      esVideo: true,
      mediaUrl: '/img/castillo-hogwarts.mp4'
    }
  };

  const currentSpot = datosSpotlight[spotlightActivo];

  return (
    <div className="container py-4">
      {/* 1. HERO BANNER DINÁMICO */}
      <section className="position-relative mb-5 rounded-4 overflow-hidden shadow-lg bg-dark text-white" style={{ minHeight: '380px' }}>
        {heroActual.esVideo ? (
          <video
            key={heroActual.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.4, zIndex: 0 }}
          >
            <source src={heroActual.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            key={heroActual.bgImg}
            src={heroActual.bgImg}
            alt={heroActual.tituloLine2}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.35, zIndex: 0 }}
          />
        )}

        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)', zIndex: 1 }} 
        />

        <div className="position-relative p-4 p-md-5 d-flex flex-column justify-content-center h-100" style={{ zIndex: 2, minHeight: '380px' }}>
          <div className="col-12 col-md-7">
            <span className={`badge ${heroActual.badgeBg} mb-3 px-3 py-2 fw-bold text-uppercase`}>
              {heroActual.badge}
            </span>
            <h1 className="display-4 fw-black text-uppercase mb-3 line-height-sm">
              {heroActual.tituloLine1}<br />
              <span className="text-white">{heroActual.tituloLine2}</span>
            </h1>
            <p className="lead mb-4 opacity-90 small">
              {heroActual.desc}
            </p>
            <Link to={heroActual.btnLink} className="btn btn-danger btn-lg fw-bold shadow px-4 py-2 text-uppercase">
              {heroActual.btnText} &rarr;
            </Link>
          </div>
        </div>

        {/* FLECHAS DE NAVEGACIÓN LATERALES (ESTILO MINIMALISTA) */}
        <button
          onClick={anteriorHero}
          className="btn border-0 rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3 d-flex align-items-center justify-content-center text-white"
          style={{ 
            zIndex: 3, 
            width: '42px', 
            height: '42px', 
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            transition: 'background-color 0.3s ease'
          }}
          aria-label="Anterior"
        >
          <i className="bi bi-chevron-left" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}></i>
        </button>

        <button
          onClick={siguienteHero}
          className="btn border-0 rounded-circle position-absolute top-50 end-0 translate-middle-y me-3 d-flex align-items-center justify-content-center text-white"
          style={{ 
            zIndex: 3, 
            width: '42px', 
            height: '42px', 
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            transition: 'background-color 0.3s ease'
          }}
          aria-label="Siguiente"
        >
          <i className="bi bi-chevron-right" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}></i>
        </button>
      </section>

{/* 2. CATEGORÍAS RÁPIDAS CIRCULARES (MÁS GRANDES) */}
      <section className="mb-5">
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 gap-md-4 text-center">
          {[
            { label: 'Ofertas', catKey: 'Ofertas', icon: 'bi-tag-fill', color: 'text-danger' },
            { label: 'Star Wars', catKey: 'Star Wars', icon: 'bi-rocket-takeoff-fill', color: 'text-primary' },
            { label: 'Marvel', catKey: 'Marvel', icon: 'bi-shield-shaded', color: 'text-danger' },
            { label: 'Technic', catKey: 'Technic', icon: 'bi-speedometer2', color: 'text-warning' },
            { label: 'Harry Potter', catKey: 'Harry Potter', icon: 'bi-magic', color: 'text-info' },
            { label: 'Botánica', catKey: 'Icons', icon: 'bi-flower1', color: 'text-success' },
            { label: 'City', catKey: 'City', icon: 'bi-building', color: 'text-secondary' }
          ].map((cat, idx) => (
            <div 
              key={idx} 
              className="quick-cat-item cursor-pointer" 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/productos?categoria=${encodeURIComponent(cat.catKey)}`)}
            >
              <div 
                className="quick-cat-icon mx-auto mb-2 bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm border" 
                style={{ width: '72px', height: '72px' }}
              >
                <i className={`bi ${cat.icon} fs-4 ${cat.color}`}></i>
              </div>
              <span className="small fw-bold text-dark d-block" style={{ fontSize: '0.9rem' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ESTANTE "LOS MEJORES SETS PARA TI" */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-dark mb-3">Los mejores sets para ti</h2>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {['Novedades', 'Marvel', 'Vehículos', 'Star Wars', 'Botánica & Icons'].map(tab => (
              <button
                key={tab}
                onClick={() => setPestanaActiva(tab)}
                className={`btn btn-sm rounded-pill fw-bold px-3 py-2 ${pestanaActiva === tab ? 'btn-danger text-white' : 'btn-light text-secondary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 mb-4">
          {setsMostrados.length > 0 ? (
            setsMostrados.map(prod => (
              <ProductCard key={prod.id || prod.codigo} producto={prod} onAddToCart={agregarAlCarrito} />
            ))
          ) : (
            <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
              <p className="text-muted fs-5 mb-0">No hay productos en esta categoría.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/productos" className="btn btn-warning text-white fw-bold rounded-pill px-4 py-2 shadow-sm">
            Ver más sets
          </Link>
        </div>
      </section>

      {/* 4. PRODUCTOS DESTACADOS DE ESTA SEMANA (SPOTLIGHT) */}
      <section className="mb-5">
        <div className="text-center mb-3">
          <h2 className="h3 fw-bold text-dark mb-1">Productos destacados de esta semana</h2>
          <p className="text-muted small">Una mirada más cercana a momentos LEGO® que merece la pena descubrir.</p>
        </div>

        <div className="spotlight-card position-relative rounded-4 shadow-lg overflow-hidden text-white bg-dark" style={{ minHeight: '380px' }}>
          {currentSpot.esVideo ? (
            <video
              key={spotlightActivo}
              autoPlay
              loop
              muted
              playsInline
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ objectFit: 'cover', zIndex: 0 }}
            >
              <source src={currentSpot.mediaUrl} type="video/mp4" />
              Tu navegador no soporta reproducción de video.
            </video>
          ) : (
            <img
              src={currentSpot.mediaUrl}
              alt={currentSpot.titulo}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ objectFit: 'cover', zIndex: 0 }}
            />
          )}

          <div 
            className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ 
              background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)', 
              zIndex: 1 
            }} 
          />

          <div className="position-relative p-4 p-md-5 d-flex flex-column justify-content-between h-100" style={{ zIndex: 2, minHeight: '380px' }}>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <button
                onClick={() => setSpotlightActivo('ferrari')}
                className={`btn btn-sm rounded-pill fw-bold px-3 ${spotlightActivo === 'ferrari' ? 'btn-warning text-dark' : 'btn-outline-light'}`}
              >
                Ferrari Daytona SP3
              </button>
              <button
                onClick={() => setSpotlightActivo('hogwarts')}
                className={`btn btn-sm rounded-pill fw-bold px-3 ${spotlightActivo === 'hogwarts' ? 'btn-warning text-dark' : 'btn-outline-light'}`}
              >
                Castillo de Hogwarts
              </button>
            </div>

            <div className="col-12 col-md-6 my-auto">
              <h3 className="display-6 fw-bold mb-3">{currentSpot.titulo}</h3>
              <p className="text-white-50 small mb-4 line-height-base">{currentSpot.desc}</p>
              <Link to={`/detalle-producto/${currentSpot.id}`} className="btn btn-warning fw-bold text-dark px-4 py-2 rounded-3 shadow">
                Ver Set &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INSPÍRATE Y CONSTRUYE */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-dark mb-1">Inspírate y Construye</h2>
          <p className="text-muted small">
            Descubre cómo los fanáticos de LEGO dan vida a sus universos favoritos.
          </p>
        </div>

        {/* CONTENEDOR ROW PRINCIPAL QUE PONE LAS DOS COLUMNAS DE LADO Y LADO */}
        <div className="row g-4 align-items-center">
          {/* Columna Izquierda: Carrusel Automático */}
          <div className="col-12 col-md-6">
            <InspireCarousel />
          </div>

          {/* Columna Derecha: Ventajas y Dudas */}
          <div className="col-12 col-md-6">
            <div className="row g-3">
              <div className="col-6">
                <div className="rounded-4 p-3 py-4 bg-white shadow-sm border text-center h-100 d-flex flex-column justify-content-center align-items-center">
                  <i className="bi bi-box-seam text-danger display-6 d-block mb-2"></i>
                  <h6 className="fw-bold mb-1">Envíos a todo Chile</h6>
                  <p className="text-muted small mb-0">Rápidos y protegidos</p>
                </div>
              </div>

              <div className="col-6">
                <div className="rounded-4 p-3 py-4 bg-white shadow-sm border text-center h-100 d-flex flex-column justify-content-center align-items-center">
                  <i className="bi bi-shield-check text-success display-6 d-block mb-2"></i>
                  <h6 className="fw-bold mb-1">100% Original</h6>
                  <p className="text-muted small mb-0">Garantía oficial LEGO</p>
                </div>
              </div>

              <div className="col-12 mt-3">
                <div
                  className="rounded-4 p-4 text-white shadow-sm d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: '#d91b2b' }}
                >
                  <div>
                    <h5 className="fw-bold mb-1">¿Tienes dudas con tu pedido?</h5>
                    <p className="small mb-0 opacity-75">
                      Contáctanos directamente por WhatsApp o formulario.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/56912345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light btn-sm fw-bold px-3 py-2 text-danger rounded-pill flex-shrink-0 ms-2"
                  >
                    Escríbenos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;