import e from 'express';
import { startWhatsapp } from '../lib/whatsapp.js';
import twilio from 'twilio'
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

    
export const messager = async (tel, pedidoId, status) => {
    let client;
    (async () => {
        client = await startWhatsapp()
    })()
 
    
   
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

    const chatId = `+521${tel.replace(/\D/g, '')}@c.us`; // Formato internacional para WhatsApp
    client.sendMessage(chatId, message);
    console.log('Mensaje enviado a WhatsApp:', chatId);
   
};

