import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { email } from 'zod';
import { Resend } from 'resend';


dotenv.config();
  const resend = new Resend('re_RiEbEfse_4tDoNpbAq9rd9Roaau5JnwRx')

export const sendVerificationEmail = async (email, token) => {
  const link = `https://upa-cafe.vercel.app/verificar?token=${token}`;
  
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #2e7d32; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Cafetería UPA</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <h2>Verifica tu cuenta</h2>
        <p>Gracias por registrarte en nuestra plataforma. Para activar tu cuenta, haz clic en el botón a continuación:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="background-color: #2e7d32; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Verificar Cuenta
          </a>
        </div>
        <p style="font-size: 12px; color: #888;">Si no creaste una cuenta, ignora este correo.</p>
      </div>
      <div style="background-color: #f1f8e9; padding: 12px; text-align: center; font-size: 12px; color: #555;">
        © 2025 Cafetería UPA. Todos los derechos reservados.
      </div>
    </div>
  </div>
  `;

  const data = await resend.emails.send({
    from: "Cafetería UPA <noreply@upacafe.lat>",
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: htmlContent
  });

  console.log('Correo enviado:', data);
};

export const sendResetPassword = async (email, token) => {
  const link = `https://upa-cafe.vercel.app/reset-password?token=${token}`;
  
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #2e7d32; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Cafetería UPA</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <h2>Restablece tu contraseña</h2>
        <p>Solicitaste restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva contraseña. Este enlace expira en <b>15 minutos</b>:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="background-color: #2e7d32; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="font-size: 12px; color: #888;">Si no solicitaste este cambio, ignora este correo.</p>
      </div>
      <div style="background-color: #f1f8e9; padding: 12px; text-align: center; font-size: 12px; color: #555;">
        © 2025 Cafetería UPA. Todos los derechos reservados.
      </div>
    </div>
  </div>
  `;

  try {
    const data = await resend.emails.send({
      from: "Cafetería UPA <noreply@upacafe.lat>",
      to: email,
      subject: 'Restablece tu contraseña',
      html: htmlContent
    });
    console.log('Correo enviado:', data);
  } catch (e) {
    console.error(e);
  }
};


