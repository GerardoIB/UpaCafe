import { useState } from 'react';
import './Register.css';
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    pkPhone: '',
    name: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthday: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor verifica tu contraseña.',
      });
      return;
    }

    if (!/^\d+$/.test(formData.pkPhone)) {
      Swal.fire({
        icon: 'error',
        title: 'Número inválido',
        text: 'El número de teléfono debe contener solo dígitos.',
      });
      return;
    }

    // Petición al backend
    const result = await fetch('http://localhost:3000/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (result.ok) {
      const resultData = await result.json();
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: `Usuario ${resultData.name} registrado correctamente.`,
      });

      // Limpia formulario
      setFormData({
        pkPhone: '',
        name: '',
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        password: '',
        confirmPassword: ''
      });
    } else {
      const resultData = await result.json();
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: resultData.message || 'Hubo un error al registrar el usuario.',
      });
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Crear Cuenta</h2>

        <div className="form-group">
          <label htmlFor="pkPhone">Teléfono</label>
          <input
            type="text"
            id="pkPhone"
            name="pkPhone"
            value={formData.pkPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">Primer Apellido</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Segundo Apellido</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Género</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tu género</option>
            <option value="m">Masculino</option>
            <option value="f">Femenino</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="register-button">Registrarse</button>

        <p className="back-login">
          ¿Ya tienes cuenta?{" "}
          <a className="register-button" href="/Login">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
