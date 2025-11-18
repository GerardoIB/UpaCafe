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
import ResetPassword from './pages/ResetPassword';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // 🆕 Detectar si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 🆕 Escuchar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // En móvil, cerrar sidebar por defecto
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecutar al montar

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = (newState) => {
    setSidebarOpen(newState);
  };

  // 🆕 Función para alternar sidebar (hamburguesa)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 🆕 Cerrar sidebar en móvil al hacer clic en overlay
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        let res = await fetch('https://upacafe.onrender.com/api/user/protected', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!res.ok) {
          const token = localStorage.getItem('access_token');
          
          if (token) {
            res = await fetch('https://upacafe.onrender.com/api/user/protected', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }
        }
        
        if (!res.ok) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        
        const data = await res.json();
        setUser(data.user || data);
        setId(data.user?.id);
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
    // 1️⃣ Llamar al endpoint de logout
    const res = await fetch('https://upacafe.onrender.com/api/user/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (res.ok) {
      // 2️⃣ Limpiar localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user')
      
      // 3️⃣ Limpiar estado de la aplicación
      setIsAuthenticated(false);
      setUser(null);
      setId(null);
      
      // 4️⃣ Redirigir al login
      navigate('/');
    } else {
      // Si el servidor falla, igual hacer logout local
      throw new Error('Server logout failed');
    }
  } catch (error) {
    console.error('Error en logout:', error);
    
    // 🔥 IMPORTANTE: Siempre hacer logout local aunque falle el servidor
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
    setId(null);
    navigate('/');
  }
};

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: 'var(--verde-oscuro)'
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route 
          path="/" 
          element={
            <Login 
              onLoginSuccess={(user) => { 
                setUser(user); 
                setIsAuthenticated(true); 
              }} 
            />
          } 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/verificar" element={<VerificarCorreo />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const rol = user?.rol_id;

  return (
    <div className="app-layout">
      <Sidebar 
        onNavigate={(ruta) => {
          navigate(ruta);
          closeSidebar(); // 🆕 Cerrar sidebar en móvil al navegar
        }} 
        onLogout={handleLogout} 
        user={user} 
        onToggle={handleSidebarToggle}
        isOpen={sidebarOpen} // 🆕 Pasar estado
      />

      {/* 🆕 Overlay para cerrar sidebar en móvil */}
      {isMobile && sidebarOpen && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}

      <div className={`main-content ${!sidebarOpen ? 'collapsed' : ''}`}>
        <Header 
          user={user} 
          onLogout={handleLogout} 
          sidebarCollapsed={!sidebarOpen}
          onMenuToggle={toggleSidebar} // 🆕 Pasar función hamburguesa
          isMobile={isMobile} // 🆕 Pasar si es móvil
        />
        
        <div className="app-content">
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