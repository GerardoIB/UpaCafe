import React, { useEffect, useState } from 'react';
import './SelectIngredientes.css';

const SelectIngredientes = ({ value, onChange }) => {
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/orders/ingredientes', {
          credentials: 'include',
        });
        const data = await res.json();
        setIngredientes(data);
      } catch (err) {
        console.error('Error al obtener ingredientes:', err);
      }
    };

    fetchIngredientes();
  }, []);

  const handleSelect = (e) => {
    const id = parseInt(e.target.value);
    onChange(id || null);
  };

  return (
    <div className="select-ing-container">
      <label htmlFor="ingrediente">Selecciona Ingrediente</label>
      <select
        id="ingrediente"
        value={value || ''}
        onChange={handleSelect}
        className="select-ing"
      >
        <option value="">-- Selecciona --</option>
        {ingredientes.map((ing) => (
          <option key={ing.id} value={ing.id}>
            {ing.nombre} ({ing.unidad})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectIngredientes;
