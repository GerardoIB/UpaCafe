import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);
  const navigate = useNavigate();

  const submit = async () => {
    if (password.trim().length < 6) {
      toast.current.show({
        severity: "warn",
        summary: "Contraseña muy corta",
        detail: "Debe tener al menos 6 caracteres",
      });
      return;
    }

    setLoading(true);

    const res = await fetch("https://upacafe.onrender.com/api/user/reset-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.current.show({
        severity: "success",
        summary: "Contraseña actualizada",
        detail: "Serás redirigido al login",
        life: 2500,
      });

      // ⏳ Esperar 2.5s antes de enviar al login
      setTimeout(() => navigate("/login"), 2500);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: data.message,
      });
    }

    setLoading(false);
  };

  return (
    <div className="reset-wrapper">
      <Toast ref={toast} />

      <Card title="🔐 Restablecer contraseña" className="reset-card">
        <p>Ingresa tu nueva contraseña para continuar:</p>

        <div className="p-field">
          <label>Nueva contraseña</label>
          <span className="p-input-icon-left">
            <i className="pi pi-lock" />
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              placeholder="••••••••"
              style={{ width: "100%" }}
            />
          </span>
        </div>

        <Button
          label="Guardar"
          icon="pi pi-save"
          loading={loading}
          className="p-button-success"
          onClick={submit}
          style={{ marginTop: "1rem", width: "100%" }}
        />
      </Card>
    </div>
  );
}
