import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import "./CrudProductos.css";

const CrudProductos = () => {
  const [productos, setProductos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [productoDialog, setProductoDialog] = useState(false);
  const [producto, setProducto] = useState({
    nombre: "",
    precio: 0,
    categoria: "",
    descripcion: "",
    ingredientes: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const toast = React.useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Obtener token de localStorage
      const token = localStorage.getItem('access_token');
      
      const resProd = await fetch("https://upacafe.onrender.com/api/orders/productos", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const resIng = await fetch("https://upacafe.onrender.com/api/orders/ingredientes", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (resProd.ok && resIng.ok) {
        const dataProd = await resProd.json();
        const dataIng = await resIng.json();
        
        console.log('Productos cargados:', dataProd); // Debug
        
        setProductos(dataProd);
        setIngredientes(dataIng);
      } else {
        toast.current?.show({ 
          severity: "error", 
          summary: "Error", 
          detail: "No se pudieron cargar los datos", 
          life: 3000 
        });
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.current?.show({ 
        severity: "error", 
        summary: "Error", 
        detail: "Error de conexión", 
        life: 3000 
      });
    }
  };

  const openNew = () => {
    setProducto({
      nombre: "",
      precio: 0,
      categoria: "",
      descripcion: "",
      ingredientes: [],
    });
    setSubmitted(false);
    setEditMode(false);
    setProductoDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductoDialog(false);
  };

  const saveProducto = async () => {
    setSubmitted(true);
    
    if (producto.nombre.trim()) {
      try {
        const token = localStorage.getItem('access_token');
        
        if (editMode) {
          // Actualizar producto existente
          const result = await fetch(`https://upacafe.onrender.com/api/orders/updateProduct/${producto.id}`, {
            method: 'PATCH',
            credentials:"include",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
          });
          
          if (result.ok) {
            toast.current.show({ 
              severity: "success", 
              summary: "Actualizado", 
              detail: "Producto actualizado", 
              life: 3000 
            });
            loadData(); // Recargar datos
          }
        } else {
          // Crear nuevo producto
          const result = await fetch('https://upacafe.onrender.com/api/orders/createProduct', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
          });
          
          if (result.ok) {
            toast.current.show({ 
              severity: "success", 
              summary: "Creado", 
              detail: "Producto agregado", 
              life: 3000 
            });
            loadData(); // Recargar datos
          }
        }
        
        setProductoDialog(false);
        setProducto({
          nombre: "",
          precio: 0,
          categoria: "",
          descripcion: "",
          ingredientes: [],
        });
      } catch (error) {
        console.error('Error guardando producto:', error);
        toast.current.show({ 
          severity: "error", 
          summary: "Error", 
          detail: "No se pudo guardar el producto", 
          life: 3000 
        });
      }
    }
  };

  const editProducto = (rowData) => {
    setProducto({ ...rowData });
    setEditMode(true);
    setProductoDialog(true);
  };

  const deleteProducto = async (rowData) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const result = await fetch(`https://upacafe.onrender.com/api/orders/delete/${rowData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (result.ok) {
        setProductos(productos.filter((p) => p.id !== rowData.id));
        toast.current.show({ 
          severity: "warn", 
          summary: "Eliminado", 
          detail: "Producto eliminado", 
          life: 3000 
        });
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      toast.current.show({ 
        severity: "error", 
        summary: "Error", 
        detail: "No se pudo eliminar el producto", 
        life: 3000 
      });
    }
  };

  const productoDialogFooter = (
    <>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        outlined 
        onClick={hideDialog} 
        className="p-button-text" 
      />
      <Button 
        label={editMode ? "Actualizar" : "Guardar"} 
        icon="pi pi-check" 
        onClick={saveProducto} 
        autoFocus 
      />
    </>
  );

  const priceBodyTemplate = (rowData) => {
    return `$${parseFloat(rowData.precio).toFixed(2)}`;
  };

  const disponibleBodyTemplate = (rowData) => {
    return rowData.disponible ? 
      <span className="badge badge-success">Disponible</span> : 
      <span className="badge badge-danger">No disponible</span>;
  };

  return (
    <div className="crud-productos-container">
      <Toast ref={toast} />
      <div className="header">
        <h2>📦 Gestión de Productos</h2>
        <Button label="Nuevo Producto" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable 
        value={productos} 
        paginator 
        rows={5} 
        responsiveLayout="scroll"
        emptyMessage="No hay productos disponibles"
      >
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column 
          field="precio" 
          header="Precio" 
          sortable 
          body={priceBodyTemplate}
        ></Column>
        <Column field="categoria" header="Categoría"></Column>
        <Column field="descripcion" header="Descripción"></Column>
        <Column 
          field="disponible" 
          header="Estado" 
          body={disponibleBodyTemplate}
        ></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="acciones">
              <Button 
                icon="pi pi-pencil" 
                rounded 
                outlined 
                onClick={() => editProducto(rowData)} 
              /> 
              <Button 
                icon="pi pi-trash" 
                rounded 
                outlined 
                severity="danger" 
                onClick={() => deleteProducto(rowData)} 
              /> 
            </div>
          )}
        />
      </DataTable>

      <Dialog
        visible={productoDialog}
        style={{ width: "450px" }}
        header={editMode ? "Editar Producto" : "Nuevo Producto"}
        modal
        footer={productoDialogFooter}
        onHide={hideDialog}
      >
        <div className="form-field">
          <label>Nombre *</label>
          <InputText
            value={producto.nombre}
            onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
            required
            autoFocus
            className={submitted && !producto.nombre ? "p-invalid" : ""}
          />
          {submitted && !producto.nombre && (
            <small className="p-error">El nombre es requerido.</small>
          )}
        </div>

        <div className="form-field">
          <label>Precio *</label>
          <InputNumber
            value={producto.precio}
            onValueChange={(e) => setProducto({ ...producto, precio: e.value })}
            mode="currency"
            currency="MXN"
            locale="es-MX"
          />
        </div>

        <div className="form-field">
          <label>Categoría</label>
          <Dropdown
            value={producto.categoria}
            options={[
              { label: "Bebida", value: "Bebida" },
              { label: "Comida", value: "Comida" },
              { label: "Postre", value: "Postre" },
            ]}
            onChange={(e) => setProducto({ ...producto, categoria: e.value })}
            placeholder="Selecciona categoría"
          />
        </div>

        <div className="form-field">
          <label>Descripción</label>
          <InputText
            value={producto.descripcion}
            onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label>Ingredientes</label>
          <MultiSelect
            value={producto.ingredientes}
            options={ingredientes.map((i) => ({ label: i.nombre, value: i.id }))}
            onChange={(e) => setProducto({ ...producto, ingredientes: e.value })}
            placeholder="Selecciona ingredientes"
            display="chip"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default CrudProductos;