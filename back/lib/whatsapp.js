import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";

export async function startWhatsapp() {
    const sessionPath = "/tmp/baileys_auth";

    if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
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
