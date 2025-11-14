import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:3000/api/user/reset-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password })
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2>Restablecer contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={submit}>Guardar</button>
    </div>
  );
}
