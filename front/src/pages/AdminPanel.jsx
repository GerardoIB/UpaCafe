import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import './AdminPanel.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    pedidosPorMes: [],
    ingresosMensuales: [],
    totalUsuarios: 0,
    totalTickets: 0,
  });

 useEffect(() => {
  fetch('http://localhost:3000/api/user/getStats', { credentials: 'include' })
    .then(async res => {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setStats({
          pedidosPorMes: data.pedidosPorMes || [],
          ingresosMensuales: data.ingresosMensuales || [],
          totalUsuarios: data.totalUsuarios || 0,
          totalTickets: data.totalTickets || 0,
        });
      } catch (e) {
        console.error('Respuesta no válida del backend:', text);
      }
    })
    .catch(err => console.error('Error al obtener estadísticas:', err));
}, []);
  

  return (
    <div className="dashboard">
      <h2>📊 Panel de Estadísticas</h2>

      <div className="stats-cards">
        <div className="card">
          <h3>🧾 Total de Tickets</h3>
          <p>{stats.totalTickets}</p>
        </div>
        <div className="card">
          <h3>👥 Total de Usuarios</h3>
          <p>{stats.totalUsuarios}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>📦 Pedidos por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.pedidosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#4f63d2" name="Pedidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>💰 Ingresos Mensuales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.ingresosMensuales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ingresos" stroke="#2e3a59" name="Ingresos" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHome;
