import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import "./CrudIngredientes.css";

const CrudIngredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteDialog, setIngredienteDialog] = useState(false);
  const [ingrediente, setIngrediente] = useState({ nombre: "" });
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/orders/ingredientes", {
          credentials: "include",
        });
        const data = await res.json();
        setIngredientes(data);
      } catch (e) {
        console.error("Error al cargar ingredientes:", e);
      }
    };
    loadData();
  }, []);

  const openNew = () => {
    setIngrediente({ nombre: "" });
    setSubmitted(false);
    setEditMode(false);
    setIngredienteDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setIngredienteDialog(false);
  };

  const saveIngrediente = async () => {
    setSubmitted(true);
    if (ingrediente.nombre.trim()) {
      let _ingredientes = [...ingredientes];
      let _ingrediente = { ...ingrediente };

      if (editMode) {
        // PUT (actualizar)
        const result = await fetch(`http://localhost:3000/api/orders/ingredientes/${_ingrediente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(_ingrediente),
        });
        
        const index = _ingredientes.findIndex((i) => i.id === _ingrediente.id);
        _ingredientes[index] = _ingrediente;
        toast.current.show({ severity: "success", summary: "Actualizado", detail: "Ingrediente actualizado", life: 3000 });
      } else {
        // POST (crear)
        const response = await fetch("http://localhost:3000/api/orders/ingredientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(_ingrediente),
        });
        const nuevo = await response.json();
        _ingredientes.push(nuevo);
        toast.current.show({ severity: "success", summary: "Creado", detail: "Ingrediente agregado", life: 3000 });
      }

      setIngredientes(_ingredientes);
      setIngredienteDialog(false);
      setIngrediente({ nombre: "" });
    }
  };

  const editIngrediente = (rowData) => {
    setIngrediente({ ...rowData });
    setEditMode(true);
    setIngredienteDialog(true);
  };

  const deleteIngrediente = async (rowData) => {
    const confirmDelete = window.confirm(`¿Eliminar el ingrediente "${rowData.nombre}"?`);
    if (!confirmDelete) return;

    try {
      const result = await fetch(`http://localhost:3000/api/orders/ingredientes/${rowData.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (result.ok) {
        setIngredientes(ingredientes.filter((i) => i.id !== rowData.id));
        toast.current.show({ severity: "warn", summary: "Eliminado", detail: "Ingrediente eliminado", life: 3000 });
      }
    } catch (e) {
      console.error(e);
      toast.current.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar", life: 3000 });
    }
  };

  const ingredienteDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} className="p-button-text" />
      <Button label={editMode ? "Actualizar" : "Guardar"} icon="pi pi-check" onClick={saveIngrediente} autoFocus />
    </>
  );

  return (
    <div className="crud-ingredientes-container">
      <Toast ref={toast} />
      <div className="header">
        <h2>🥬 Gestión de Ingredientes</h2>
        <Button label="Nuevo Ingrediente" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={ingredientes} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "10%" }} sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="acciones">
              <Button icon="pi pi-pencil" rounded outlined onClick={() => editIngrediente(rowData)} />
              <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteIngrediente(rowData)} />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        visible={ingredienteDialog}
        style={{ width: "350px" }}
        header={editMode ? "Editar Ingrediente" : "Nuevo Ingrediente"}
        modal
        footer={ingredienteDialogFooter}
        onHide={hideDialog}
      >
        <div className="form-field">
          <label>Nombre</label>
          <InputText
            value={ingrediente.nombre}
            onChange={(e) => setIngrediente({ ...ingrediente, nombre: e.target.value })}
            required
            autoFocus
            className={submitted && !ingrediente.nombre ? "p-invalid" : ""}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default CrudIngredientes;
