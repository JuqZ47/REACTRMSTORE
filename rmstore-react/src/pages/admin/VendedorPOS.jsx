import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProductosStorage, saveProductoStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const VendedorPOS = () => {
  const { sesion } = useAuth();

  // Estados de productos y carrito POS
  const [productos, setProductos] = useState([]);
  const [carritoPos, setCarritoPos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [montoPagaCon, setMontoPagaCon] = useState('');
  const [clienteRun, setClienteRun] = useState('');

  // Estados de Modales y Arqueo
  const [showApertura, setShowApertura] = useState(false);
  const [montoApertura, setMontoApertura] = useState('50000');
  const [showCierre, setShowCierre] = useState(false);
  const [montoCierreFisico, setMontoCierreFisico] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ultimoTicket, setUltimoTicket] = useState(null);

  // Cargar productos e inicializar turno
  useEffect(() => {
    const datosProds = getProductosStorage();
    setProductos(datosProds);

    // Verificar turno de caja
    const turno = JSON.parse(localStorage.getItem('rmstore_turno_caja'));
    const userEmail = sesion?.usuario?.correo || sesion?.email || 'vendedor@duoc.cl';
    if (!turno || turno.estado !== 'ABIERTA' || turno.vendedor !== userEmail) {
      setShowApertura(true);
    }
  }, [sesion]);

  // Cierre y apertura de caja
  const handleConfirmarApertura = () => {
    const userEmail = sesion?.usuario?.correo || sesion?.email || 'vendedor@duoc.cl';
    const nuevoTurno = {
      vendedor: userEmail,
      fechaInicio: new Date().toLocaleString('es-CL'),
      montoInicial: Number(montoApertura) || 0,
      estado: 'ABIERTA'
    };
    localStorage.setItem('rmstore_turno_caja', JSON.stringify(nuevoTurno));
    setShowApertura(false);
  };

  const handleConfirmarCierre = () => {
    const efectivoContado = Number(montoCierreFisico);
    if (isNaN(efectivoContado)) {
      alert('Por favor ingresa un monto válido de efectivo contado.');
      return;
    }

    let turno = JSON.parse(localStorage.getItem('rmstore_turno_caja')) || {};
    turno.estado = 'CERRADA';
    turno.fechaCierre = new Date().toLocaleString('es-CL');
    turno.montoFisicoEntregado = efectivoContado;

    localStorage.setItem('rmstore_turno_caja', JSON.stringify(turno));
    alert('Turno de caja cerrado exitosamente. Se ha registrado tu entrega de efectivo.');
    setShowCierre(false);
    window.location.reload();
  };

  // Agregar al carrito POS
  const agregarAlPos = (prod) => {
    const id = prod.id || prod.codigo;
    const stockDisponible = Number(prod.stock) || 0;
    if (stockDisponible <= 0) return;

    setCarritoPos((prev) => {
      const existente = prev.find((item) => item.id === id);
      if (existente) {
        if (existente.cant + 1 > stockDisponible) {
          alert(`Stock máximo alcanzado para ${prod.nombre} (${stockDisponible} un.).`);
          return prev;
        }
        return prev.map((item) =>
          item.id === id ? { ...item, cant: item.cant + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id,
          nombre: prod.nombre,
          precio: isNaN(Number(prod.precio)) ? 0 : Number(prod.precio),
          cant: 1,
          stockMax: stockDisponible
        }
      ];
    });
  };

  // Cambiar cantidades
  const cambiarCantPos = (id, delta) => {
    setCarritoPos((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCant = item.cant + delta;
            if (nuevaCant > item.stockMax) {
              alert(`Límite de stock: ${item.stockMax} disponibles.`);
              return item;
            }
            return nuevaCant > 0 ? { ...item, cant: nuevaCant } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const limpiarPos = () => {
    setCarritoPos([]);
    setClienteRun('');
    setMontoPagaCon('');
  };

  // Cálculos financieros
  const totalVentaActual = carritoPos.reduce((acc, i) => acc + i.precio * i.cant, 0);
  const subtotalNeto = Math.round(totalVentaActual / 1.19);
  const ivaCalculado = totalVentaActual - subtotalNeto;

  const pagaConNum = Number(montoPagaCon) || 0;
  const vueltoCalculado =
    metodoPago === 'Efectivo' && pagaConNum >= totalVentaActual && totalVentaActual > 0
      ? pagaConNum - totalVentaActual
      : 0;

  // Filtrado de catálogo
  const filtrados = productos.filter((p) => {
    if (!p.nombre || p.nombre.trim() === '') return false;

    const texto = busqueda.toLowerCase().trim();
    const coincideTexto =
      (p.nombre || '').toLowerCase().includes(texto) ||
      (p.id || p.codigo || '').toLowerCase().includes(texto);
    const coincideCat = catFilter === 'Todos' || p.categoria === catFilter;
    return coincideTexto && coincideCat;
  });

  // Procesar Venta
  const procesarVentaPos = () => {
    if (carritoPos.length === 0) {
      alert('Selecciona al menos un producto.');
      return;
    }

    if (metodoPago === 'Efectivo' && pagaConNum < totalVentaActual) {
      alert('El monto ingresado en efectivo es menor al total a pagar.');
      return;
    }

    const clienteInput = clienteRun.trim() || 'Cliente Mostrador';
    const userEmail = sesion?.usuario?.correo || sesion?.email || 'vendedor@duoc.cl';

    // Descontar stock
    let productosGuardados = getProductosStorage();
    carritoPos.forEach((itemCart) => {
      const idx = productosGuardados.findIndex((p) => (p.id || p.codigo) === itemCart.id);
      if (idx !== -1) {
        const actualStock = Number(productosGuardados[idx].stock) || 0;
        productosGuardados[idx].stock = Math.max(0, actualStock - itemCart.cant);
      }
    });

    saveProductoStorage(productosGuardados);
    setProductos(productosGuardados);

    // Guardar venta
    let ventas = JSON.parse(localStorage.getItem('rmstore_ventas')) || [];
    const nuevaVenta = {
      numBoleta: 'BOL-' + Math.floor(100000 + Math.random() * 900000),
      fecha: new Date().toLocaleString('es-CL'),
      vendedor: userEmail,
      cliente: clienteInput,
      metodoPago,
      items: JSON.parse(JSON.stringify(carritoPos)),
      total: totalVentaActual,
      pagoCon: metodoPago === 'Efectivo' ? pagaConNum : totalVentaActual,
      vuelto: vueltoCalculado
    };

    ventas.push(nuevaVenta);
    localStorage.setItem('rmstore_ventas', JSON.stringify(ventas));
    localStorage.setItem('rmstore_ultimo_ticket', JSON.stringify(nuevaVenta));

    setUltimoTicket(nuevaVenta);
    setShowTicketModal(true);
  };

  // Impresión Directa del Ticket
  const imprimirTicketDirecto = (venta) => {
    if (!venta) return;
    const subtotalCalc = Math.round(venta.total / 1.19);
    const ivaCalc = venta.total - subtotalCalc;

    const ventanaImpresion = window.open('', '_blank', 'width=400,height=600');
    const htmlTicket = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Boleta ${venta.numBoleta}</title>
          <style>
              @page { size: auto; margin: 0mm; }
              body { font-family: 'Courier New', Courier, monospace; width: 270px; margin: 10px auto; padding: 5px; color: #000; font-size: 11px; line-height: 1.3; }
              .text-center { text-align: center; }
              .text-end { text-align: right; }
              .fw-bold { font-weight: bold; }
              .text-uppercase { text-transform: uppercase; }
              table { width: 100%; border-collapse: collapse; margin: 5px 0; }
              th, td { padding: 2px 0; font-size: 11px; }
              .linea-punteada { border-top: 1px dashed #000; margin: 6px 0; }
              .linea-continua { border-top: 1px solid #000; margin: 6px 0; }
          </style>
      </head>
      <body>
          <div class="text-center fw-bold text-uppercase">RMSTORE COLECCIONABLES</div>
          <div class="text-center fw-bold">R.U.T.: 77.123.456-K</div>
          <div class="text-center fw-bold mt-1 text-uppercase">BOLETA ELECTRÓNICA: ${venta.numBoleta}</div>
          <div class="linea-punteada"></div>
          <div>FECHA: ${venta.fecha}</div>
          <div>CAJERO: ${(venta.vendedor || 'Vendedor').split('@')[0]}</div>
          <div>CLIENTE: ${venta.cliente || 'Cliente'}</div>
          <div class="linea-punteada"></div>
          <table>
              <thead>
                  <tr class="fw-bold">
                      <th style="text-align: left; width: 50%;">ITEM</th>
                      <th style="text-align: center; width: 20%;">CANT</th>
                      <th style="text-align: right; width: 30%;">TOTAL</th>
                  </tr>
              </thead>
              <tbody>
                  ${venta.items
                    .map(
                      (i) => `
                      <tr>
                          <td style="text-align: left;">${i.nombre}</td>
                          <td style="text-align: center;">${i.cant}</td> <td style="text-align: right;">$${(i.precio * i.cant).toLocaleString('es-CL')}</td>
                      </tr>
                  `
                    )
                    .join('')}
              </tbody>
          </table>
          <div class="linea-continua"></div>
          <table>
              <tr>
                  <td class="text-end">SUBTOTAL:</td>
                  <td class="text-end" style="width: 80px;">$${subtotalCalc.toLocaleString('es-CL')}</td>
              </tr>
              <tr>
                  <td class="text-end">IVA INCLUIDO (19%):</td>
                  <td class="text-end">$${ivaCalc.toLocaleString('es-CL')}</td>
              </tr>
              <tr class="fw-bold">
                  <td class="text-end">TOTAL:</td>
                  <td class="text-end">$${venta.total.toLocaleString('es-CL')}</td>
              </tr>
          </table>
          <div class="linea-punteada"></div>
          <div class="fw-bold text-uppercase">FORMAS DE PAGO:</div>
          <div style="display: flex; justify-content: space-between;">
              <span>${venta.metodoPago}:</span>
              <span>$${(venta.pagoCon || venta.total).toLocaleString('es-CL')}</span>
          </div>
          ${
            venta.vuelto > 0
              ? `
          <div style="display: flex; justify-content: space-between;" class="fw-bold">
              <span>VUELTO:</span>
              <span>$${venta.vuelto.toLocaleString('es-CL')}</span>
          </div>
          `
              : ''
          }
          <div class="linea-punteada"></div>
          <div class="text-center fw-bold" style="margin-top: 10px;">*** GRACIAS POR TU COMPRA ***</div>
          <div class="text-center">www.rmstore.cl</div>
          <script>
              window.onload = function() {
                  window.print();
                  setTimeout(function() { window.close(); }, 500);
              };
          <\/script>
      </body>
      </html>
    `;

    ventanaImpresion.document.open();
    ventanaImpresion.document.write(htmlTicket);
    ventanaImpresion.document.close();
  };

  const reimprimirUltimoTicket = () => {
    const ultimo = JSON.parse(localStorage.getItem('rmstore_ultimo_ticket'));
    if (!ultimo) {
      alert('No hay ningún ticket registrado recientemente en esta sesión.');
      return;
    }
    imprimirTicketDirecto(ultimo);
  };

  const userEmail = sesion?.usuario?.correo || sesion?.email || 'vendedor@duoc.cl';
  const userRol = sesion?.rol || 'Vendedor';

  return (
    <div className="container-fluid p-2 p-md-3 bg-light min-vh-100">
      <div className="row g-3 m-0">
        {/* COLUMNA 1: Sidebar adaptable (Arriba en cel, izquierda en PC) */}
        <div className="col-12 col-lg-3 col-xl-2 p-0 pe-lg-2">
          <AdminSidebar activo="pos" />
        </div>

        {/* COLUMNA 2: Contenido Principal POS */}
        <div className="col-12 col-lg-9 col-xl-10 p-0 ps-lg-2">
          {/* Encabezado Responsivo */}
          <header className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <h2 className="h5 h4-md fw-bold mb-0">
                  <i className="bi bi-cart-check text-danger me-2"></i>Terminal POS
                </h2>
                <span className="badge bg-success" id="estado-caja-badge">
                  Caja Abierta
                </span>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 w-100 w-sm-auto justify-content-between justify-content-sm-end">
                <button
                  className="btn btn-outline-warning btn-sm fw-bold flex-grow-1 flex-sm-grow-0"
                  onClick={reimprimirUltimoTicket}
                >
                  <i className="bi bi-printer me-1"></i>Reimprimir
                </button>
                <button
                  className="btn btn-outline-dark btn-sm fw-bold flex-grow-1 flex-sm-grow-0"
                  onClick={() => setShowCierre(true)}
                >
                  <i className="bi bi-lock me-1"></i>Cierre
                </button>
                <div className="d-flex align-items-center gap-1 ms-auto ms-sm-0">
                  <span className="badge bg-danger px-2 py-1" id="badge-rol-vendedor">
                    {userRol}
                  </span>
                  <small className="fw-semibold text-muted text-truncate" style={{ maxWidth: '140px' }}>
                    {userEmail}
                  </small>
                </div>
              </div>
            </div>
          </header>

          {/* Grid de Productos y Ticket */}
          <div className="row g-3 m-0">
            {/* CATÁLOGO DE PRODUCTOS */}
            <div className="col-12 col-xl-8 p-0 pe-xl-2">
              <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm d-flex flex-column h-100">
                {/* Buscador y Filtro */}
                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-7">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-light border-start-0 ps-0"
                        placeholder="Buscar por código, barra o nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-5">
                    <select
                      className="form-select bg-light"
                      value={catFilter}
                      onChange={(e) => setCatFilter(e.target.value)}
                    >
                      <option value="Todos">Todas las Categorías</option>
                      <option value="Star Wars">Star Wars</option>
                      <option value="Technic">Technic</option>
                      <option value="Marvel">Marvel</option>
                      <option value="Harry Potter">Harry Potter</option>
                      <option value="Icons">Icons / Botánica</option>
                      <option value="City">City</option>
                    </select>
                  </div>
                </div>

                {/* Grilla de Tarjetas adaptables en Móvil (1 col en cel, 2-5 en PC) */}
                <div
                  className="row row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-xxl-4 g-2 g-md-3 flex-grow-1 overflow-auto pe-1"
                  style={{ maxHeight: '60vh' }}
                >
                  {filtrados.length === 0 ? (
                    <div className="col-12 text-center text-muted py-5">
                      <i className="bi bi-search fs-1 d-block mb-2"></i>
                      No se encontraron productos coincidentes.
                    </div>
                  ) : (
                    filtrados.map((p) => {
                      const stock = Number(p.stock) || 0;
                      const id = p.id || p.codigo;
                      const img =
                        p.imagenes && p.imagenes.length > 0
                          ? p.imagenes[0]
                          : p.imagen || '/img/lego-default.png';
                      const precioValido = isNaN(Number(p.precio)) ? 0 : Number(p.precio);

                      return (
                        <div className="col" key={id}>
                          <div
                            className={`card h-100 border-0 shadow-sm rounded-3 p-2 pos-product-card ${
                              stock === 0 ? 'opacity-50' : ''
                            }`}
                            style={{ cursor: stock > 0 ? 'pointer' : 'default' }}
                            onClick={() => stock > 0 && agregarAlPos(p)}
                          >
                            <div
                              className="bg-light rounded-3 p-2 text-center mb-2 position-relative d-flex align-items-center justify-content-center"
                              style={{ height: '90px' }}
                            >
                              <img
                                src={img}
                                alt={p.nombre || 'Producto'}
                                style={{
                                  maxHeight: '75px',
                                  maxWidth: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                              <span
                                className={`badge ${
                                  stock > 0 ? 'bg-success' : 'bg-danger'
                                } position-absolute top-0 end-0 m-1`}
                              >
                                Stk: {stock}
                              </span>
                            </div>
                            <h6
                              className="fw-bold small text-dark text-truncate mb-1"
                              title={p.nombre || 'Producto sin nombre'}
                            >
                              {p.nombre || 'Producto sin nombre'}
                            </h6>
                            <p className="fw-bold text-danger mb-0 small">
                              ${precioValido.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA TICKET / ORDEN DE VENTA */}
            <div className="col-12 col-xl-4 p-0 ps-xl-2">
              <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <h5 className="fw-bold mb-0 fs-6 fs-md-5">
                      <i className="bi bi-receipt me-2"></i>Orden de Venta
                    </h5>
                    <button className="btn btn-sm btn-outline-danger" onClick={limpiarPos}>
                      <i className="bi bi-trash me-1"></i>Limpiar
                    </button>
                  </div>

                  {/* Cliente */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Cliente Asociado
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="RUN / Nombre (Opcional)"
                      value={clienteRun}
                      onChange={(e) => setClienteRun(e.target.value)}
                    />
                  </div>

                  {/* Lista de Ítems */}
                  <div
                    className="ticket-items overflow-auto mb-3 pe-1"
                    style={{ maxHeight: '220px' }}
                  >
                    {carritoPos.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-cart-x fs-2 d-block mb-1"></i>Boleta vacía.
                      </div>
                    ) : (
                      carritoPos.map((item) => {
                        const sub = item.precio * item.cant;
                        return (
                          <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                          >
                            <div style={{ maxWidth: '130px' }}>
                              <h6 className="fw-bold small mb-0 text-truncate">{item.nombre}</h6>
                              <span className="text-muted small">
                                ${item.precio.toLocaleString('es-CL')}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-1 gap-sm-2">
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-secondary py-0 px-2"
                                  onClick={() => cambiarCantPos(item.id, -1)}
                                >
                                  -
                                </button>
                                <span className="btn btn-light disabled py-0 px-2 fw-bold text-dark">
                                  {item.cant}
                                </span>
                                <button
                                  className="btn btn-outline-secondary py-0 px-2"
                                  onClick={() => cambiarCantPos(item.id, 1)}
                                >
                                  +
                                </button>
                              </div>
                              <span className="fw-bold small text-dark text-end ms-1" style={{ minWidth: '50px' }}>
                                ${sub.toLocaleString('es-CL')}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Totales, Efectivo y Vuelto */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Subtotal (Neto):</span>
                    <span>${subtotalNeto.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>IVA (19%):</span>
                    <span>${ivaCalculado.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-4 text-dark mb-3">
                    <span>TOTAL:</span>
                    <span className="text-danger">${totalVentaActual.toLocaleString('es-CL')}</span>
                  </div>

                  {/* Pago en Efectivo y Vuelto */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted mb-1">
                        Método
                      </label>
                      <select
                        className="form-select form-select-sm fw-bold"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      >
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Debito">💳 Débito/Crédito</option>
                        <option value="Transferencia">📲 Transferencia</option>
                      </select>
                    </div>
                    {metodoPago === 'Efectivo' && (
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Paga Con
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm fw-bold"
                          placeholder="$0"
                          value={montoPagaCon}
                          onChange={(e) => setMontoPagaCon(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {metodoPago === 'Efectivo' && (
                    <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-3 mb-3">
                      <span className="fw-semibold text-muted small">VUELTO:</span>
                      <span className="fw-bold fs-5 text-success">
                        ${vueltoCalculado.toLocaleString('es-CL')}
                      </span>
                    </div>
                  )}

                  {/* Botón Ejecutar Venta */}
                  <button
                    className="btn btn-danger btn-lg w-100 fw-bold shadow-sm py-2"
                    onClick={procesarVentaPos}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>COMPLETAR VENTA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Apertura de Caja */}
      {showApertura && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">
                  <i className="bi bi-door-open text-danger me-2"></i>Apertura de Caja
                </h5>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small">
                  Ingresa el monto inicial con el que abres el turno.
                </p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Fondo Inicial ($):</label>
                  <input
                    type="number"
                    className="form-control form-control-lg fw-bold"
                    placeholder="Ej: 50000"
                    value={montoApertura}
                    onChange={(e) => setMontoApertura(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-danger fw-bold rounded-3 w-100 py-2"
                  onClick={handleConfirmarApertura}
                >
                  ABRIR CAJA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cierre de Caja */}
      {showCierre && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">
                  <i className="bi bi-lock text-danger me-2"></i>Cierre de Caja
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCierre(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-warning small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  Ingresa el efectivo contado para cerrar turno.
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Efectivo Físico ($):</label>
                  <input
                    type="number"
                    className="form-control form-control-lg fw-bold"
                    placeholder="Monto contado..."
                    value={montoCierreFisico}
                    onChange={(e) => setMontoCierreFisico(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-dark fw-bold rounded-3 w-100 py-2"
                  onClick={handleConfirmarCierre}
                >
                  CERRAR TURNO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ticket */}
      {showTicketModal && ultimoTicket && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-body text-center p-4">
                <div className="text-success display-1 mb-2">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h4 className="fw-bold mb-1">¡Venta Registrada!</h4>
                <p className="text-muted small mb-3">Stock actualizado en tiempo real.</p>

                <div className="p-3 rounded-3 ticket-pos text-start mb-3 small font-monospace bg-light border">
                  <div className="text-center fw-bold text-uppercase fs-6">
                    RMSTORE COLECCIONABLES
                  </div>
                  <div className="text-center fw-bold">R.U.T.: 77.123.456-K</div>
                  <div className="text-center fw-bold mt-1 text-uppercase">
                    BOLETA ELECTRÓNICA: {ultimoTicket.numBoleta}
                  </div>
                  <div className="border-top border-dashed my-2"></div>
                  <div>FECHA: {ultimoTicket.fecha}</div>
                  <div>CAJERO: {(ultimoTicket.vendedor || 'Vendedor').split('@')[0]}</div>
                  <div>CLIENTE: {ultimoTicket.cliente}</div>
                  <div className="border-top border-dashed my-2"></div>
                  <table className="w-100">
                    <thead>
                      <tr className="fw-bold">
                        <th style={{ textAlign: 'left', width: '55%' }}>ITEM</th>
                        <th style={{ textAlign: 'center', width: '15%' }}>CANT</th>
                        <th style={{ textAlign: 'right', width: '30%' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimoTicket.items.map((i, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'left' }}>{i.nombre}</td>
                          <td style={{ textAlign: 'center' }}>{i.cant}</td>
                          <td style={{ textAlign: 'right' }}>
                            ${(i.precio * i.cant).toLocaleString('es-CL')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border-top my-2"></div>
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'right' }}>SUBTOTAL:</td>
                        <td style={{ textAlign: 'right', width: '90px' }}>
                          ${Math.round(ultimoTicket.total / 1.19).toLocaleString('es-CL')}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'right' }}>IVA INCLUIDO (19%):</td>
                        <td style={{ textAlign: 'right' }}>
                          $
                          {(
                            ultimoTicket.total - Math.round(ultimoTicket.total / 1.19)
                          ).toLocaleString('es-CL')}
                        </td>
                      </tr>
                      <tr className="fw-bold fs-6">
                        <td style={{ textAlign: 'right' }}>TOTAL:</td>
                        <td style={{ textAlign: 'right' }}>
                          ${ultimoTicket.total.toLocaleString('es-CL')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="border-top border-dashed my-2"></div>
                  <div className="fw-bold text-uppercase">FORMAS DE PAGO:</div>
                  <div className="d-flex justify-content-between">
                    <span>{ultimoTicket.metodoPago}:</span>
                    <span>
                      ${(ultimoTicket.pagoCon || ultimoTicket.total).toLocaleString('es-CL')}
                    </span>
                  </div>
                  {ultimoTicket.vuelto > 0 && (
                    <div className="d-flex justify-content-between fw-bold">
                      <span>VUELTO:</span>
                      <span>${ultimoTicket.vuelto.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  <div className="border-top border-dashed my-2"></div>
                  <div className="text-center fw-bold mt-2">*** GRACIAS POR TU COMPRA ***</div>
                  <div className="text-center">www.rmstore.cl</div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary fw-bold flex-grow-1"
                    onClick={() => imprimirTicketDirecto(ultimoTicket)}
                  >
                    <i className="bi bi-printer me-1"></i>Imprimir
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger fw-bold flex-grow-1"
                    onClick={() => {
                      setShowTicketModal(false);
                      limpiarPos();
                    }}
                  >
                    Nueva Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorPOS;