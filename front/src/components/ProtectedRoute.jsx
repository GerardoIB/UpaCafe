import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, user, allowedRoles, children, onLogout }) {
  // Si no está logueado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si el rol del usuario no está permitido, cierra sesión
  if (!allowedRoles.includes(user?.rol_id)) {
    onLogout(); // cerrar sesión del backend
    return <Navigate to="/" replace />;
  }

  // Si todo bien, renderiza el contenido
  return children;
}

export default ProtectedRoute;
