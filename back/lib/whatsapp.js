import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { fa } from "zod/locales";

// Configuración para Brave en Fedora
export const whatsapp = new Client({
    puppeteer: {
        headless: true, // Puedes cambiar a false para desarrollo
        executablePath: '/usr/bin/brave-browser', // Ruta de Brave en Fedora
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
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


