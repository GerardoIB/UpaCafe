import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { fa } from "zod/locales";

// Configuración para Brave en Fedora
export const whatsapp = new Client({
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    },
    authStrategy: new LocalAuth()
});


whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('ready', () => {
    console.log('Client is ready');
});

// Manejo de errores adicional
whatsapp.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

whatsapp.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});


