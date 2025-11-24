import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const OrderDetailsModal = ({ visible, onHide, orderDetails, orderInfo }) => {
  const [printing, setPrinting] = useState(false);

  const headerTemplate = () => {
    if (!orderInfo) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0.5rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <i className="pi pi-shopping-cart" style={{ fontSize: '1.5rem', color: '#2e7d32' }}></i>
          <div>
            <h2 style={{ margin: 0, color: '#2e7d32', fontSize: '1.5rem' }}>
              Pedido #{orderInfo.id}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Cliente: {orderInfo.usuario}
            </p>
          </div>
        </div>
        <Tag 
          value={orderInfo.estado || 'Preparando'} 
          severity={getStatusSeverity(orderInfo.estado)}
          style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
        />
      </div>
    );
  };

  const getStatusSeverity = (estado) => {
    switch (estado) {
      case 'entregado': return 'success';
      case 'listo': return 'info';
      case 'preparando': return 'warning';
      default: return 'danger';
    }
  };

  const formatCurrency = (value) => {
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const priceBodyTemplate = (rowData) => {
    return <strong style={{ color: '#2e7d32' }}>{formatCurrency(rowData.precio_unitario)}</strong>;
  };

  const subtotalBodyTemplate = (rowData) => {
    const subtotal = parseFloat(rowData.precio_unitario) * rowData.cantidad;
    return <strong style={{ color: '#1976d2' }}>{formatCurrency(subtotal)}</strong>;
  };

  const indicacionesBodyTemplate = (rowData) => {
    return rowData.indicaciones ? (
      <div style={{ 
        background: '#fff9c4', 
        padding: '0.5rem', 
        borderRadius: '6px',
        fontSize: '0.9rem',
        color: '#827717'
      }}>
        <i className="pi pi-info-circle" style={{ marginRight: '0.5rem' }}></i>
        {rowData.indicaciones}
      </div>
    ) : (
      <span style={{ color: '#999', fontStyle: 'italic' }}>Sin indicaciones</span>
    );
  };

  const cantidadBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={`${rowData.cantidad}x`} 
        style={{ background: '#e3f2fd', color: '#0d47a1', fontSize: '1rem' }}
      />
    );
  };

  const calculateTotal = () => {
    if (!orderDetails || orderDetails.length === 0) return 0;
    return orderDetails.reduce((sum, item) => {
      return sum + (parseFloat(item.precio_unitario) * item.cantidad);
    }, 0);
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  const footerContent = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 0 0.5rem 0',
      borderTop: '2px solid #e0e0e0'
    }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button 
          label="Imprimir" 
          icon="pi pi-print" 
          onClick={handlePrint}
          className="p-button-outlined p-button-secondary"
          loading={printing}
        />
        <Button 
          label="Cerrar" 
          icon="pi pi-times" 
          onClick={onHide}
          className="p-button-outlined"
        />
      </div>
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#2e7d32',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span>Total:</span>
        <span>{formatCurrency(orderInfo?.total || calculateTotal())}</span>
      </div>
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={headerTemplate}
      footer={footerContent}
      style={{ width: '90vw', maxWidth: '900px' }}
      breakpoints={{ '960px': '95vw' }}
      draggable={false}
      dismissableMask
    >
      <div style={{ padding: '1rem 0' }}>
        {orderInfo && orderInfo.fecha && (
          <div style={{ 
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Fecha del pedido</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', color: '#333' }}>
                <i className="pi pi-calendar" style={{ marginRight: '0.5rem', color: '#2e7d32' }}></i>
                {new Date(orderInfo.fecha).toLocaleString('es-MX', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Total a pagar</p>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600', fontSize: '1.2rem', color: '#2e7d32' }}>
                <i className="pi pi-dollar" style={{ marginRight: '0.5rem' }}></i>
                {formatCurrency(orderInfo.total)}
              </p>
            </div>
          </div>
        )}

        <h3 style={{ color: '#2e7d32', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="pi pi-list"></i>
          Productos del pedido
        </h3>

        {orderDetails && orderDetails.length > 0 ? (
          <DataTable 
            value={orderDetails} 
            stripedRows
            showGridlines
            responsiveLayout="scroll"
            emptyMessage="No hay productos en este pedido"
            style={{ fontSize: '0.95rem' }}
          >
            <Column 
              field="producto_nombre" 
              header="Producto" 
              style={{ fontWeight: '600' }}
              body={(rowData) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="pi pi-box" style={{ color: '#2e7d32' }}></i>
                  {rowData.producto_nombre}
                </div>
              )}
            />
            <Column 
              field="cantidad" 
              header="Cantidad" 
              body={cantidadBodyTemplate}
              style={{ textAlign: 'center', width: '120px' }}
            />
            <Column 
              field="precio_unitario" 
              header="Precio Unit." 
              body={priceBodyTemplate}
              style={{ textAlign: 'right', width: '120px' }}
            />
            <Column 
              header="Subtotal" 
              body={subtotalBodyTemplate}
              style={{ textAlign: 'right', width: '120px' }}
            />
            <Column 
              field="indicaciones" 
              header="Indicaciones especiales" 
              body={indicacionesBodyTemplate}
              style={{ minWidth: '200px' }}
            />
          </DataTable>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#999',
            background: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <i className="pi pi-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
            <p>No hay detalles disponibles para este pedido</p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default OrderDetailsModal;