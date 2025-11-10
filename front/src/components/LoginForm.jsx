import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "./login.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const toast = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!result.ok) throw new Error("Error en autenticación");

      const data = await result.json();
      const res = await fetch("http://localhost:3000/api/user/protected", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        toast.current.show({
          severity: "success",
          summary: "Inicio de sesión correcto",
          life: 3000,
        });
        onLoginSuccess(userData.user || userData);
      } else {
        throw new Error("No se pudo validar la sesión");
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Correo o contraseña incorrectos",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
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
    // Aquí puedes hacer la llamada a tu API
    toast.current.show({
      severity: "info",
      summary: "Correo enviado",
      detail: `Se enviará un enlace a ${resetEmail}`,
      life: 4000,
    });
    setShowReset(false);
    setEmail("");
  };

  return (
    <div className="login-wrapper">
      <Toast ref={toast} />

      <form onSubmit={handleSubmit} className="login-card">
        <h2>☕ Iniciar Sesión</h2>

        <div className="p-field">
          <label htmlFor="email">Correo</label>
          <span className="p-input-icon-left">
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
          <span className="p-input-icon-left">
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
          <Button
            label="¿Olvidaste tu contraseña?"
            className="p-button-text p-button-sm"
            onClick={() => setShowReset(true)}
          />
          <a href="/Register" className="register-link">
            Crear cuenta
          </a>
        </div>
      </form>

      {/* 🔹 Modal de recuperación */}
      <Dialog
        header="Recuperar contraseña"
        visible={showReset}
        style={{ width: "25rem" }}
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
