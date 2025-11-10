import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APLICATIONPASSWORD
  }
});

export const sendVerificationEmail = async (email, token) => {
  const link = `http://localhost:5173/verificar?token=${token}`;
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

