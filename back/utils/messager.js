import axios from "axios";
import twilio from 'twilio'
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
    
export const messager = async (tel, pedidoId, status) => {
 
 
  
   
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


    // Enviar mensaje
    const res = await client.messages.create({
        body:message,
        messagingServiceSid: 'MGb7eab4d96febb70eeb3d737e1f07f507',
        to: `+52${tel}`
    })
    console.log(console.log(res))
   
};

