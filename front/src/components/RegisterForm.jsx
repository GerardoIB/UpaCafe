import { useState } from "react";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Por favor verifica tu contraseña.",
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Contraseña muy corta",
        text: "Debe tener mínimo 6 caracteres.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Ingresa un email válido.",
      });
      return;
    }

    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
        text: "Debe tener entre 7 y 15 dígitos.",
      });
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      };

      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const resultData = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: `Revisa tu correo (${formData.email}) para verificar tu cuenta.`,
        });

        setFormData({
          email: "",
          name: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          window.location.href = "/Login";
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: resultData.message || "Hubo un error al registrar el usuario.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
      });
    }
  };

  return (
    <div className="register-wrapper">
      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="register-title">📝 Crear Cuenta</h2>

        {/* EMAIL */}
        <div className="input-group">
          <label>Email *</label>
          <span className="p-input-icon-left">
            <i className="pi pi-envelope" />
            <InputText
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </span>
        </div>

        {/* NAME */}
        <div className="input-group">
          <label>Nombre Completo *</label>
          <span className="p-input-icon-left">
            <i className="pi pi-user" />
            <InputText
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
            />
          </span>
        </div>

        {/* PHONE */}
        <div className="input-group">
          <label>Teléfono *</label>
          <span className="p-input-icon-left">
            <i className="pi pi-phone" />
            <InputText
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+521234567890"
              required
            />
          </span>
          <small className="helper-text">Entre 7 y 15 dígitos</small>
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <label>Contraseña *</label>
          <Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            toggleMask
            feedback={false}
            required
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="input-group">
          <label>Confirmar Contraseña *</label>
          <Password
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            toggleMask
            feedback={false}
            required
          />
        </div>

        {/* SUBMIT */}
        <Button
          label="Registrarse"
          icon="pi pi-user-plus"
          className="p-button-success register-btn"
          type="submit"
        />

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/Login">Iniciar sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
