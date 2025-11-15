import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
import './VerificarCorreo.css';

const VerificarCorreo = () => {
  const [estado, setEstado] = useState('cargando'); // 'cargando' | 'exito' | 'error'
  const [mensaje, setMensaje] = useState('Estamos verificando tu cuenta...');
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    const verificar = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setEstado('error');
        setMensaje('Token no encontrado');
        setDetalle('Asegúrate de abrir el enlace completo del correo.');
        return;
      }

      try {
        const res = await fetch(`https://upacafe.onrender.com/api/user/verificar?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error al verificar');

        setEstado('exito');
        setMensaje('¡Tu correo ha sido verificado correctamente!');
      } catch (err) {
        console.error(err);
        setEstado('error');
        setMensaje('No se pudo verificar tu cuenta');
        setDetalle(err.message);
      }
    };

    setTimeout(() => verificar(), 1200);
  }, []);

  const renderIcono = () => {
    switch (estado) {
      case 'cargando':
        return (
          <div className="verificar-icon cargando">
            <div className="loading-spinner">
              <div className="spinner-circle"></div>
            </div>
          </div>
        );
      case 'exito':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="verificar-icon exito"
          >
            <FaCheckCircle className="success-icon" />
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="verificar-icon error"
          >
            <FaTimesCircle className="error-icon" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderBotones = () => {
    if (estado === 'exito') {
      return (
        <div className="action-buttons">
          <a href="/login" className="btn btn-primary">
            Ir al Login
          </a>
        </div>
      );
    }

    if (estado === 'error') {
      return (
        <div className="action-buttons">
          <a href="/registro" className="btn btn-primary">Reintentar</a>
          <a href="/contacto" className="btn btn-secondary">Contactar soporte</a>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="verificar-page">
      <div className="verificar-container">
        <motion.div
          className="verificar-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="verificar-icon-container">
            {renderIcono()}
          </div>

          <div className="verificar-content">
            <h2 className={`verificar-title ${estado}`}>
              {estado === 'exito'
                ? '¡Verificación Exitosa!'
                : estado === 'error'
                ? 'Error en la Verificación'
                : 'Verificando tu Cuenta'}
            </h2>

            <p className="verificar-message">{mensaje}</p>

            {detalle && (
              <div className="verificar-details">
                <p>{detalle}</p>
              </div>
            )}

            <div className="verificar-actions">{renderBotones()}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerificarCorreo;
