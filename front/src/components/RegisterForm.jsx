import { useState } from 'react';
import './Register.css';
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor verifica tu contraseña.',
      });
      return;
    }

    // Validación de contraseña mínima
    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor ingresa un email válido.',
      });
      return;
    }

    // Validación de teléfono (7-15 dígitos)
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'El teléfono debe tener entre 7 y 15 dígitos.',
      });
      return;
    }

    try {
      // Preparar datos según tu API (solo email, password, name, phone)
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      };

      const result = await fetch('https://upacafe.onrender.com/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resultData = await result.json();

      if (result.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: `Usuario registrado. Revisa tu correo (${formData.email}) para verificar tu cuenta.`,
        });

        // Limpia formulario
        setFormData({
          email: '',
          name: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });

        // Opcional: redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = '/Login';
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: resultData.message || 'Hubo un error al registrar el usuario.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      });
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Crear Cuenta</h2>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Nombre Completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan Pérez García"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+52123456789"
            required
          />
          <small style={{ color: '#666', fontSize: '0.85em' }}>
            Entre 7 y 15 dígitos (puede incluir +)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <button type="submit" className="register-button">
          Registrarse
        </button>

        <p className="back-login">
          ¿Ya tienes cuenta?{" "}
          <a className="register-link" href="/Login">
            Iniciar sesión
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;