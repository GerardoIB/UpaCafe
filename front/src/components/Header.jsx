// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationBell from "./NotificationBell";
import { FaUserCircle, FaBars } from "react-icons/fa";
import "./Header.css";

const socket = io("http://localhost:3000", { withCredentials: true });

const Header = ({ user, onLogout, sidebarCollapsed, onToggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Cargar notificaciones iniciales
    fetch(`http://localhost:3000/api/user/notificaciones/${user.id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setNotifications)
      .catch(console.error);

    // Escuchar eventos en tiempo real
    socket.on("orderStatusChanged", (data) => {
      console.log("🔔 Pedido actualizado:", data);
      setNotifications(prev => [
        {
          id: Date.now(),
          titulo: "Estado de pedido actualizado",
          mensaje: `El pedido #${data.pedidoId} cambió a "${data.newState}"`,
          hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
        },
        ...prev
      ]);
    });

    return () => socket.off("orderStatusChanged");
  }, [user.id]);

  return (
   <header className={`header ${sidebarCollapsed ? 'collapsed' : ''}`}>
  <div className="header-left">
    <h2 className="header-title">Café Uni</h2>
  </div>
  <div className="header-right">
        <NotificationBell notifications={notifications} />
        <FaUserCircle className="user-icon" />
        <div className="user-info">
          <span className="user-name">{user?.nombre || "Usuario"}</span>
          <span className="user-email">{user?.email || "correo@universidad.edu"}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
