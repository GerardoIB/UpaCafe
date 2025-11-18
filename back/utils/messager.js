
import axios from "axios";

export const messager = async (tel, pedidoId, status) => {
    try {
        // Validaciones iniciales
        console.log(tel, pedidoId, status)
        if (!tel || !pedidoId || !status) {
            console.error('❌ Faltan parámetros requeridos');
            return { success: false, error: 'Faltan parámetros requeridos' };
        }

        // Formatear el número correctamente
        const telUser = tel
        const chatId = `521${telUser}@c.us`;
        console.log(`📞 Intentando enviar a: ${chatId}`);
        const message = `Hola! 👋

📦 *Actualización de tu Pedido #${pedidoId}*

${statusMessage}

*Resumen del pedido:*
🆔 ID: ${pedidoId}
📊 Estado: ${status}
⏰ Fecha: ${new Date().toLocaleString()}

¡Gracias por preferirnos! 🎉`;

        const url = 'https://7107.api.green-api.com/waInstance7107381405/sendMessage/680be9abb292473f983a9f71e5e9a85c5fbd7560a314474da2'

        const payload = {
            chatId: chatId,
            message: message,
            customPreview:{}
        }
        axios.post(url,payload)
        .then(res => {
            console.log(res)

        })
        .catch(err => {
            console.log(err)
        })




    } catch (e) {
        console.log(e)
    }
}
