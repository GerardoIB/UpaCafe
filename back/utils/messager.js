import { getWhatsappClient } from '../lib/whatsapp.js';

export const messager = async (tel, pedidoId, status) => {
    const client = getWhatsappClient();

    if (!client) {
        console.log("❌ WhatsApp no está inicializado");
        return;
    }

    const messages = {
        pendiente: '⏳ Tu pedido ha sido recibido y está en espera de preparación.',
        preparando: '👨‍🍳 Tu pedido está siendo preparado en este momento.',
        listo: '✅ ¡Tu pedido está listo! Puedes pasar a recogerlo.',
        entregado: '🎉 ¡Pedido entregado! Gracias por tu compra.',
        cancelado: '❌ Tu pedido ha sido cancelado.'
    };

    const statusMessage = messages[status] || status;

    const message = `Hola! 👋

📦 *Actualización de tu Pedido #${pedidoId}*
${statusMessage}

*Resumen del pedido:*
🆔 ID: ${pedidoId}
📊 Estado: ${status}
⏰ Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}

¡Gracias por preferirnos! 🎉`;

    const chatId = `521${tel.replace(/\D/g, '')}@c.us`;

    const send = await client.sendMessage(chatId, { text: message }); // ⭐ firma correcta de Baileys

    console.log("Mensaje enviado:", send);
};
