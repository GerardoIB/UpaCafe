import React from 'react';
import './Ticket.css';

const Ticket = ({ ticket }) => {
  const fecha = new Date(ticket.fecha_emision).toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2>Cafetería Universitaria</h2>
        <p>📍 Universidad XYZ</p>
      </div>

      <div className="ticket-body">
        <p><strong>Ticket #:</strong> {ticket.ticket_id}</p>
        <p><strong>Pedido ID:</strong> {ticket.pedido_id}</p>
        <p><strong>Usuario ID:</strong> {ticket.usuario_id}</p>
        <p><strong>Estado del pedido:</strong> {ticket.estado_pedido}</p>
        <p><strong>Pagado:</strong> {ticket.pagado ? '✅ Sí' : '❌ No'}</p>

        {ticket.productos && ticket.productos.length > 0 && (
          <>
            <hr />
            <h4>Productos:</h4>
            <ul>
              {ticket.productos.map((item, index) => (
                <li key={index}>
                  {item.nombre} - ${item.precio} x {item.cantidad}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="ticket-footer">
        <p><strong>Total:</strong> ${ticket.monto_total}</p>
        <p><strong>Fecha de emisión:</strong> {fecha}</p>
        <p className="gracias">¡Gracias por tu compra!</p>
      </div>
    </div>
  );
};

export default Ticket;
