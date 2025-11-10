import React, { useEffect, useState } from "react";
import OrderTable from "../components/OrdersTable";
import "../css/Orders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders/allOrders", {
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

  if (loading) {
    return <div className="loading-screen">Cargando pedidos...</div>;
  }

  return (
    <div className="orders-page">
      <h1>📦 Todos los pedidos</h1>
      <OrderTable orders={orders} />
    </div>
  );
};

export default AdminOrders;
