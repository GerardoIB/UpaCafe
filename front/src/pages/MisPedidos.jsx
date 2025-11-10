import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './MisPedidos.css';

const MySwal = withReactContent(Swal);

const MisPedidos = ({ user }) => {
  const [historial, setHistorial] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelando, setCancelando] = useState(null);

  // Configuración global de toasts
  const toastConfig = {
    duration: 4000,
    position: 'top-right',
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/orders/${user}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('No se pudieron obtener tus pedidos');
        const data = await res.json();
        setHistorial(data);
        
        toast.success('Pedidos cargados correctamente', toastConfig);
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`, toastConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user]);

  const toggleDetalle = async (pedidoId) => {
    if (detalles[pedidoId]) {
      setDetalles((prev) => {
        const copy = { ...prev };
        delete copy[pedidoId];
        return copy;
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/user/${pedidoId}/detalle`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al obtener el detalle del pedido');
      const data = await res.json();
      setDetalles((prev) => ({ ...prev, [pedidoId]: data }));
      toast.info('Detalles del pedido cargados', { ...toastConfig, duration: 2000 });
    } catch (err) {
      console.error(err);
      toast.error('No se pudo cargar el detalle del pedido', toastConfig);
    }
  };

  // 🟢 Acción para cancelar pedido
  const cancelarPedido = async (pedidoId) => {
    const result = await MySwal.fire({
      title: <p>¿Cancelar pedido?</p>,
      html: <p>Esta acción no se puede deshacer</p>,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Mantener pedido',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      }
    });

    if (!result.isConfirmed) {
      toast.info('Cancelación abortada', { ...toastConfig, duration: 2000 });
      return;
    }

    setCancelando(pedidoId);
    
    // Toast de carga
    const loadingToast = toast.loading('Cancelando pedido...', toastConfig);

    try {
      const res = await fetch(`http://localhost:3000/api/orders/updateOrderStatus/${pedidoId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newState: 'cancelado' }),
      });
      

      if (!res.ok) throw new Error('No se pudo cancelar el pedido');
      
      const updated = await res.json();

      // Actualizamos el estado local
      setHistorial((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: 'Cancelado' } : p))
      );
      
      // Cerramos toast de carga y mostramos éxito
      toast.dismiss(loadingToast);
      toast.success('Pedido cancelado exitosamente', toastConfig);
      
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(`Error al cancelar: ${err.message}`, toastConfig);
    } finally {
      setCancelando(null);
    }
  };

  if (loading) {
    return (
      <div className="mis-pedidos-container">
        <div className="loading-state">
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mis-pedidos-container">
        <div className="error-state">
          <p className="error">{error}</p>
          <button 
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-container">
      <h1>📋 Mis Pedidos</h1>

      {historial.length === 0 ? (
        <div className="no-pedidos">
          <p>No tienes pedidos realizados.</p>
          <button 
            className="btn-primary"
            onClick={() => toast.info('Redirigiendo al catálogo...', toastConfig)}
          >
            Ver Catálogo
          </button>
        </div>
      ) : (
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((pedido, index) => (
              <React.Fragment key={pedido.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{new Date(pedido.fecha).toLocaleString()}</td>
                  <td>${pedido.total}</td>
                  <td>
                    <span className={`estado ${pedido.estado?.toLowerCase() || 'pendiente'}`}>
                      {pedido.estado || 'Pendiente'}
                    </span>
                  </td>
                  <td className="acciones">
                    <button
                      className="btn-ver"
                      onClick={() => toggleDetalle(pedido.id)}
                    >
                      {detalles[pedido.id] ? 'Ocultar' : 'Ver Detalle'}
                    </button>

                    {(pedido.estado === 'pendiente' || pedido.estado === 'preparando') && (
                      <button
                        className="btn-cancelar"
                        onClick={() => cancelarPedido(pedido.id)}
                        disabled={cancelando === pedido.id}
                      >
                        {cancelando === pedido.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </td>
                </tr>

                {detalles[pedido.id] && (
                  <tr className="detalle-row">
                    <td colSpan="5">
                      <div className="detalle-container">
                        <h4>🧾 Productos del pedido #{pedido.id}</h4>
                        <table className="tabla-detalle">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio Unitario</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detalles[pedido.id].map((item) => (
                              <tr key={item.id}>
                                <td>{item.nombre_producto}</td>
                                <td>{item.cantidad}</td>
                                <td>${item.precio_unitario}</td>
                                <td>${item.subtotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MisPedidos;