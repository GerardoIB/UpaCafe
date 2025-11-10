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
    name: "",
    price: 0,
    categoria: "",
    description: "",
    ingredientes: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const toast = React.useRef(null);

  useEffect(() => {
    // Simulación: cargar desde API
    const loadData = async () => {
      const resProd = await fetch("http://localhost:3000/api/orders/productos", { credentials: "include" });
      const resIng = await fetch("http://localhost:3000/api/orders/ingredientes", { credentials: "include" });
      const dataProd = await resProd.json();
      const dataIng = await resIng.json();
      setProductos(dataProd);
      setIngredientes(dataIng);
    };
    loadData();
  }, []);

  const openNew = () => {
    setProducto({
      name: "",
      price: 0,
      categoria: "",
      description: "",
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
    if (producto.name.trim()) {
      let _productos = [...productos];
      let _producto = { ...producto };

      if (editMode) {
        const index = _productos.findIndex((p) => p.id === producto.id);
        _productos[index] = _producto;
        toast.current.show({ severity: "success", summary: "Actualizado", detail: "Producto actualizado", life: 3000 });
      } else {
        const result = await fetch('http://localhost:3000/api/orders/createProduct',{
          method:'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(_producto)
        })
        if(result.ok){
        _producto.id = _productos.length + 1;
        _productos.push(_producto);
        console.log(_producto )
        toast.current.show({ severity: "success", summary: "Creado", detail: "Producto agregado", life: 3000 });
        }
      }

      setProductos(_productos);
      setProductoDialog(false);
      setProducto({
        name: "",
        price: 0,
        categoria: "",
        description: "",
        ingredientes: [],
      });
    }
  };

  const editProducto = (rowData) => {
    setProducto({ ...rowData });
    setEditMode(true);
    setProductoDialog(true);
  };

  const deleteProducto = async (rowData) => {
    setProductos(productos.filter((p) => p.id !== rowData.id));
    console.log(rowData)

    const result = await fetch(`http://localhost:3000/api/orders/delete/${rowData.id}`,{
        method:'DELETE',
        credentials:'include'
    })
    if(result.ok){
    toast.current.show({ severity: "warn", summary: "Eliminado", detail: "Producto eliminado", life: 3000 });
    }
  };

  const productoDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} className="p-button-text" />
      <Button label={editMode ? "Actualizar" : "Guardar"} icon="pi pi-check" onClick={saveProducto} autoFocus />
    </>
  );

  return (
    <div className="crud-productos-container">
      <Toast ref={toast} />
      <div className="header">
        <h2>📦 Gestión de Productos</h2>
        <Button label="Nuevo Producto" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={productos} paginator rows={5} responsiveLayout="scroll">
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column field="precio" header="Precio ($)" sortable></Column>
        <Column field="categoria" header="Categoría"></Column>
        <Column field="descripcion" header="Descripción"></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="acciones">
              <Button icon="pi pi-pencil" rounded outlined onClick={() => editProducto(rowData)} /> 
              <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteProducto(rowData)} /> 
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
          <label>Nombre</label>
          <InputText
            value={producto.name}
            onChange={(e) => setProducto({ ...producto, name: e.target.value })}
            required
            autoFocus
            className={submitted && !producto.name ? "p-invalid" : ""}
          />
        </div>

        <div className="form-field">
          <label>Precio</label>
          <InputNumber
            value={producto.price}
            onValueChange={(e) => setProducto({ ...producto, price: e.value })}
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
            value={producto.description}
            onChange={(e) => setProducto({ ...producto, description: e.target.value })}
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
