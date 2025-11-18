import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import './AgregarTabajador.css';

const AgregarTrabajador = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    rol_id: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  // Opciones de roles
  const roleOptions = [
    { label: 'Administrador', value: 1, icon: 'pi pi-shield' },
    { label: 'Trabajador', value: 2, icon: 'pi pi-user' }
  ];

  // Template para mostrar el rol seleccionado
  const selectedRoleTemplate = (option, props) => {
    if (option) {
      return (
        <div className="role-option">
          <i className={option.icon}></i>
          <span>{option.label}</span>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  // Template para las opciones del dropdown
  const roleOptionTemplate = (option) => {
    return (
      <div className="role-option">
        <i className={option.icon}></i>
        <span>{option.label}</span>
      </div>
    );
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // Nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    // Teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener exactamente 10 dígitos';
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Rol
    if (!formData.rol_id) {
      newErrors.rol_id = 'Debes seleccionar un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      rol_id: e.value
    });
    
    // Limpiar error del campo
    if (errors.rol_id) {
      setErrors({
        ...errors,
        rol_id: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor corrige los errores en el formulario',
        life: 3000
      });
      return;
    }

    setLoading(true);

    try {
      // Determinar endpoint según el rol
      const endpoint = formData.rol_id === 1 
        ? 'https://upacafe.onrender.com/api/user/createAdmin'
        : 'https://upacafe.onrender.com/api/user/createWorker';

      const res = await axios.post(
        endpoint,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const roleName = formData.rol_id === 1 ? 'Administrador' : 'Trabajador';

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `✅ ${roleName} agregado exitosamente`,
        life: 3000
      });

      // Limpiar formulario
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        password: '',
        rol_id: null 
      });
      setErrors({});

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Error al agregar usuario';
      
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: `❌ ${errorMsg}`,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      password: '',
      rol_id: null 
    });
    setErrors({});
  };

  // Template para el header del password
  const passwordHeader = <div className="font-bold mb-3">Elige una contraseña</div>;
  
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Sugerencias</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Al menos una letra minúscula</li>
        <li>Al menos una letra mayúscula</li>
        <li>Al menos un número</li>
        <li>Mínimo 6 caracteres</li>
      </ul>
    </>
  );

  return (
    <div className="agregar-trabajador-container-prime">
      <Toast ref={toast} />

      <Card className="form-card">
        <div className="card-header-custom">
          <div className="header-icon">
            <i className="pi pi-user-plus"></i>
          </div>
          <h2>Agregar Nuevo Usuario</h2>
          <p className="subtitle">Completa el formulario para registrar un administrador o trabajador</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {/* Nombre */}
          <div className="field-container">
            <label htmlFor="name" className="field-label">
              <i className="pi pi-user"></i>
              Nombre completo *
            </label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez García"
              className={classNames('field-input', { 'p-invalid': errors.name })}
              autoComplete="name"
            />
            {errors.name && (
              <small className="p-error block mt-1">
                <i className="pi pi-exclamation-circle mr-1"></i>
                {errors.name}
              </small>
            )}
          </div>

          {/* Email */}
          <div className="field-container">
            <label htmlFor="email" className="field-label">
              <i className="pi pi-envelope"></i>
              Correo electrónico *
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className={classNames('field-input', { 'p-invalid': errors.email })}
              autoComplete="email"
            />
            {errors.email && (
              <small className="p-error block mt-1">
                <i className="pi pi-exclamation-circle mr-1"></i>
                {errors.email}
              </small>
            )}
          </div>

          {/* Teléfono */}
          <div className="field-container">
            <label htmlFor="phone" className="field-label">
              <i className="pi pi-phone"></i>
              Teléfono *
            </label>
            <InputText
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              maxLength="10"
              className={classNames('field-input', { 'p-invalid': errors.phone })}
              autoComplete="tel"
              keyfilter="int"
            />
            {errors.phone && (
              <small className="p-error block mt-1">
                <i className="pi pi-exclamation-circle mr-1"></i>
                {errors.phone}
              </small>
            )}
          </div>

          {/* Rol */}
          <div className="field-container">
            <label htmlFor="rol_id" className="field-label">
              <i className="pi pi-briefcase"></i>
              Rol del usuario *
            </label>
            <Dropdown
              id="rol_id"
              value={formData.rol_id}
              options={roleOptions}
              onChange={handleRoleChange}
              placeholder="Selecciona un rol"
              className={classNames('field-dropdown', { 'p-invalid': errors.rol_id })}
              valueTemplate={selectedRoleTemplate}
              itemTemplate={roleOptionTemplate}
            />
            {errors.rol_id && (
              <small className="p-error block mt-1">
                <i className="pi pi-exclamation-circle mr-1"></i>
                {errors.rol_id}
              </small>
            )}
            <small className="field-hint">
              <i className="pi pi-info-circle"></i>
              <span>
                {formData.rol_id === 1 && 'El administrador tendrá acceso completo al sistema'}
                {formData.rol_id === 2 && 'El trabajador podrá gestionar pedidos y productos'}
                {!formData.rol_id && 'Selecciona el nivel de acceso del usuario'}
              </span>
            </small>
          </div>

          {/* Contraseña */}
          <div className="field-container">
            <label htmlFor="password" className="field-label">
              <i className="pi pi-lock"></i>
              Contraseña *
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={classNames('field-input-password', { 'p-invalid': errors.password })}
              toggleMask
              header={passwordHeader}
              footer={passwordFooter}
              promptLabel="Ingresa una contraseña"
              weakLabel="Débil"
              mediumLabel="Media"
              strongLabel="Fuerte"
            />
            {errors.password && (
              <small className="p-error block mt-1">
                <i className="pi pi-exclamation-circle mr-1"></i>
                {errors.password}
              </small>
            )}
          </div>

          {/* Botones */}
          <div className="form-actions">
            <Button
              type="button"
              label="Limpiar"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={handleReset}
              disabled={loading}
              outlined
            />
            <Button
              type="submit"
              label={loading ? 'Agregando...' : 'Agregar Usuario'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              loading={loading}
              className="p-button-success"
            />
          </div>
        </form>

        {/* Información adicional */}
        <div className="card-footer-info">
          <i className="pi pi-info-circle"></i>
          <span>El usuario recibirá un correo de verificación a su email</span>
        </div>
      </Card>
    </div>
  );
};

export default AgregarTrabajador;