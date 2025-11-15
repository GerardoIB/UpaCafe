import React, { useState, useEffect } from "react";
import "./Home.css";
import CardProducto from "../components/CardProducto";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("https://upacafe.onrender.com/api/orders/productos", { credentials: "include" });
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    const checkUser = async () => {
      try {
        const res = await fetch("https://upacafe.onrender.com/api/user/protected", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user || data);
      } catch (e) {
        console.error("Error al verificar sesión:", e);
      }
    };

    checkUser();
    fetchProductos();
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenido a la Cafetería Universitaria ☕</h1>
      <p>Selecciona un producto para crear tu pedido rápido:</p>

      <div className="productos-grid">
        {productos.map((producto) => (
          <CardProducto key={producto.id} producto={producto} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Home;
