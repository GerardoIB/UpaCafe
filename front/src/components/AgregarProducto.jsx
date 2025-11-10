import React, { useState, useEffect } from 'react';
import SelectIngredientes from './SelectIngredientes';
import FormIngrediente from './FormIngredientes';
import './AgregarProducto.css';

const AgregarProducto = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoria, setCategoria] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientes, setIngredientes] = useState([null]);
  const [disponible, setDisponible] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const agregarIngrediente = () => setIngredientes([...ingredientes, null]);
  const eliminarIngrediente = (index) => setIngredientes(ingredientes.filter((_, i) => i !== index));

  const handleIngredienteChange = (index, value) => {
    const nuevos = [...ingredientes];
    nuevos[index] = value;
    setIngredientes(nuevos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    const producto = {
      name,
      price: parseFloat(price),
      categoria,
      description,
      disponible,
      ingredientes: ingredientes.filter(Boolean) // elimina nulos
    };

    try {
      const res = await fetch('http://localhost:3000/api/orders/createProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(producto),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMensaje('✅ Producto agregado con éxito');
      setName(''); setPrice(''); setCategoria(''); setDescription('');
      setIngredientes([null]);
    } catch (err) {
      setMensaje('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agregar-producto-container">
      <h1>🍽️ Agregar Producto</h1>
      <form onSubmit={handleSubmit} className="form-producto">

        <div className="form-group">
          <label>Nombre del producto</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Precio ($)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="ingredientes-section">
          <h3>🥬 Ingredientes</h3>
          {ingredientes.map((ingrediente, i) => (
            <div key={i} className="ingrediente-item">
              <SelectIngredientes
                value={ingrediente}
                onChange={(value) => handleIngredienteChange(i, value)}
              />
              {ingredientes.length > 1 && (
                <button type="button" className="btn-eliminar" onClick={() => eliminarIngrediente(i)}>❌</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-agregar" onClick={agregarIngrediente}>➕ Agregar ingrediente</button>
        </div>

        <button type="submit" className="btn-guardar" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar producto'}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <FormIngrediente />
    </div>
  );
};

export default AgregarProducto;
