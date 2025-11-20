import React from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function OrderDetailsModal({ visible, onHide, orderInfo }) {
  if (!orderInfo) return null;

  const headerTemplate = () => (
    <div className="flex align-items-center gap-3">
      <i className="pi pi-shopping-cart" style={{ fontSize: "1.5rem" }}></i>
      <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>
        Pedido #{orderInfo.id}
      </span>
    </div>
  );

  const footerTemplate = () => (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cerrar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
    </div>
  );

  const productoTemplate = (row) => (
    <div className="flex align-items-center gap-2" style={{ fontWeight: 600 }}>
      <i className="pi pi-box" style={{ fontSize: "1rem" }}></i>
      {row.producto_nombre}
    </div>
  );

  const cantidadTemplate = (row) => (
    <span style={{ fontWeight: 500 }}>{row.cantidad}</span>
  );

  const subtotalTemplate = (row) => (
    <span style={{ fontWeight: 700 }}>${row.subtotal.toFixed(2)}</span>
  );

  return (
    <Dialog
      header={headerTemplate()}
      footer={footerTemplate()}
      visible={visible}
      onHide={onHide}
      modal
      style={{ width: "45rem" }}
    >
      <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Detalles del Pedido</h3>

      <DataTable value={orderInfo.productos} stripedRows style={{ marginBottom: "1.5rem" }}>
        <Column header="Producto" body={productoTemplate} style={{ width: "40%" }} />
        <Column header="Cantidad" body={cantidadTemplate} style={{ width: "20%" }} />
        <Column header="Subtotal" body={subtotalTemplate} style={{ width: "20%" }} />
      </DataTable>

      <div className="flex justify-content-end" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
        Total: ${orderInfo.total.toFixed(2)}
      </div>
    </Dialog>
  );
}
