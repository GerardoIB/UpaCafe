import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { email } from 'zod';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APLICATION_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Solo si es necesario
  }
});

export const sendVerificationEmail = async (email, token) => {
  const link = `https://upa-cafe.vercel.app/verificar?token=${token}`;
  await transporter.sendMail({
    from: '"Cafetería UPA" <no-reply@cafeteria.com>',
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <h2>Verifica tu cuenta</h2>
      <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
      <a href="${link}">${link}</a>
    `
  });
  };
export const sendResetPassword = async (email, token) => {
  const link = `https://upa-cafe.vercel.app/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Cafetería UPA" <no-reply@cafeteria.com>',
    to: email,
    subject: 'Restablece tu contraseña',
    html: `
      <h2>Solicitaste restablecer tu contraseña</h2>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña. Este enlace expira en <b>15 minutos</b>:</p>
      <a href="${link}">${link}</a>
      <br /><br />
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    `
  });
};

