// src/components/NotificationBell.jsx
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import './NotificationBell.css';

const NotificationBell = ({ notifications = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-container">
      <div className="bell-icon" onClick={() => setOpen(!open)}>
        <FaBell />
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </div>

      {open && (
        <div className="notification-panel">
          <h4>Notificaciones</h4>
          {notifications.length === 0 ? (
            <p className="no-notifications">No tienes nuevas notificaciones</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id}>
                  <strong>{n.titulo}</strong>
                  <p>{n.mensaje}</p>
                  <span className="time">{n.hora}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
