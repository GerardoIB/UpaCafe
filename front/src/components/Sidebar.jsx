import { useState, useEffect } from 'react';
import {
  FaBars, FaHome, FaShoppingBag, FaUtensils,
  FaSignOutAlt, FaPlus, FaUsersCog, FaClipboardList,
  FaUserPlus, FaTable
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onNavigate, onLogout, user, onToggle, isOpen }) => {
  const [internalOpen, setInternalOpen] = useState(isOpen ?? true);

  // Sincronizar con prop externa
  useEffect(() => {
    if (isOpen !== undefined) {
      setInternalOpen(isOpen);
    }
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !internalOpen;
    setInternalOpen(newState);
    if (onToggle) onToggle(newState);
  };

  const handleNavigation = (ruta) => {
    onNavigate(ruta);
    // En móvil, cerrar sidebar después de navegar
    if (window.innerWidth <= 768) {
      setInternalOpen(false);
      if (onToggle) onToggle(false);
    }
  };

  const renderMenuByRole = () => {
    switch (user?.rol_id) {
      case 1: // ADMINISTRADOR
        return (
          <>
            <div className="item" onClick={() => handleNavigation('/admin')}>
              <FaHome className="icon" />
              {internalOpen && <span>Panel</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/manage-users')}>
              <FaUsersCog className="icon" />
              {internalOpen && <span>Usuarios</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/orders')}>
              <FaClipboardList className="icon" />
              {internalOpen && <span>Pedidos</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/add-employee')}>
              <FaUserPlus className="icon" />
              {internalOpen && <span>Agregar empleado</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/inventario')}>
              <FaTable className="icon" />
              {internalOpen && <span>Inventario</span>}
            </div>
          </>
        );

      case 2: // TRABAJADOR
        return (
          <>
            <div className="item" onClick={() => handleNavigation('/trabajador')}>
              <FaHome className="icon" />
              {internalOpen && <span>Inicio</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/orders')}>
              <FaUtensils className="icon" />
              {internalOpen && <span>Pedidos activos</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/addPedido')}>
              <FaPlus className="icon" />
              {internalOpen && <span>Hacer pedido</span>}
            </div>
          </>
        );

      default: // CLIENTE
        return (
          <>
            <div className="item" onClick={() => handleNavigation('/home')}>
              <FaHome className="icon" />
              {internalOpen && <span>Inicio</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/crear-pedido')}>
              <FaPlus className="icon" />
              {internalOpen && <span>Hacer pedido</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/MisPedidos')}>
              <FaShoppingBag className="icon" />
              {internalOpen && <span>Mis pedidos</span>}
            </div>

            <div className="item" onClick={() => handleNavigation('/tickets')}>
              <FaUtensils className="icon" />
              {internalOpen && <span>Tickets</span>}
            </div>
          </>
        );
    }
  };

  return (
    <div className={`sidebar ${internalOpen ? 'open' : 'closed'}`}>
      <div className="top-section">
        <h2 className="logo">{internalOpen ? 'Café Uni' : '☕'}</h2>
        <div className="toggle-btn" onClick={handleToggle} title="Expandir / Colapsar">
          <FaBars />
        </div>
      </div>

      {/* Info de usuario */}
      {internalOpen && user && (
        <div className="user-info">
          <span className="user-icon">👤</span>
          <div className="user-details">
            <h3>{user.nombre}</h3>
            <p>{user.email}</p>
          </div>
        </div>
      )}

      <div className="menu-items">{renderMenuByRole()}</div>

      <div className="logout-section" onClick={onLogout}>
        <div className="item logout">
          <FaSignOutAlt className="icon" />
          {internalOpen && <span>Cerrar sesión</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;