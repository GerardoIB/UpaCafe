import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

export const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
    }
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

whatsapp.on('ready', () => {
    console.log('Client is ready');
});

whatsapp.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

whatsapp.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});