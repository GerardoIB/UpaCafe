import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/LoginForm';
import Register from './components/RegisterForm';
import VerificarCorreo from './pages/VerificarCorreo';
import Home from './pages/Home';
import CrearPedido from './pages/CrearPedido';
import Tickets from './pages/Tickets';
import MisPedidos from './pages/MisPedidos';
import DashboardHome from './pages/AdminPanel';
import TrabajadorDashboard from './pages/TrabajadorDashboard';
import AdminUsers from './pages/AdminUsers';
import AgregarTrabajador from './pages/AgregarTabajador';
import AdminOrders from './pages/AdminOrdes';
import AgregarProducto from './components/AgregarProducto';
import GestionInventario from './pages/GestionInventario';
import UsersTable from './components/UsersTable';
import './index.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // 👉 Estado del sidebar
  const navigate = useNavigate();
    const handleSidebarToggle = (newState) => {
    setSidebarOpen(newState);
  };
  useEffect(() => {
    
    const checkUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/user/protected', {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        const data = await res.json();
        setUser(data.user || data);
        setId(data.user.id);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error al verificar sesión:', e);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/user/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={(user) => { setUser(user); setIsAuthenticated(true); }} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verificar" element={<VerificarCorreo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  const rol = user?.rol_id

  return (
    <div className="app-layout">
      {/* Pasamos onToggle y estado al Sidebar */}
      <Sidebar 
        onNavigate={(ruta) => navigate(ruta)} 
        onLogout={handleLogout} 
        user={user} 
        onToggle={handleSidebarToggle} 
      />

      {/* Header recibe el estado del sidebar */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        sidebarCollapsed={!sidebarOpen} 
      />
        
      
      {/* Contenido principal ajustable */}
      <div className={`main-content ${!sidebarOpen ? 'collapsed' : ''}`}>
          <Routes>
            {rol === 1 && (
              <>
                <Route path="/agregarProducto" element={<AgregarProducto />} />
                <Route path="/admin" element={<DashboardHome />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/manage-users" element={<AdminUsers />} />
                <Route path="/add-employee" element={<AgregarTrabajador />} />
                <Route path="/inventario" element={<GestionInventario />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </>
            )}
            {rol === 2 && (
              <>
                <Route path="/trabajador" element={<TrabajadorDashboard user={user} />} />
                <Route path="/addPedido" element={<CrearPedido />} />
                <Route path="*" element={<Navigate to="/trabajador" />} />
              </>
            )}
            {rol === 3 && (
              <>
                <Route path="/exam" element={<UsersTable users={users} />} />
                <Route path="/home" element={<Home user={user} />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/crear-pedido" element={<CrearPedido />} />
                <Route path="/MisPedidos" element={<MisPedidos user={id} />} />
                <Route path="*" element={<Navigate to="/home" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
  
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
