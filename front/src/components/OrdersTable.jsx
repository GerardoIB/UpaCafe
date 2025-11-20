import React from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./OrdersTable.css";

const OrderTable = ({ orders, onStatusChange, onViewDetails }) => {
  console.log("onStatusChange recibido:", typeof onViewDetails);

  if (!orders || orders.length === 0) {
    return <p className="no-orders">No hay pedidos registrados.</p>;
  }

  const estados = [
    { label: "Preparando", value: "preparando" },
    { label: "Listo", value: "listo" },
    { label: "Entregado", value: "entregado" },
  ];

  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case "entregado":
        return "status-success";
      case "listo":
        return "status-info";
      case "preparando":
        return "status-warning";
      default:
        return "status-danger";
    }
  };

  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.usuario}</td>
            <td>${order.total}</td>
            <td>
              <span className={`status ${getStatusClass(order.estado)}`}>
                {order.estado}
              </span>
            </td>
            <td>{formatFecha(order.fecha)}</td>
            <td>
              <div className="action-cell">
                <Dropdown
                  value={order.estado}
                  options={estados}
                  onChange={(e) => onStatusChange(order.id, e.value)}
                  placeholder="Actualizar"
                  className="status-dropdown"
                />
                <Button
                  icon="pi pi-refresh"
                  className="p-button-rounded p-button-success p-button-sm"
                  onClick={() => onStatusChange(order.id, order.estado)}
                  tooltip="Actualizar estado"
                  tooltipOptions={{ position: "top" }}
                />
                <Button
  label="Ver detalles"
  className="p-button-info p-button-sm"
  onClick={() => onViewDetails(order.id)}
/>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
