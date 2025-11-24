import React, { useEffect, useState } from "react";
import OrderTable from "../components/OrdersTable";
import OrderDetailsModal from "../components/OrderDatilsModal"; // ← Corrige el nombre aquí
import "../css/Orders.css";

const TrabajadorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("acces_token");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]); // ← Array de productos
  const [selectedOrderInfo, setSelectedOrderInfo] = useState(null); // ← Info del pedido

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

      const productosData = await res.json(); // Array de productos
      console.log("Productos del pedido:", productosData);

      // Busca la información del pedido en la lista de orders
      const orderInfo = orders.find(o => o.id === orderId);
      console.log("Info del pedido:", orderInfo);

      // Actualiza los estados separados
      setSelectedOrderDetails(productosData); // Array de productos
      setSelectedOrderInfo(orderInfo); // Info del pedido (id, usuario, fecha, total, estado)
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
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
        orderDetails={selectedOrderDetails} // ← Array de productos
        orderInfo={selectedOrderInfo} // ← Info del pedido completa
      />
    </div>
  );
};

export default TrabajadorDashboard;