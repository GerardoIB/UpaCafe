import React, { useEffect, useState } from 'react';
import Ticket from './Ticket';

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);

useEffect(() => {
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return; // si no hay token, no hacemos nada

      const res = await fetch('https://upacafe.onrender.com/api/orders/tickets/user/', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error('Error al obtener tickets');

      const data = await res.json();
      console.log(data);
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchTickets();
}, []);


  return (
    {tickets.length === 0 ? (
  <p>No hay tickets disponibles.</p>
) : (
  
    <div>
      
      <h1>🎟️ Lista de Tickets</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {tickets.map(ticket => (
          <Ticket key={ticket.ticket_id} ticket={ticket} />
        ))}
      </div>
    </div>
      )}
  );
};

export default TicketsList;
