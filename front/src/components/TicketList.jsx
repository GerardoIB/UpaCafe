import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import "./Ticket.css"; // Puedes mantener tus estilos básicos

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(
          "https://upacafe.onrender.com/api/orders/tickets/user/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener tickets");

        const data = await res.json();
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="no-tickets">
        <Message severity="info" text="No hay tickets disponibles." />
      </div>
    );
  }

  return (
    <div className="tickets-grid">
      {tickets.map((ticket) => {
        const fecha = ticket.fecha_emision
          ? new Date(ticket.fecha_emision).toLocaleString("es-MX", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "-";

        return (
          <Card
            key={ticket.ticket_id || Math.random()}
            title={`Ticket #${ticket.ticket_id}`}
            className="ticket-card"
          >
            <p><strong>Pedido ID:</strong> {ticket.pedido_id || "-"}</p>
            <p><strong>Usuario ID:</strong> {ticket.usuario_id || "-"}</p>
            <p><strong>Estado:</strong> {ticket.estado_pedido || "-"}</p>
            <p><strong>Pagado:</strong> {ticket.pagado ? "✅ Sí" : "❌ No"}</p>

            {ticket.productos?.length > 0 && (
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

            <hr />
            <p><strong>Total:</strong> ${ticket.monto_total || 0}</p>
            <p><strong>Fecha de emisión:</strong> {fecha}</p>
            <p className="gracias">¡Gracias por tu compra!</p>
          </Card>
        );
      })}
    </div>
  );
};

export default TicketsList;
