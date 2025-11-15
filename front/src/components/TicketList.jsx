import React, { useEffect, useState } from 'react';
import Ticket from './Ticket';

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch('https://upacafe.onrender.com/api/orders/tickets/user/',{
       method: 'GET',
          credentials: 'include',
    }) // tu endpoint real
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setTickets(data)})
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>🎟️ Lista de Tickets</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {tickets.map(ticket => (
          <Ticket key={ticket.ticket_id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketsList;
