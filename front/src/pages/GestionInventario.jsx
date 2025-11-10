import React, { useState, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import CrudProductos from "../components/CrudProductos";
import CrudIngredientes from "../components/CrudIngredientes";
import "./GestionInventario.css";

const GestionInventario = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef(null);

  return (
   <div className="app-content gestion-inventario-wrapper">
  <Toast ref={toast} />

  {/* Título de sección */}
  <h2 className="titulo-principal">📦 Panel de Gestión del Inventario</h2>

  <TabView
    activeIndex={activeIndex}
    onTabChange={(e) => setActiveIndex(e.index)}
    className="tabview-inventario"
  >
    <TabPanel header="Productos">
      <CrudProductos />
    </TabPanel>

    <TabPanel header="Ingredientes">
      <CrudIngredientes />
    </TabPanel>
  </TabView>
</div>
  )
};

export default GestionInventario;
