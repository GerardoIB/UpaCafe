import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./MisPedidos.css";

const MySwal = withReactContent(Swal);

const MisPedidos = ({ user }) => {
  const [historial, setHistorial] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelando, setCancelando] = useState(null);

  const toastConfig = { duration: 4000, position: "top-right" };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch(
          `https://upacafe.onrender.com/api/user/orders/${user}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("No se pudieron obtener tus pedidos");
        const data = await res.json();
        setHistorial(data);
        toast.success("Pedidos cargados correctamente", toastConfig);
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
      const res = await fetch(
        `https://upacafe.onrender.com/api/user/${pedidoId}/detalle`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Error al obtener el detalle del pedido");
      const data = await res.json();
      setDetalles((prev) => ({ ...prev, [pedidoId]: data }));
      toast.info("Detalles cargados", { ...toastConfig, duration: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cargar el detalle del pedido", toastConfig);
    }
  };

  const cancelarPedido = async (pedidoId) => {
    const result = await MySwal.fire({
      title: "¿Cancelar pedido?",
      html: "Esta acción no se puede deshacer",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Mantener pedido",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "custom-swal-popup",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",
      },
    });

    if (!result.isConfirmed) {
      toast.info("Cancelación abortada", { ...toastConfig, duration: 2000 });
      return;
    }

    setCancelando(pedidoId);
    const loadingToast = toast.loading("Cancelando pedido...", toastConfig);

    try {
      const res = await fetch(
        `https://upacafe.onrender.com/api/orders/updateOrderStatus/${pedidoId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newState: "cancelado" }),
        }
      );
      if (!res.ok) throw new Error("No se pudo cancelar el pedido");
      await res.json();

      setHistorial((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: "Cancelado" } : p))
      );

      toast.dismiss(loadingToast);
      toast.success("Pedido cancelado exitosamente", toastConfig);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(`Error al cancelar: ${err.message}`, toastConfig);
    } finally {
      setCancelando(null);
    }
  };

  if (loading)
    return (
      <div className="mis-pedidos-container loading-state">
        <p>Cargando tus pedidos...</p>
      </div>
    );

  if (error)
    return (
      <div className="mis-pedidos-container error-state">
        <p className="error">{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );

  return (
    <div className="mis-pedidos-container">
      <h1>📋 Mis Pedidos</h1>

      {historial.length === 0 ? (
        <div className="no-pedidos">
          <p>No tienes pedidos realizados.</p>
          <button
            className="btn-primary"
            onClick={() =>
              toast.info("Redirigiendo al catálogo...", toastConfig)
            }
          >
            Ver Catálogo
          </button>
        </div>
      ) : (
        <div className="pedidos-grid">
          {historial.map((pedido) => (
            <div className="pedido-card" key={pedido.id}>
              <div className="pedido-header">
                <span>Pedido #{pedido.id}</span>
                <span
                  className={`estado ${
                    pedido.estado?.toLowerCase() || "pendiente"
                  }`}
                >
                  {pedido.estado || "Pendiente"}
                </span>
              </div>

              <div className="pedido-info">
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(pedido.fecha).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> ${pedido.total}
                </p>
              </div>

              <div className="pedido-actions">
                <button
                  className="btn-ver"
                  onClick={() => toggleDetalle(pedido.id)}
                >
                  {detalles[pedido.id] ? "Ocultar detalle" : "Ver detalle"}
                </button>

                {(pedido.estado === "pendiente" ||
                  pedido.estado === "preparando") && (
                  <button
                    className="btn-cancelar"
                    onClick={() => cancelarPedido(pedido.id)}
                    disabled={cancelando === pedido.id}
                  >
                    {cancelando === pedido.id ? "Cancelando..." : "Cancelar"}
                  </button>
                )}
              </div>

              {detalles[pedido.id] && (
                <div className="pedido-detalle">
                  <h4>🧾 Productos</h4>
                  <ul>
                    {detalles[pedido.id].map((item) => (
                      <li key={item.id}>
                        {item.nombre_producto} - ${item.precio_unitario} x{" "}
                        {item.cantidad} = ${item.subtotal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
