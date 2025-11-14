import { whatsapp } from "../lib/whatsapp.js";

export const messager = async (tel, pedidoId, status) => {
    try {
        // Validaciones iniciales
        console.log(tel,pedidoId,status)
        if (!tel || !pedidoId || !status) {
            console.error('❌ Faltan parámetros requeridos');
            return { success: false, error: 'Faltan parámetros requeridos' };
        }

        // Formatear el número correctamente
        const telUser = tel
        const chatId = `521${telUser}@c.us`;
        console.log(`📞 Intentando enviar a: ${chatId}`);

        // Verificar si el cliente de WhatsApp está listo
        if (!whatsapp.pupPage || !whatsapp.info) {
            console.error('❌ WhatsApp client no está listo');
            return { success: false, error: 'WhatsApp no está conectado' };
        }

        // Verificar si el contacto existe en WhatsApp
        try {
            const contact = await whatsapp.getContactById(chatId);
            console.log('✅ Contacto encontrado:', contact.name || contact.pushname);
            
            if (!contact.isUser) {
                console.error('❌ El número no es usuario de WhatsApp');
                return { success: false, error: 'El número no es usuario de WhatsApp' };
            }
        } catch (contactError) {
            console.error('❌ Error al verificar contacto:', contactError.message);
            return { success: false, error: 'Contacto no encontrado' };
        }

        // Crear mensaje más personalizado y profesional
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
⏰ Fecha: ${new Date().toLocaleString()}

¡Gracias por preferirnos! 🎉`;

        // Enviar mensaje
        console.log('🔄 Enviando mensaje...');
        const result = await whatsapp.sendMessage(chatId, message);
        console.log('✅ Mensaje enviado exitosamente');
        console.log('📤 ID del mensaje:', result.id);

        return { 
            success: true, 
            messageId: result.id,
            timestamp: result.timestamp 
        };

    } catch (error) {
        console.error('❌ Error en messager:', error.message);
        
        // Errores específicos de WhatsApp
        if (error.message.includes('not found')) {
            return { success: false, error: 'Número no encontrado en WhatsApp' };
        }
        if (error.message.includes('blocked')) {
            return { success: false, error: 'El número te tiene bloqueado' };
        }
        if (error.message.includes('group')) {
            return { success: false, error: 'No se puede enviar a grupos' };
        }
        
        return { success: false, error: error.message };
    }
};

// Función adicional para verificar el estado de WhatsApp
export const checkWhatsAppReady = () => {
    return whatsapp.pupPage && whatsapp.info;
};

// Función para obtener información del cliente de WhatsApp
export const getWhatsAppInfo = () => {
    if (!whatsapp.info) {
        return { ready: false };
    }
    
    return {
        ready: true,
        name: whatsapp.info.pushname,
        number: whatsapp.info.wid.user,
        platform: whatsapp.info.platform
    };
};