import React, { useEffect, useState } from 'react';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔹 Cargar usuarios
  useEffect(() => {
    fetch('https://upacafe.onrender.com/api/user/getAdmins', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => console.error('Error cargando usuarios:', err));
  }, []);

  // 🔹 Validaciones
  const validate = (user) => {
    const newErrors = {};
    if (!user.nombre?.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!user.email?.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
      newErrors.email = 'Correo inválido';
    }
    if (!user.phone?.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(user.phone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }
    if (!user.rol) newErrors.rol = 'Selecciona un rol';
    return newErrors;
  };

  // 🔹 Abrir modal
  const handleUpdate = (user) => {
    setSelectedUser({ ...user });
    setErrors({});
    setShowModal(true);
  };

  // 🔹 Guardar cambios
  const handleSave = async () => {
    const validationErrors = validate(selectedUser);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return; // 🚫 No enviar si hay errores

    try {
      const res = await fetch(`https://upacafe.onrender.com/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedUser),
      });

      if (!res.ok) throw new Error('Error al actualizar el usuario');

      setUsers(users.map(u => (u.id === selectedUser.id ? selectedUser : u)));
      setShowModal(false);
      alert('✅ Usuario actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('❌ No se pudo actualizar el usuario');
    }
  };

  // 🔹 Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      const res = await fetch(`https://upacafe.onrender.com/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert('Error eliminando el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-users-container">
      <h1>👨‍💼 Gestión de Empleados y Administradores</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <span className={`badge ${user.rol_id === 1 ? 'badge-admin' : 'badge-worker'}`}>
                  {user.rol_id === 1 ? 'administrador' : 'trabajador'}
                </span>
              </td>
              <td>
                <button className="btn-update" onClick={() => handleUpdate(user)}>
                  ✏️ Editar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" className="no-data">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Modal de edición con validaciones */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Usuario</h2>

            <label>Nombre:</label>
            <input
              type="text"
              value={selectedUser.nombre}
              onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}

            <label>Email:</label>
            <input
              type="email"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <label>Teléfono:</label>
            <input
              type="text"
              value={selectedUser.phone}
              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}

            <label>Rol:</label>
            <select
              value={selectedUser.rol}
              onChange={(e) => setSelectedUser({ ...selectedUser, rol: e.target.value })}
            >
              <option value="">Selecciona un rol</option>
              <option value="administrador">Administrador</option>
              <option value="trabajador">Trabajador</option>
            </select>
            {errors.rol && <span className="error-text">{errors.rol}</span>}

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleSave}>💾 Guardar</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
