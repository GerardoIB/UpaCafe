import React, { useState, useEffect } from "react";
import { FaCoffee, FaUtensils, FaPlus, FaStickyNote, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./CrearPedido.css";

const CrearPedido = () => {
  const [productos, setProductos] = useState([
    { producto_id: "", cantidad: 1, indicaciones: "", ingredientes_personalizados: [], ingredientesDisponibles: [] },
  ]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🚀 Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/orders/productos", { credentials: "include" });
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // 🚀 Verificar usuario autenticado
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/protected", {
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

  // ---- Handlers ----
  const handleProductoChange = async (index, value) => {
    const nuevos = [...productos];
    nuevos[index].producto_id = Number(value);
    nuevos[index].ingredientes_personalizados = [];
    nuevos[index].ingredientesDisponibles = [];

    if (value) {
      try {
        // 🔥 Obtener ingredientes específicos del producto
        const res = await fetch(`http://localhost:3000/api/orders/productos/${value}/ingredientes`, {
          credentials: "include",
        });
        const data = await res.json();
        nuevos[index].ingredientesDisponibles = data;
      } catch (err) {
        console.error("Error al obtener ingredientes:", err);
        Swal.fire("Error", "No se pudieron cargar los ingredientes del producto", "error");
      }
    }

    setProductos(nuevos);
  };

  const handleCantidadChange = (index, value) => {
    const nuevos = [...productos];
    nuevos[index].cantidad = Number(value);
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
      { producto_id: "", cantidad: 1, indicaciones: "", ingredientes_personalizados: [], ingredientesDisponibles: [] },
    ]);
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productos.some((p) => !p.producto_id)) {
      Swal.fire("Error", "Todos los productos deben tener selección.", "error");
      return;
    }

    const pedido = { clientId, productos };

    const resumen = productos
      .map((p) => {
        const prod = menu.find((m) => m.id === p.producto_id);
        const quitados = p.ingredientes_personalizados
          .map((i) =>
            p.ingredientesDisponibles.find((ing) => ing.id === i.ingrediente_id)?.nombre
          )
          .join(", ");
        return `
          <b>${prod?.nombre || "Producto"}</b> (x${p.cantidad})<br/>
          <em>Indicaciones:</em> ${p.indicaciones || "Ninguna"}<br/>
          <em>Sin:</em> ${quitados || "Ninguno"}<br/><br/>
        `;
      })
      .join("");

    const result = await Swal.fire({
      title: "Confirmar pedido",
      html: resumen,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2e7d32",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("http://localhost:3000/api/orders/createPedido", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(pedido),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        Swal.fire("✅ Pedido registrado", "Tu pedido fue enviado correctamente.", "success");
        setProductos([
          { producto_id: "", cantidad: 1, indicaciones: "", ingredientes_personalizados: [], ingredientesDisponibles: [] },
        ]);
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="crear-pedido-container">
      <h2>
        <FaCoffee /> Crear Pedido
      </h2>
      <form onSubmit={handleSubmit} className="pedido-form">
        {productos.map((producto, index) => {
          const seleccionado = menu.find((m) => m.id === producto.producto_id);
          return (
            <div key={index} className="producto-item">
              <h3>
                Producto #{index + 1}{" "}
                {productos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarProducto(index)}
                    className="btn-delete"
                  >
                    <FaTrash />
                  </button>
                )}
              </h3>

              <div className="input-icon">
                <FaUtensils />
                <select
                  value={producto.producto_id}
                  onChange={(e) => handleProductoChange(index, e.target.value)}
                  required
                >
                  <option value="">-- Selecciona un producto --</option>
                  {menu.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <label>Cantidad:</label>
              <div className="input-icon">
                <FaPlus />
                <input
                  type="number"
                  min="1"
                  value={producto.cantidad}
                  onChange={(e) => handleCantidadChange(index, e.target.value)}
                />
              </div>

              {producto.ingredientesDisponibles.length > 0 && (
                <div className="ingredientes-section">
                  <label>Ingredientes (marca los que deseas quitar):</label>
                  <div className="ingredientes-list">
                    {producto.ingredientesDisponibles.map((ing) => (
                      <div key={ing.id} className="ingrediente-item">
                        <input
                          type="checkbox"
                          checked={producto.ingredientes_personalizados.some(
                            (i) => i.ingrediente_id === ing.id
                          )}
                          onChange={() => handleIngredienteToggle(index, ing.id)}
                        />
                        <span>{ing.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label>Indicaciones especiales:</label>
              <div className="input-icon">
                <FaStickyNote />
                <textarea
                  placeholder="Ej: sin azúcar, leche de avena..."
                  value={producto.indicaciones}
                  onChange={(e) => handleIndicacionesChange(index, e.target.value)}
                />
              </div>

              <hr />
            </div>
          );
        })}

        <button type="button" className="btn-add" onClick={agregarProducto}>
          <FaPlus /> Agregar otro producto
        </button>

        <button type="submit" className="btn-submit">
          <FaCoffee /> Confirmar Pedido
        </button>
      </form>
    </div>
  );
};

export default CrearPedido;
