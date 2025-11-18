import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { email } from 'zod';
import { Resend } from 'resend';


dotenv.config();
  const resend = new Resend('re_RiEbEfse_4tDoNpbAq9rd9Roaau5JnwRx')

export const sendVerificationEmail = async (email, token) => {
  const link = `https://upa-cafe.vercel.app/verificar?token=${token}`;
  const data = await resend.emails.send({
    from: "Cafeteria upa <noreply@upacafe.lat>",
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <h2>Verifica tu cuenta</h2>
      <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
      <a href="${link}">${link}</a>
    `
  });
  console.log('coreeo enviado : ' + data.data)
  };
export const sendResetPassword = async (email, token) => {
  const link = `https://upa-cafe.vercel.app/reset-password?token=${token}`;
  try{
  const data = await resend.emails.send({
    
      
    
    from: "Cafeteria upa <noreply@upacafe.lat>",
    to: [email],
    subject: 'Restablece tu contraseña',
    html: `
      <h2>Solicitaste restablecer tu contraseña</h2>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña. Este enlace expira en <b>15 minutos</b>:</p>
      <a href="${link}">${link}</a>
      <br /><br />
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    `
  });
  console.log('correo enviado : ' + data)
}catch(e){
  console.log(e)
}
  
};

