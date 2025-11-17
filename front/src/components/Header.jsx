import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import NotificationBell from "./NotificationBell";
import { FaUserCircle, FaBars } from "react-icons/fa";
import "./Header.css";

const socket = io("https://upacafe.onrender.com/", { withCredentials: true });

const Header = ({ user, onLogout, sidebarCollapsed, onMenuToggle, isMobile }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    // Cargar notificaciones iniciales
    fetch(`https://upacafe.onrender.com/api/user/notificaciones/${user.id}`, {
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
          hora: new Date().toLocaleTimeString("es-MX", { 
            hour: "2-digit", 
            minute: "2-digit" 
          })
        },
        ...prev
      ]);
    });

    return () => socket.off("orderStatusChanged");
  }, [user?.id]);

  return (
    <header className={`header ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="header-left">
        {/* Botón hamburguesa solo en móvil */}
        {isMobile && (
          <button 
            className="menu-toggle" 
            onClick={onMenuToggle}
            aria-label="Abrir menú"
          >
            <FaBars />
          </button>
        )}
        <h2 className="header-title">Café Uni</h2>
      </div>

      <div className="header-right">
        <NotificationBell notifications={notifications} />
        
        {/* Info usuario solo en desktop */}
        {!isMobile && (
          <>
            <FaUserCircle className="user-icon" />
            <div className="user-info">
              <span className="user-name">{user?.nombre || "Usuario"}</span>
              <span className="user-email">{user?.email || "correo@universidad.edu"}</span>
            </div>
          </>
        )}

        <button className="logout-btn" onClick={onLogout}>
          {isMobile ? 'Salir' : 'Cerrar sesión'}
        </button>
      </div>
    </header>
  );
};

export default Header;