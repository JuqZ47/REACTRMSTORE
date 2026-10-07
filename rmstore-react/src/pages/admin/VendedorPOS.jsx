import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProductosStorage, saveProductoStorage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

const VendedorPOS = () => {
  const { sesion } = useAuth();
  const [productos, setProductos] = useState([]);
  const [carritoPos, setCarritoPos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [montoPagaCon, setMontoPagaCon] = useState('');
  const [clienteRun, setClienteRun] = useState('');

  useEffect(() => {
    setProductos(getProductosStorage());
  }, []);

  const agregarAlPos = (prod) => {
    const stockDisp = Number(prod.stock) || 0;
    if (stockDisp <= 0) return;

    setCarritoPos(prev => {
      const itemExist = prev.find(i => i.id === (prod.id || prod.codigo));
      if (itemExist) {
        if (itemExist.cant + 1 > stockDisp) {
          alert(`Stock máximo alcanzado (${stockDisp} un.).`);
          return prev;
        }
        return prev.map(i => i.id === (prod.id || prod.codigo) ? { ...i, cant: i.cant + 1 } : i);
      }
      return [...prev, {
        id: prod.id || prod.codigo,
        nombre: prod.nombre,
        precio: Number(prod.precio),
        cant: 1,
        stockMax: stockDisp
      }];
    });
  };

  const cambiarCantPos = (id, delta) => {
    setCarritoPos(prev => prev.map(i => {
      if (i.id === id) {
        const nueva = i.cant + delta;
        if (nueva > i.stockMax) return i;
        if (nueva <= 0) return null;
        return { ...i, cant: nueva };
      }
      return i;
    }).filter(Boolean));
  };

  const totalVenta = carritoPos.reduce((acc, i) => acc + (i.precio * i.cant), 0);
  const pagaConNum = Number(montoPagaCon) || 0;
  const vuelto = (metodoPago === 'Efectivo' && pagaConNum >= totalVenta) ? (pagaConNum - totalVenta) : 0;

  const handleCompletarVenta = () => {
    if (carritoPos.length === 0) return alert("Selecciona al menos un producto.");
    if (metodoPago === 'Efectivo' && pagaConNum < totalVenta) return alert("Monto entregado es menor al total.");

    let prods = getProductosStorage();
    carritoPos.forEach(item => {
      const idx = prods.findIndex(p => (p.id || p.codigo) === item.id);
      if (idx !== -1) {
        prods[idx].stock = Math.max(0, Number(prods[idx].stock) - item.cant);
      }
    });

    localStorage.setItem("rmstore_productos", JSON.stringify(prods));
    setProductos(prods);
    setCarritoPos([]);
    setMontoPagaCon('');
    setClienteRun('');
    alert("¡Venta completada exitosamente! Stock actualizado.");
  };

  const filtrados = productos.filter(p => {
    const texto = busqueda.toLowerCase().trim();
    const id = (p.id || p.codigo || '').toLowerCase();
    const nombre = (p.nombre || '').toLowerCase();
    const coincideTexto = id.includes(texto) || nombre.includes(texto);
    const coincideCat = catFilter === 'Todos' || p.categoria === catFilter;
    return coincideTexto && coincideCat;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar activo="pos" />
      <main className="admin-main">
        <header className="admin-header d-flex justify-content-between align-items-center gap-3 pe-3">
        <h2 className="h4 fw-bold mb-0">Terminal POS - Punto de Venta</h2>
        <div className="admin-user d-flex align-items-center ms-auto">
            <span className="badge bg-light text-dark border px-3 py-2 fw-semibold fs-6 shadow-sm">
            <i className="bi bi-person-circle me-2 text-danger"></i>
            {sesion?.email}
            </span>
        </div>
        </header>

        <section className="admin-content p-4">
          <div className="row g-4">
            {/* Catálogo Left */}
            <div className="col-12 col-lg-7">
              <div className="bg-white p-4 rounded-4 shadow-sm">
                <div className="row g-2 mb-3">
                  <div className="col-7">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por código o nombre..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                  <div className="col-5">
                    <select className="form-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
                      <option value="Todos">Todas</option>
                      <option value="Star Wars">Star Wars</option>
                      <option value="Technic">Technic</option>
                      <option value="Harry Potter">Harry Potter</option>
                      <option value="City">City</option>
                    </select>
                  </div>
                </div>

                <div className="row row-cols-2 row-cols-md-3 g-3 overflow-auto" style={{ maxHeight: '60vh' }}>
                  {filtrados.map(p => (
                    <div className="col" key={p.id || p.codigo}>
                      <div className="card h-100 p-2 shadow-sm border-0 text-center cursor-pointer" onClick={() => agregarAlPos(p)}>
                        <img src={(p.imagenes && p.imagenes[0]) || p.imagen} alt={p.nombre} style={{ height: '70px', objectFit: 'contain' }} />
                        <h6 className="small fw-bold text-truncate mt-2 mb-1">{p.nombre}</h6>
                        <span className="text-danger fw-bold small">${Number(p.precio).toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ticket Right */}
            <div className="col-12 col-lg-5">
              <div className="bg-white p-4 rounded-4 shadow-sm">
                <h5 className="fw-bold mb-3">Orden de Venta</h5>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Cliente</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="RUN / Nombre"
                    value={clienteRun}
                    onChange={(e) => setClienteRun(e.target.value)}
                  />
                </div>

                <div className="overflow-auto mb-3" style={{ maxHeight: '200px' }}>
                  {carritoPos.map(i => (
                    <div key={i.id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <div>
                        <span className="d-block small fw-bold">{i.nombre}</span>
                        <span className="text-muted small">${i.precio.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => cambiarCantPos(i.id, -1)}>-</button>
                        <span className="fw-bold small">{i.cant}</span>
                        <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => cambiarCantPos(i.id, 1)}>+</button>
                        <span className="fw-bold small text-danger ms-2">${(i.precio * i.cant).toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between fs-4 fw-bold mb-3">
                    <span>TOTAL:</span>
                    <span className="text-danger">${totalVenta.toLocaleString('es-CL')}</span>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <select className="form-select form-select-sm" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Debito">💳 Débito/Crédito</option>
                      </select>
                    </div>
                    {metodoPago === 'Efectivo' && (
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Monto entregado"
                          value={montoPagaCon}
                          onChange={(e) => setMontoPagaCon(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {metodoPago === 'Efectivo' && (
                    <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-3 mb-3">
                      <span className="small fw-semibold text-muted">VUELTO:</span>
                      <span className="fw-bold text-success">${vuelto.toLocaleString('es-CL')}</span>
                    </div>
                  )}

                  <button className="btn btn-danger btn-lg w-100 fw-bold shadow-sm" onClick={handleCompletarVenta}>
                    COMPLETAR VENTA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VendedorPOS;