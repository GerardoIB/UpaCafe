import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Skeleton } from 'primereact/skeleton';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState(null);
  const toast = useRef(null);

  // Opciones para el filtro de roles
  const roleOptions = [
    { label: 'Todos', value: null },
    { label: 'Administradores', value: 1 },
    { label: 'Trabajadores', value: 2 }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    fetch('https://upacafe.onrender.com/api/user/getAdmins', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando usuarios:', err);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios',
          life: 3000
        });
        setLoading(false);
      });
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === null || user.rol_id === roleFilter;
    return matchesRole;
  });

  // Abrir modal de edición
  const openEditDialog = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

  // Guardar cambios
  const saveUser = async () => {
    if (!selectedUser.nombre?.trim() || !selectedUser.email?.trim() || !selectedUser.phone?.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor completa todos los campos',
        life: 3000
      });
      return;
    }

    try {
      const res = await fetch(`https://upacafe.onrender.com/api/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(selectedUser),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      setUsers(users.map(u => (u.id === selectedUser.id ? selectedUser : u)));
      setShowModal(false);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente',
        life: 3000
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el usuario',
        life: 3000
      });
    }
  };

  // Confirmar eliminación
  const confirmDelete = (user) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar a ${user.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => deleteUser(user.id)
    });
  };

  // Eliminar usuario
  const deleteAdmin = async (id) => {
    try {
      const res = await fetch(`https://upacafe.onrender.com/api/user//${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        toast.current.show({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Usuario eliminado correctamente',
          life: 3000
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el usuario',
        life: 3000
      });
    }
  };
   const deleteUser = async (id) => {
    try {
      const res = await fetch(`https://upacafe.onrender.com/api/user/removeWorker/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        toast.current.show({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Usuario eliminado correctamente',
          life: 3000
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el usuario',
        life: 3000
      });
    }
  };

  // Templates para las columnas

  const userBodyTemplate = (rowData) => {
    return (
      <div className="user-cell">
        <Avatar 
          label={rowData.nombre.charAt(0).toUpperCase()} 
          className="user-avatar-table"
          style={{ 
            backgroundColor: rowData.rol_id === 1 ? '#4caf50' : '#ff9800',
            color: 'white'
          }}
          shape="circle" 
        />
        <div className="user-cell-info">
          <span className="user-cell-name">{rowData.nombre}</span>
          <span className="user-cell-id">ID: {rowData.id}</span>
        </div>
      </div>
    );
  };

  const contactBodyTemplate = (rowData) => {
    return (
      <div className="contact-cell">
        <div className="contact-item">
          <i className="pi pi-envelope"></i>
          <span>{rowData.email}</span>
        </div>
        <div className="contact-item">
          <i className="pi pi-phone"></i>
          <span>{rowData.phone}</span>
        </div>
      </div>
    );
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.rol_id === 1 ? 'Administrador' : 'Trabajador'}
        severity={rowData.rol_id === 1 ? 'success' : 'warning'}
        icon={rowData.rol_id === 1 ? 'pi pi-shield' : 'pi pi-user'}
      />
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="action-buttons-table">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="p-button-info"
          onClick={() => openEditDialog(rowData)}
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Eliminar"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  // Header de la tabla
  const header = (
    <div className="table-header">
      <div className="header-left">
        <h2>👨‍💼 Gestión de Usuarios</h2>
      </div>
      <div className="header-right">
        <span className="p-input-icon-left search-input">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar usuarios..."
          />
        </span>
        <Dropdown
          value={roleFilter}
          options={roleOptions}
          onChange={(e) => setRoleFilter(e.value)}
          placeholder="Filtrar por rol"
          className="role-filter-dropdown"
        />
        <Button
          icon="pi pi-refresh"
          rounded
          outlined
          onClick={loadUsers}
          tooltip="Actualizar"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    </div>
  );

  // Footer del modal
  const dialogFooter = (
    <div className="modal-footer-buttons">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={() => setShowModal(false)}
        className="p-button-secondary"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={saveUser}
        autoFocus
      />
    </div>
  );

  // Loading skeleton
  const loadingTemplate = () => {
    return (
      <div className="loading-skeleton">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <Skeleton width="100%" height="60px" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-users-container-prime">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Estadísticas */}
      <div className="stats-grid">
        <Card className="stat-card-prime">
          <div className="stat-content">
            <div className="stat-icon total">
              <i className="pi pi-users"></i>
            </div>
            <div className="stat-info-prime">
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">Total Usuarios</span>
            </div>
          </div>
        </Card>

        <Card className="stat-card-prime">
          <div className="stat-content">
            <div className="stat-icon admin">
              <i className="pi pi-shield"></i>
            </div>
            <div className="stat-info-prime">
              <span className="stat-value">
                {users.filter(u => u.rol_id === 1).length}
              </span>
              <span className="stat-label">Administradores</span>
            </div>
          </div>
        </Card>

        <Card className="stat-card-prime">
          <div className="stat-content">
            <div className="stat-icon worker">
              <i className="pi pi-user"></i>
            </div>
            <div className="stat-info-prime">
              <span className="stat-value">
                {users.filter(u => u.rol_id === 2).length}
              </span>
              <span className="stat-label">Trabajadores</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="table-card">
        <DataTable
          value={filteredUsers}
          paginator
          rows={10}
          loading={loading}
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No se encontraron usuarios"
          responsiveLayout="scroll"
          stripedRows
          rowHover
          dataKey="id"
        >
          <Column 
            field="nombre" 
            header="Usuario" 
            body={userBodyTemplate}
            sortable
          />
          <Column 
            field="email" 
            header="Contacto" 
            body={contactBodyTemplate}
          />
          <Column 
            field="rol_id" 
            header="Rol" 
            body={roleBodyTemplate}
            sortable
          />
          <Column 
            header="Acciones" 
            body={actionsBodyTemplate}
            style={{ width: '120px', textAlign: 'center' }}
          />
        </DataTable>
      </Card>

      {/* Modal de edición */}
      <Dialog
        visible={showModal}
        style={{ width: '450px' }}
        header="Editar Usuario"
        modal
        footer={dialogFooter}
        onHide={() => setShowModal(false)}
        draggable={false}
        resizable={false}
      >
        {selectedUser && (
          <div className="edit-form">
            <div className="form-field-prime">
              <label htmlFor="nombre">Nombre completo *</label>
              <InputText
                id="nombre"
                value={selectedUser.nombre}
                onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                placeholder="Juan Pérez"
                className="w-full"
              />
            </div>

            <div className="form-field-prime">
              <label htmlFor="email">Correo electrónico *</label>
              <InputText
                id="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="w-full"
              />
            </div>

            <div className="form-field-prime">
              <label htmlFor="phone">Teléfono *</label>
              <InputText
                id="phone"
                value={selectedUser.phone}
                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                placeholder="1234567890"
                maxLength="10"
                className="w-full"
              />
            </div>

            <div className="form-field-prime">
              <label htmlFor="rol">Rol del usuario *</label>
              <Dropdown
                id="rol"
                value={selectedUser.rol_id}
                options={[
                  { label: 'Administrador', value: 1 },
                  { label: 'Trabajador', value: 2 }
                ]}
                onChange={(e) => setSelectedUser({ ...selectedUser, rol_id: e.value })}
                placeholder="Selecciona un rol"
                className="w-full"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AdminUsers;