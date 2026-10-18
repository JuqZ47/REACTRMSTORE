import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-principal mt-auto bg-dark text-white py-4">
      <div className="container text-center">
        <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none fs-4 red-social-link" title="Instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none fs-4 red-social-link" title="Facebook">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none fs-4 red-social-link" title="TikTok">
            <i className="bi bi-tiktok"></i>
          </a>
          <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none fs-4 red-social-link" title="WhatsApp">
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>
        <p className="mb-0 text-white-50 small">
          <strong className="text-white">RMSTORE</strong> — Especialistas en coleccionismo LEGO. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;