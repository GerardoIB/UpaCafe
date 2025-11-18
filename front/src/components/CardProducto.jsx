import React, { useState } from "react";
import {
  FaCoffee,
  FaBreadSlice,
  FaHamburger,
  FaCookie,
  FaMugHot,
  FaPizzaSlice,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "./CardProducto.css";

const CardProducto = ({ producto, user }) => {
  const [loading, setLoading] = useState(false);

  const getIcon = (nombre) => {
    const n = nombre.toLowerCase();
    if (n.includes("café") || n.includes("capuchino")) return <FaMugHot className="producto-icon" />;
    if (n.includes("pan")) return <FaBreadSlice className="producto-icon" />;
    if (n.includes("sándwich") || n.includes("sandwich")) return <FaHamburger className="producto-icon" />;
    if (n.includes("galleta") || n.includes("cookie")) return <FaCookie className="producto-icon" />;
    if (n.includes("pizza")) return <FaPizzaSlice className="producto-icon" />;
    return <FaCoffee className="producto-icon" />;
  };

  const handlePedidoRapido = async () => {
    if (!user) {
      Swal.fire("Inicia sesión", "Debes iniciar sesión para pedir.", "warning");
      return;
    }

    const pedido = {
      clientId: user.id,
      productos: [
        {
          producto_id: producto.id,
          cantidad: 1,
          indicaciones: "",
          ingredientes_personalizados: [],
        },
      ],
    };

    const confirmar = await Swal.fire({
      title: `¿Pedir ${producto.nombre}?`,
      text: `Confirmar pedido rápido`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, pedir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2e7d32",
    });

    if (!confirmar.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch("https://upacafe.onrender.com/api/orders/createPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pedido),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al crear pedido");

      Swal.fire("✅ Pedido creado", `${producto.nombre} fue agregado correctamente.`, "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="producto-card">
      <div className="producto-icon-container">{getIcon(producto.nombre)}</div>
      <h3>{producto.nombre}</h3>
      <p className="producto-precio">${producto.precio}</p>
      <button
        className="pedido-btn"
        onClick={handlePedidoRapido}
        disabled={loading}
      >
        {loading ? "Creando..." : "Pedir ahora"}
      </button>
    </div>
  );
};

export default CardProducto;
