import { useState } from 'react';
import axios from 'axios';
import './AgregarTabajador.css';

const AgregarTrabajador = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [color, setColor] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/user/createWorker', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      setMensaje('✅ Trabajador agregado exitosamente.');
      setColor('green');
      setFormData({ name: '', email: '', phone: '', password: '' });
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al agregar trabajador.');
      setColor('red');
    }
  };

  return (
    <div className="agregar-trabajador-container">
      <form className="agregar-trabajador-form" onSubmit={handleSubmit}>
        <h2>Agregar Trabajador</h2>

        <label>Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Teléfono</label>
        <input
          type="tel"
          name="phone"
          placeholder="10 dígitos"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          placeholder="Contraseña segura"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Agregar</button>

        {mensaje && <p className="mensaje" style={{ color }}>{mensaje}</p>}
      </form>
    </div>
  );
};

export default AgregarTrabajador;
