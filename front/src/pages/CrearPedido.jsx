import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Chip } from "primereact/chip";
import { Skeleton } from "primereact/skeleton";
import "./CrearPedido.css";

const CrearPedido = () => {
  const [productos, setProductos] = useState([
    {
      producto_id: null,
      cantidad: 1,
      indicaciones: "",
      ingredientes_personalizados: [],
      ingredientesDisponibles: [],
    },
  ]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef(null);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("https://upacafe.onrender.com/api/orders/productos", {
          credentials: "include",
        });
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los productos",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Verificar usuario
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("https://upacafe.onrender.com/api/user/protected", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user || data);
      } catch (e) {
        console.error("Error al verificar sesión:", e);
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const clientId = user ? user.id : null;

  // Handlers
  const handleProductoChange = async (index, value) => {
    const nuevos = [...productos];
    nuevos[index].producto_id = value;
    nuevos[index].ingredientes_personalizados = [];
    nuevos[index].ingredientesDisponibles = [];

    if (value) {
      try {
        const res = await fetch(
          `https://upacafe.onrender.com/api/orders/productos/${value}/ingredientes`,
          { credentials: "include" }
        );
        const data = await res.json();
        nuevos[index].ingredientesDisponibles = data;
      } catch (err) {
        console.error("Error al obtener ingredientes:", err);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los ingredientes",
          life: 3000,
        });
      }
    }

    setProductos(nuevos);
  };

  const handleCantidadChange = (index, value) => {
    const nuevos = [...productos];
    nuevos[index].cantidad = value;
    setProductos(nuevos);
  };

  const handleIndicacionesChange = (index, value) => {
    const nuevos = [...productos];
    nuevos[index].indicaciones = value;
    setProductos(nuevos);
  };

  const handleIngredienteToggle = (index, ingredienteId) => {
    const nuevos = [...productos];
    const lista = nuevos[index].ingredientes_personalizados;
    const existe = lista.find((i) => i.ingrediente_id === ingredienteId);

    if (existe) {
      nuevos[index].ingredientes_personalizados = lista.filter(
        (i) => i.ingrediente_id !== ingredienteId
      );
    } else {
      nuevos[index].ingredientes_personalizados.push({
        ingrediente_id: ingredienteId,
        accion: "quitado",
      });
    }
    setProductos(nuevos);
  };

  const agregarProducto = () => {
    setProductos([
      ...productos,
      {
        producto_id: null,
        cantidad: 1,
        indicaciones: "",
        ingredientes_personalizados: [],
        ingredientesDisponibles: [],
      },
    ]);
  };

  const eliminarProducto = (index) => {
    if (productos.length === 1) {
      toast.current.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe haber al menos un producto",
        life: 3000,
      });
      return;
    }
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (productos.some((p) => !p.producto_id)) {
      toast.current.show({
        severity: "warn",
        summary: "Campos incompletos",
        detail: "Todos los productos deben estar seleccionados",
        life: 3000,
      });
      return;
    }

    // Preparar resumen
    const resumenHTML = productos
      .map((p, idx) => {
        const prod = menu.find((m) => m.id === p.producto_id);
        const quitados = p.ingredientes_personalizados
          .map((i) =>
            p.ingredientesDisponibles.find((ing) => ing.id === i.ingrediente_id)?.nombre
          )
          .filter(Boolean)
          .join(", ");

        return `
          <div style="text-align: left; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 8px;">
            <strong style="color: #2e7d32; font-size: 1.1em;">${idx + 1}. ${prod?.nombre || "Producto"}</strong>
            <br/>
            <span style="color: #666;">Cantidad: <strong>${p.cantidad}</strong></span>
            ${p.indicaciones ? `<br/><span style="color: #666;">Indicaciones: ${p.indicaciones}</span>` : ""}
            ${quitados ? `<br/><span style="color: #d32f2f;">Sin: ${quitados}</span>` : ""}
          </div>
        `;
      })
      .join("");

    confirmDialog({
      message: (
        <div>
          <p style="margin-bottom: 15px; font-size: 1.1em;">¿Confirmas tu pedido?</p>
          <div dangerouslySetInnerHTML={{ __html: resumenHTML }} />
        </div>
      ),
      header: "Confirmar Pedido",
      icon: "pi pi-shopping-cart",
      acceptLabel: "Sí, confirmar",
      rejectLabel: "Cancelar",
      accept: enviarPedido,
    });
  };

  const enviarPedido = async () => {
    setSubmitting(true);
    const pedido = { clientId, productos };

    try {
      const res = await fetch("https://upacafe.onrender.com/api/orders/createPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pedido),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.current.show({
        severity: "success",
        summary: "¡Pedido registrado!",
        detail: "Tu pedido fue enviado correctamente",
        life: 4000,
      });

      // Resetear formulario
      setProductos([
        {
          producto_id: null,
          cantidad: 1,
          indicaciones: "",
          ingredientes_personalizados: [],
          ingredientesDisponibles: [],
        },
      ]);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
        life: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Template para producto en dropdown
  const productoOptionTemplate = (option) => {
    return (
      <div className="producto-option">
        <span className="producto-icon">☕</span>
        <div>
          <div className="producto-nombre">{option.nombre}</div>
          <div className="producto-precio">${parseFloat(option.precio).toFixed(2)}</div>
        </div>
      </div>
    );
  };

  const selectedProductoTemplate = (option, props) => {
    if (option) {
      return productoOptionTemplate(option);
    }
    return <span>{props.placeholder}</span>;
  };

  if (loading) {
    return (
      <div className="crear-pedido-container-prime">
        <Card className="pedido-card">
          <Skeleton width="200px" height="40px" className="mb-4" />
          <Skeleton width="100%" height="400px" />
        </Card>
      </div>
    );
  }

  return (
    <div className="crear-pedido-container-prime">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="page-header-pedido">
        <h1>
          <i className="pi pi-shopping-cart"></i>
          Crear Nuevo Pedido
        </h1>
        <p className="subtitle">Selecciona tus productos y personaliza tu pedido</p>
      </div>

      <form onSubmit={handleSubmit}>
        {productos.map((producto, index) => {
          const productoSeleccionado = menu.find((m) => m.id === producto.producto_id);

          return (
            <Card key={index} className="producto-card">
              <div className="producto-header">
                <h3>
                  <i className="pi pi-tag"></i>
                  Producto #{index + 1}
                </h3>
                {productos.length > 1 && (
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    onClick={() => eliminarProducto(index)}
                    tooltip="Eliminar producto"
                  />
                )}
              </div>

              <Divider />

              {/* Selección de producto */}
              <div className="field-section">
                <label className="field-label">
                  <i className="pi pi-shopping-bag"></i>
                  Producto *
                </label>
                <Dropdown
                  value={producto.producto_id}
                  options={menu}
                  onChange={(e) => handleProductoChange(index, e.value)}
                  optionLabel="nombre"
                  optionValue="id"
                  placeholder="Selecciona un producto"
                  filter
                  className="w-full"
                  itemTemplate={productoOptionTemplate}
                  valueTemplate={selectedProductoTemplate}
                />
              </div>

              {/* Cantidad */}
              <div className="field-section">
                <label className="field-label">
                  <i className="pi pi-plus-circle"></i>
                  Cantidad
                </label>
                <InputNumber
                  value={producto.cantidad}
                  onValueChange={(e) => handleCantidadChange(index, e.value)}
                  showButtons
                  min={1}
                  max={10}
                  className="w-full"
                />
              </div>

              {/* Precio estimado */}
              {productoSeleccionado && (
                <div className="precio-estimado">
                  <Tag
                    value={`Precio: $${(
                      parseFloat(productoSeleccionado.precio) * producto.cantidad
                    ).toFixed(2)}`}
                    severity="success"
                    icon="pi pi-dollar"
                  />
                </div>
              )}

              {/* Ingredientes */}
              {producto.ingredientesDisponibles.length > 0 && (
                <div className="field-section ingredientes-section-prime">
                  <label className="field-label">
                    <i className="pi pi-list"></i>
                    Personalizar ingredientes
                  </label>
                  <div className="ingredientes-grid">
                    {producto.ingredientesDisponibles.map((ing) => {
                      const isChecked = producto.ingredientes_personalizados.some(
                        (i) => i.ingrediente_id === ing.id
                      );
                      return (
                        <div key={ing.id} className="ingrediente-checkbox">
                          <Checkbox
                            inputId={`ing-${index}-${ing.id}`}
                            checked={isChecked}
                            onChange={() => handleIngredienteToggle(index, ing.id)}
                          />
                          <label
                            htmlFor={`ing-${index}-${ing.id}`}
                            className={isChecked ? "ingrediente-quitado" : ""}
                          >
                            {ing.nombre}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <small className="ingredientes-hint">
                    <i className="pi pi-info-circle"></i>
                    Marca los ingredientes que deseas quitar
                  </small>
                </div>
              )}

              {/* Indicaciones */}
              <div className="field-section">
                <label className="field-label">
                  <i className="pi pi-comment"></i>
                  Indicaciones especiales
                </label>
                <InputTextarea
                  value={producto.indicaciones}
                  onChange={(e) => handleIndicacionesChange(index, e.target.value)}
                  rows={3}
                  placeholder="Ej: sin azúcar, leche de avena, extra caliente..."
                  className="w-full"
                  autoResize
                />
              </div>

              {/* Resumen del producto */}
              {producto.ingredientes_personalizados.length > 0 && (
                <div className="producto-resumen">
                  <small>
                    <strong>Sin:</strong>{" "}
                    {producto.ingredientes_personalizados
                      .map((i) =>
                        producto.ingredientesDisponibles.find(
                          (ing) => ing.id === i.ingrediente_id
                        )?.nombre
                      )
                      .filter(Boolean)
                      .map((nombre, idx) => (
                        <Chip key={idx} label={nombre} className="mr-2 mb-1" />
                      ))}
                  </small>
                </div>
              )}
            </Card>
          );
        })}

        {/* Botones de acción */}
        <div className="actions-container">
          <Button
            type="button"
            label="Agregar otro producto"
            icon="pi pi-plus"
            onClick={agregarProducto}
            className="p-button-outlined p-button-success"
          />

          <Button
            type="submit"
            label={submitting ? "Enviando..." : "Confirmar Pedido"}
            icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
            loading={submitting}
            className="p-button-success"
          />
        </div>
      </form>
    </div>
  );
};

export default CrearPedido;