import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !pass.trim()) {
      setErrorMsg('Por favor, completa ambos campos.');
      return;
    }

    const res = iniciarSesion(email, pass);

    if (res.exito) {
      if (res.rol === 'ADMIN' || res.rol === 'ADMINISTRADOR') {
        navigate('/admin');
      } else if (res.rol === 'VENDEDOR') {
        navigate('/admin/pos');
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg(res.mensaje);
    }
  };

  return (
    <main className="container my-4 my-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-dark mb-1">INICIAR SESIÓN</h1>
              <p className="text-muted small">Ingresa a tu cuenta de cliente o personal de tienda</p>
            </div>

            <form onSubmit={handleSubmit} novalidate>
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label fw-semibold text-secondary small">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="login-email"
                  placeholder="correo@dominio.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="login-pass" className="form-label fw-semibold text-secondary small">
                  Contraseña *
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="login-pass"
                  placeholder="Tu contraseña"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
                {errorMsg && <small className="text-danger d-block mt-2">{errorMsg}</small>}
              </div>

              <button type="submit" className="btn btn-danger w-100 py-2 fw-semibold shadow-sm mt-3">
                INGRESAR
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-secondary small">¿No tienes cuenta?</span>
              <Link to="/registro" className="text-decoration-none fw-semibold text-danger small ms-1">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;