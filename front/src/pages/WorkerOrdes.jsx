import React, { useEffect, useState } from "react";
import OrderTable from "../components/OrdersTable";
import "../css/Orders.css";

const WorkerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://upacafe.onrender.com/api/orders/allOrders", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar pedidos:", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, nuevoEstado) => {
    try {
      const res = await fetch(`https://upacafe.onrender.com/api/orders/updateOrderStatus/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, estado: nuevoEstado } : o))
        );
      } else {
        console.error("❌ Error en actualización");
      }
    } catch (err) {
      console.error("🚨 Error al conectar con API", err);
    }
  };
    console.log(handleStatusChange)
  if (loading) return <div className="loading-screen">Cargando pedidos...</div>;

  return (
    <div className="orders-page">
      <h1>📦 Todos los pedidos</h1>
      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default WorkerOrders;
