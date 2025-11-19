import axios from "axios";

export const messager = async (tel, pedidoId, status) => {
  try {
    // Validaciones iniciales
    if (!tel || !pedidoId || !status) {
      console.error('❌ Faltan parámetros requeridos');
      return { success: false, error: 'Faltan parámetros requeridos' };
    }

    // Limpiar y formatear el número (eliminar espacios, guiones, paréntesis)
    const telLimpio = tel.toString().replace(/\D/g, '');
    
    // Validar longitud del número (10 dígitos para México)
    if (telLimpio.length !== 10) {
      console.error('❌ Número de teléfono inválido:', telLimpio);
      return { success: false, error: 'Número de teléfono inválido' };
    }

    // Formatear correctamente: código de país (52) + número (sin 1 adicional)
    const chatId = `52${telLimpio}@c.us`;
    console.log(`📞 Intentando enviar a: ${chatId}`);

    // 🔥 PRIMERO: Verificar si el número tiene WhatsApp
    const checkUrl = `https://7107.api.green-api.com/waInstance7107381405/checkWhatsapp/680be9abb292473f983a9f71e5e9a85c5fbd7560a314474da2`;
    
    const checkResponse = await axios.post(checkUrl, {
      phoneNumber: parseInt(`52${telLimpio}`)
    });

    console.log('Verificación de WhatsApp:', checkResponse.data);

    // Si el número no existe en WhatsApp
    if (!checkResponse.data.existsWhatsapp) {
      console.error('❌ El número no tiene WhatsApp:', chatId);
      return { 
        success: false, 
        error: 'El número no tiene WhatsApp registrado' 
      };
    }

    // Mensajes personalizados
    const messages = {
      'pendiente': '⏳ Tu pedido ha sido recibido y está en espera de preparación.',
      'preparando': '👨‍🍳 Tu pedido está siendo preparado en este momento.',
      'listo': '✅ ¡Tu pedido está listo! Puedes pasar a recogerlo.',
      'entregado': '🎉 ¡Pedido entregado! Gracias por tu compra.',
      'cancelado': '❌ Tu pedido ha sido cancelado.'
    };

    const statusMessage = messages[status] || `El estado de tu pedido es: ${status}`;

    const message = `Hola! 👋

📦 *Actualización de tu Pedido #${pedidoId}*

${statusMessage}

*Resumen del pedido:*
🆔 ID: ${pedidoId}
📊 Estado: ${status}
⏰ Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}

¡Gracias por preferirnos! 🎉`;

<<<<<<< HEAD
    // Enviar mensaje
    const sendUrl = "https://7107.api.green-api.com/waInstance7107381405/sendMessage/680be9abb292473f983a9f71e5e9a85c5fbd7560a314474da2";
    
    const payload = {
      chatId: chatId,
      message: message
    };
=======
        const url = "https://7107.api.green-api.com/waInstance7107381405/sendMessage/680be9abb292473f983a9f71e5e9a85c5fbd7560a314474da2"
>>>>>>> 0151be3562efe1e49ab0a94a759cdbda00f3f5af

    const response = await axios.post(sendUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Mensaje enviado exitosamente:', response.data);
    
    return { 
      success: true, 
      data: response.data,
      chatId: chatId 
    };

  } catch (error) {
    console.error('❌ Error al enviar mensaje de WhatsApp:', error.response?.data || error.message);
    
    // Manejo específico de errores de Green API
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 466:
          return { 
            success: false, 
            error: 'Número no registrado en WhatsApp o formato inválido',
            details: errorData 
          };
        case 401:
          return { 
            success: false, 
            error: 'Token de API inválido' 
          };
        case 403:
          return { 
            success: false, 
            error: 'Instancia no autorizada o inactiva' 
          };
        case 429:
          return { 
            success: false, 
            error: 'Límite de mensajes excedido' 
          };
        default:
          return { 
            success: false, 
            error: `Error ${status}: ${errorData?.message || 'Error desconocido'}` 
          };
      }
    }
<<<<<<< HEAD
    
    return { 
      success: false, 
      error: error.message || 'Error al enviar mensaje' 
    };
  }
};
=======
}
>>>>>>> 0151be3562efe1e49ab0a94a759cdbda00f3f5af
