import React, { useState } from 'react';
import './FormIngrediente.css';

const FormIngrediente = () => {
  const [name, setName] = useState('');
  const [unidad, setUnidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://upacafe.onrender.com/api/orders/addIngretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, unidad }),
      });

      if (!res.ok) throw new Error('Error al guardar el ingrediente');
      const data = await res.json();
      console.log(name);
      setMensaje(`Ingrediente "${name}" agregado correctamente ✅`);
      setName('');
      setUnidad('');
    } catch (err) {
      console.error(err);
      setMensaje('No se pudo guardar el ingrediente ❌');
    }
  };

  return (
    <div className="form-ing-container">
      <h2>➕ Agregar Ingrediente</h2>
      <form onSubmit={handleSubmit} className="form-ing">
        <div className="form-group">
          <label>Nombre del Ingrediente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej. Azúcar"
          />
        </div>

        <div className="form-group">
          <label>Unidad de medida</label>
          <input
            type="text"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            required
            placeholder="Ej. gramos, ml, piezas..."
          />
        </div>

        <button type="submit" className="btn-guardar">Guardar Ingrediente</button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </div>
  );
};

export default FormIngrediente;
