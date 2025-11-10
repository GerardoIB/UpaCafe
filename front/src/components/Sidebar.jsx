import { useState } from 'react';
import {
  FaBars, FaHome, FaShoppingBag, FaUtensils,
  FaSignOutAlt, FaPlus, FaUsersCog, FaClipboardList,
  FaUserPlus, FaTable
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onNavigate, onLogout, user, onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);

  // 🔄 Maneja apertura/cierre y avisa al padre
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  // 📋 Renderizado del menú según el rol
  const renderMenuByRole = () => {
    switch (user?.rol_id) {
      case 1: // 🧑‍💼 ADMINISTRADOR
        return (
          <>
            <div className="item" onClick={() => onNavigate('/home')}>
              <FaHome className="icon" />
              {isOpen && <span>Panel</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/manage-users')}>
              <FaUsersCog className="icon" />
              {isOpen && <span>Usuarios</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/orders')}>
              <FaClipboardList className="icon" />
              {isOpen && <span>Pedidos</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/add-employee')}>
              <FaUserPlus className="icon" />
              {isOpen && <span>Agregar empleado</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/inventario')}>
              <FaTable className="icon" />
              {isOpen && <span>Inventario</span>}
            </div>
          </>
        );

      case 2: // 👨‍🍳 TRABAJADOR
        return (
          <>
            <div className="item" onClick={() => onNavigate('/home')}>
              <FaHome className="icon" />
              {isOpen && <span>Inicio</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/orders')}>
              <FaUtensils className="icon" />
              {isOpen && <span>Pedidos activos</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/addPedido')}>
              <FaPlus className="icon" />
              {isOpen && <span>Hacer pedido</span>}
            </div>
          </>
        );

      default: // ☕ CLIENTE
        return (
          <>
            <div className="item" onClick={() => onNavigate('/home')}>
              <FaHome className="icon" />
              {isOpen && <span>Inicio</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/crear-pedido')}>
              <FaPlus className="icon" />
              {isOpen && <span>Hacer pedido</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/MisPedidos')}>
              <FaShoppingBag className="icon" />
              {isOpen && <span>Mis pedidos</span>}
            </div>

            <div className="item" onClick={() => onNavigate('/tickets')}>
              <FaUtensils className="icon" />
              {isOpen && <span>Tickets</span>}
            </div>
          </>
        );
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* 🔝 Logo y toggle */}
      <div className="top-section">
        <h2 className="logo">{isOpen ? 'Café Uni' : '☕'}</h2>
        <div className="toggle-btn" onClick={handleToggle} title="Expandir / Colapsar">
          <FaBars />
        </div>
      </div>

      {/* 📁 Menú dinámico */}
      <div className="menu-items">{renderMenuByRole()}</div>

      {/* 🚪 Cerrar sesión */}
      <div className="logout-section" onClick={onLogout}>
        <div className="item logout">
          <FaSignOutAlt className="icon" />
          {isOpen && <span>Cerrar sesión</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
