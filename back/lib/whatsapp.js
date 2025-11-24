import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import fs from "fs";

let sock; // 💡 VARIABLE GLOBAL QUE SE EXPORTA

export async function startWhatsapp() {
    const sessionPath = "/tmp/baileys_auth";

    if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update;

        if (qr) qrcode.generate(qr, { small: true });
        if (connection === "open") console.log("WhatsApp conectado ✔");
        if (connection === "close") {
            console.log("Reconectando...");
            startWhatsapp();
        }
    });

    return sock;
}

// ⬅️ Ahora sí devuelve el socket real
export function getWhatsappClient() {
    return sock;
}
