import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { regionesYComunas } from '../../data/mockData';
import { saveUsuarioStorage, getUsuariosStorage } from '../../services/storageService';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    pass: '',
    passConfirm: '',
    regionIdx: '',
    comuna: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});

  // Validación RUN Chileno Módulo 11
  const validarRun = (runCompleto) => {
    let valor = runCompleto.replace(/[^0-9kK]/g, "").toUpperCase();
    if (valor.length < 8 || valor.length > 9) return false;
    const cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo.charAt(i), 10);
      multiplo = (multiplo < 7) ? multiplo + 1 : 2;
    }
    const residuo = 11 - (suma % 11);
    let dvCalc = residuo === 11 ? "0" : residuo === 10 ? "K" : residuo.toString();
    return dv === dvCalc;
  };

  const validarEmail = (email) => {
    const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    return dominios.some(dom => email.trim().toLowerCase().endsWith(dom));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = {};

    const runLimpio = formData.run.trim().toUpperCase();
    if (!validarRun(runLimpio)) err.run = "RUN inválido (ej: 19011022K).";
    if (!formData.nombre.trim()) err.nombre = "El nombre es obligatorio.";
    if (!formData.apellidos.trim()) err.apellidos = "Los apellidos son obligatorios.";
    if (!validarEmail(formData.email)) err.email = "Correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    if (formData.pass.trim().length < 4 || formData.pass.trim().length > 10) err.pass = "Contraseña de 4 a 10 caracteres.";
    if (formData.passConfirm.trim() !== formData.pass.trim()) err.passConfirm = "Las contraseñas no coinciden.";
    if (formData.regionIdx === "") err.region = "Selecciona una región.";
    if (!formData.comuna) err.comuna = "Selecciona una comuna.";
    if (!formData.direccion.trim()) err.direccion = "La dirección es obligatoria.";

    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    const usuarios = getUsuariosStorage();
    if (usuarios.some(u => u.email.toLowerCase() === formData.email.toLowerCase().trim())) {
      setErrores({ email: "Este correo ya está registrado." });
      return;
    }
    if (usuarios.some(u => u.run.toUpperCase() === runLimpio)) {
      setErrores({ run: "Este RUN ya está registrado." });
      return;
    }

    const regionNombre = regionesYComunas[Number(formData.regionIdx)]?.region || "";

    const nuevoUsuario = {
      run: runLimpio,
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim().toLowerCase(),
      pass: btoa(formData.pass.trim()),
      region: regionNombre,
      comuna: formData.comuna,
      direccion: formData.direccion.trim(),
      rol: "CLIENTE"
    };

    saveUsuarioStorage(nuevoUsuario);
    alert(`¡Registro exitoso! Bienvenido ${nuevoUsuario.nombre}. Redirigiendo al login...`);
    navigate('/login');
  };

  return (
    <main className="container my-4 my-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-dark mb-1">REGISTRO DE USUARIO</h1>
              <p className="text-muted small">Crea tu cuenta de cliente en RMSTORE</p>
            </div>

            <form onSubmit={handleSubmit} novalidate>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="run" className="form-label fw-semibold text-secondary small">RUN (Sin puntos ni guion) *</label>
                  <input type="text" className="form-control" id="run" value={formData.run} onChange={handleChange} placeholder="Ej: 19011022K" />
                  {errores.run && <small className="text-danger d-block mt-1">{errores.run}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="nombre" className="form-label fw-semibold text-secondary small">Nombre *</label>
                  <input type="text" className="form-control" id="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" />
                  {errores.nombre && <small className="text-danger d-block mt-1">{errores.nombre}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="apellidos" className="form-label fw-semibold text-secondary small">Apellidos *</label>
                  <input type="text" className="form-control" id="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Tus apellidos" />
                  {errores.apellidos && <small className="text-danger d-block mt-1">{errores.apellidos}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="email" className="form-label fw-semibold text-secondary small">Correo Electrónico *</label>
                  <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} placeholder="correo@dominio.cl" />
                  {errores.email && <small className="text-danger d-block mt-1">{errores.email}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="pass" className="form-label fw-semibold text-secondary small">Contraseña *</label>
                  <input type="password" className="form-control" id="pass" value={formData.pass} onChange={handleChange} placeholder="4 a 10 caracteres" maxLength="10" />
                  {errores.pass && <small className="text-danger d-block mt-1">{errores.pass}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="passConfirm" className="form-label fw-semibold text-secondary small">Confirmar Contraseña *</label>
                  <input type="password" className="form-control" id="passConfirm" value={formData.passConfirm} onChange={handleChange} placeholder="Repite la contraseña" maxLength="10" />
                  {errores.passConfirm && <small className="text-danger d-block mt-1">{errores.passConfirm}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="regionIdx" className="form-label fw-semibold text-secondary small">Región *</label>
                  <select className="form-select" id="regionIdx" value={formData.regionIdx} onChange={(e) => setFormData(prev => ({ ...prev, regionIdx: e.target.value, comuna: '' }))}>
                    <option value="">-- Selecciona una región --</option>
                    {regionesYComunas.map((item, idx) => (
                      <option key={idx} value={idx}>{item.region}</option>
                    ))}
                  </select>
                  {errores.region && <small className="text-danger d-block mt-1">{errores.region}</small>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="comuna" className="form-label fw-semibold text-secondary small">Comuna *</label>
                  <select className="form-select" id="comuna" value={formData.comuna} onChange={handleChange} disabled={formData.regionIdx === ''}>
                    <option value="">-- Selecciona una comuna --</option>
                    {formData.regionIdx !== '' && regionesYComunas[Number(formData.regionIdx)].comunas.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                  {errores.comuna && <small className="text-danger d-block mt-1">{errores.comuna}</small>}
                </div>

                <div className="col-12">
                  <label htmlFor="direccion" className="form-label fw-semibold text-secondary small">Dirección *</label>
                  <input type="text" className="form-control" id="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, número, depto" />
                  {errores.direccion && <small className="text-danger d-block mt-1">{errores.direccion}</small>}
                </div>
              </div>

              <button type="submit" className="btn btn-danger w-100 py-2 fw-semibold shadow-sm mt-4">
                REGISTRAR CUENTA
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-secondary small">¿Ya tienes cuenta?</span>
              <Link to="/login" className="text-decoration-none fw-semibold text-danger small ms-1">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Registro;