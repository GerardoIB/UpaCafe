import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import Swal from "sweetalert2";
import "./login.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await fetch("https://upacafe.onrender.com/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await result.json();

      if (result.ok) {
        // Guardar token en localStorage
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        Swal.fire({
          icon: "success",
          title: "Login exitoso",
          text: `Bienvenido ${data.user.nombre}`,
          timer: 2000,
        });

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }

        // Redirección por rol
        const rol = data.user?.rol_id;
        if (rol === 1) window.location.href = "/admin";
        else if (rol === 2) window.location.href = "/trabajador";
        else window.location.href = "/home";

      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Credenciales incorrectas",
        });
      }

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    }

    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Campo vacío",
        detail: "Ingresa tu correo para recuperar la contraseña",
        life: 3000,
      });
      return;
    }

    const result = await fetch("https://upacafe.onrender.com/api/user/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: resetEmail }),
    });

    const data = await result.json();

    if (result.ok) {
      toast.current.show({
        severity: "info",
        summary: "Correo enviado",
        detail: `Se enviará un enlace a ${resetEmail}`,
        life: 4000,
      });
      setShowReset(false);
      setResetEmail("");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: data.message,
        life: 4000,
      });
    }
  };

  return (
    <div className="login-wrapper">
      <Toast ref={toast} />

      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">☕ Iniciar Sesión</h2>

        <div className="p-field">
          <label htmlFor="email">Correo</label>
          <span className="p-input-icon-left input-icon-wrapper">
            <i className="pi pi-envelope" />
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </span>
        </div>

        <div className="p-field">
          <label htmlFor="password">Contraseña</label>
          <span className="p-input-icon-left input-icon-wrapper">
            <i className="pi pi-lock" />
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              required
              placeholder="••••••••"
            />
          </span>
        </div>

        <Button
          label="Ingresar"
          icon="pi pi-sign-in"
          loading={loading}
          type="submit"
          className="p-button-success p-mt-3"
        />

        <div className="extra-links">
          <button
            type="button"
            className="forgot-password-btn"
            onClick={() => setShowReset(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
          <a href="/Register" className="register-link">
            Crear cuenta
          </a>
        </div>
      </form>

      <Dialog
        header="Recuperar contraseña"
        visible={showReset}
        style={{ width: "30rem" }}
        modal
        onHide={() => setShowReset(false)}
      >
        <p>Introduce el correo asociado a tu cuenta:</p>
        <InputText
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          style={{ width: "100%" }}
        />
        <Button
          label="Enviar enlace"
          icon="pi pi-send"
          className="p-button-success p-mt-3"
          onClick={handlePasswordReset}
        />
      </Dialog>
    </div>
  );
};

export default Login;
