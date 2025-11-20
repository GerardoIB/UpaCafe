import React, { useEffect, useState } from "react";
import OrderTable from "../components/OrdersTable";
import OrderDetailsModal from "../components/OrderDatilsModal";
import "../css/Orders.css";

const TrabajadorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("acces_token");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);

  const handleViewDetails = async (orderId) => {
    try {
      const res = await fetch(
        `https://upacafe.onrender.com/api/orders/order/details/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json(); // ← ARRAY DE DETALLES
      console.log("Detalles del pedido:", data);

      // Transformación correcta
      const productos = data.map((item) => ({
        ...item,
        subtotal: Number(item.precio_unitario) * Number(item.cantidad),
      }));

      const total = productos.reduce((acc, item) => acc + item.subtotal, 0);

      const orderFormatted = {
        id: orderId,
        total,
        productos,
      };

      setSelectedOrderInfo(orderFormatted);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

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
      const res = await fetch(
        `https://upacafe.onrender.com/api/orders/updateOrderStatus/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ newState: nuevoEstado }),
        }
      );

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

  if (loading) {
    return <div className="loading-screen">Cargando pedidos...</div>;
  }

  return (
    <div className="orders-page">
      <h1>📦 Todos los pedidos</h1>

      <OrderTable
        orders={orders}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />

      <OrderDetailsModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        orderInfo={selectedOrderInfo}
      />
    </div>
  );
};

export default TrabajadorDashboard;
