import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { v4 } from 'uuid';




dotenv.config();
const DEFAULT_CONF =
{
  host: process.env.HOSTDB,
  user: process.env.USERDB,
  password: process.env.PASSWORD_DB,
  port: process.env.PORT_DB,
  database: process.env.DB_DB
}
const connectionString = process.env.DATABSE_URL ?? DEFAULT_CONF
const conection = await mysql.createConnection(connectionString);
console.log(process.env.DB_DB)

export class ClientsModel {
  
  static async login({ email, password }) {
    const passwordDb = await conection.query(
      'SELECT password FROM usuarios WHERE email = ? ',
      [email]
    );
    if (!passwordDb[0][0] || !passwordDb[0][0].password) {
      throw new Error('User or password is invalid');
    }

    const passwordHased = await bcrypt.compare(password, passwordDb[0][0].password);
    if (!passwordHased) {
      throw new Error('User or password is invalid');
    }
    if (passwordHased) {
      const user = await conection.query(
        'SELECT id, email, nombre, rol_id, phone FROM usuarios WHERE email = ?',
        [email]
      );
      return user[0][0];
    }
    else {
      throw new Error('User or password is invalid');
    }


  }
  static async createUser({ email, password, name, rol, phone }) {
    const passwordHashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const smsCode = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    rol = 3
    const [result] = await conection.query(

      `INSERT INTO usuarios (nombre, email, password, rol_id, phone, token_verificacion, codigo_sms, fecha_expiracion_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHashed, rol, phone, token, smsCode, expiration]
    );

    return { id: result.insertId, email, token, smsCode };
  }
  static async acountVerification(token) {
    const [user] = await conection.query(
      'Update usuarios SET verificado = 1 WHERE  token_verificacion = ?',
      [token]
    );
    return user;
  }

  static async getOrders(userId) {
    try {
      // 1️⃣ Obtener los pedidos del usuario
      const [orders] = await conection.query(
        'SELECT * FROM pedidos WHERE usuario_id = ?',
        [userId]
      );

      // 2️⃣ Para cada pedido, obtener sus productos desde detalle_pedido
      for (const order of orders) {
        const [productos] = await conection.query(
          `SELECT p.id, p.nombre, dp.cantidad
         FROM detalle_pedidos dp
         JOIN productos p ON dp.producto_id = p.id
         WHERE dp.pedido_id = ?`,
          [order.id]
        );
        order.productos = productos;
      }

      return orders;
    } catch (error) {
      console.error("Error obteniendo pedidos:", error);
      throw error;
    }
  }



  static async deleteUser(userId) {
    const [result] = await conection.query(
      'DELETE FROM clients WHERE id = ?',
      [userId]
    );
    return result;
  }
  static async updateUser({ userId, email, password, name, surname, phone }) {
    const passwordHased = await bcrypt.hash(password, 10);
    const [result] = await conection.query(
      'UPDATE clients SET email = ?, password = ?, name = ?, surname = ?, phone = ? WHERE id = ?',
      [email, passwordHased, name, surname, phone, userId]
    );
    return result;
  }
  static async createWorker({ email, password, name, rol, phone }) {
    const passwordHashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const smsCode = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    rol = 2
    const [result] = await conection.query(

      `INSERT INTO usuarios (nombre, email, password, rol_id, phone, token_verificacion, codigo_sms, fecha_expiracion_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHashed, rol, phone, token, smsCode, expiration]
    );
    return { id: result.insertId, email, token, smsCode };
  }
  static async createAdmin({ email, password, name, rol, phone }) {
    const passwordHashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const smsCode = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    rol = 1
    const [result] = await conection.query(

      `INSERT INTO usuarios (nombre, email, password, rol_id, phone, token_verificacion, codigo_sms, fecha_expiracion_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHashed, rol, phone, token, smsCode, expiration]
    );
    return { id: result.insertId, email, token, smsCode };
  }
  static async deleteWoroker(userId) {
    const [result] = await conection.query(
      'DELETE FROM usuarios WHERE id = ? AND rol_id = 2',
      [userId]
    );
    return result;
  }
  static async deleteAdmin(userId) {
    const [result] = await conection.query(
      'DELETE FROM usuarios WHERE id = ? AND rol_id = 1',
      [userId]
    );
    return result;
  }
  static async getAllWorkers() {
    const [workers] = await conection.query(
      'SELECT id, nombre, email, phone, rol_id FROM usuarios WHERE rol_id = 2'
    );
    return workers;
  }
  static async getAllAdmins() {
    const [admins] = await conection.query(
      'SELECT id, nombre, email, phone, rol_id FROM usuarios WHERE rol_id = 1'
    );
    return admins;
  }
  static async deleteAcount(userId) {
    const [result] = await conection.query(
      'DELETE FROM usuarios WHERE id = ? AND rol_id = 3',
      [userId]
    );
    return result;
  }
  static async updatePassword({ id, email, newPassword }) {
    const [result] = await conection.query(
      'UPDATE  usuarios SET password=? Where  id =? AND email=?',
      [newPassword, id, email]
    )
    return result;
  }
  static async detalle(id) {
    try {
      const [rows] = await conection.query(`
      SELECT 
        dp.id,
        p.nombre AS nombre_producto,
        dp.cantidad,
        dp.precio_unitario,
        (dp.cantidad * dp.precio_unitario) AS subtotal
      FROM detalle_pedidos dp
      JOIN productos p ON dp.producto_id = p.id
      WHERE dp.pedido_id = ?;
    `, [id]);

      return rows;
    } catch (error) {
      console.error(error);

    }
  }
  static async validateEmail(email) {
    try {
      const result = await conection.query(
        'Select email FROM usuarios where email=?',
        [email]
      )
      console.log(result[0][0])
      if (result[0][0]) {
        return true
      } else {
        return false
      }

    } catch (e) {
      console.log(e)
    }
  }
  static async updatePassword( email, password) {
    try {
      const passHashed = await bcrypt.hash(password,10)
      console.log('password: ' + password, 'correo' + email)
      const [result] = await conection.query(
        'UPDATE usuarios SET password=? WHERE email=?',
        [passHashed, email]
      )
      return result
    } catch (e) {
      console.log(e)
    }
  }
  static async getStats() {
    try {
      const [usuarios] = await conection.query(
        'SELECT COUNT(*) AS total FROM usuarios'
      );

      const [tickets] = await conection.query(
        'SELECT COUNT(*) AS total FROM tickets'
      );

      const [pedidosPorMes] = await conection.query(`
        SELECT 
          MONTH(fecha) AS mes,
          COUNT(*) AS total
        FROM pedidos
        GROUP BY mes
        ORDER BY mes
      `);

      const [ingresosMensuales] = await conection.query(`
        SELECT 
          MONTH(fecha) AS mes,
          SUM(total) AS ingresos
        FROM pedidos
        GROUP BY mes
        ORDER BY mes
      `);

      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      return {
        totalUsuarios: usuarios[0].total,
        totalTickets: tickets[0].total,
        pedidosPorMes: pedidosPorMes.map(p => ({
          mes: meses[p.mes - 1],
          total: p.total
        })),
        ingresosMensuales: ingresosMensuales.map(i => ({
          mes: meses[i.mes - 1],
          ingresos: i.ingresos
        }))
      };
    } catch (error) {
      console.error('Error en adminModel.getStats:', error);
      throw error;
    }
  }
  static async setNotification(userId, mensaje) {
    try {
      const [result] = await conection.query(
        'INSERT INTO notifications (user_id, mensaje) VALUES (?, ?)',
        [userId, mensaje]
      )
      return result
    } catch (e) {
      console.log(e)
    }
  }
  static async getAllUsers() {
    try {
      const [users] = await conection.query(
        'SELECT id, nombre, email, phone, rol_id FROM usuarios where rol_id = 1 OR rol_id = 2'
      )
      return users
    } catch (e) {
      console.log(e)
    }
  }
  static async getNotificationsById(id) {
    try {
      const [result] = await conection.query(
        'SELECT * FROM notificaciones WHERE usuario_id=?',
        [id]
      )
      return result
    } catch (e) {
      console.log(e)
    }
  }
  static async updateStatusNot(id){
    try{
      const [result] = await conection.query(
        'UPDATE notificaciones SET leido=1 WHERE usuario_id=?',
        [id]
      )
      return result
    }catch(e){
      console.log(e)
    }
  }
  static async isVerificate(email) {
        try {
            const [result] = await conection.query(
                'Select verificado FROM usuarios WHERE email =?',
                [email]
            )
            if (result[0].verificado === 1) {
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e)
        }
    }
    static async updateWorker(id,phone,nombre,email,rol_id)
    {
      try {
          const [result] = await conection.query(
            'UPDATE usuarios SET nombre = ?,email=?,rol_id= ?, phone=? WHERE id=?',
            [nombre,email,rol_id,phone,id]

          )
          return result
      } catch (error) {
        console.log(error)
      }
    }
    /*
   static async createuser({pkPhone,name,firstName,lastName,gender,birthday,password}){
    try{
      console.log(process.env.DB_DB)
      const [result] = await conection.query(
        'INSERT INTO tbl_persons(pk_phone,person,first_name,last_name,gender,birthday) VALUES(?,?,?,?,?,?)',
      [pkPhone,name,firstName,lastName,gender,birthday])
      const id = String(Math.floor(1000 + Math.random() * 9000));
      // ...existing code...
      const passHashed = await bcrypt.hash(password,10)
      const [resultUser] = await conection.query(
        'INSERT INTO tbl_users(fk_phone,fk_level,password) VALUES(?,?,?)',
        [pkPhone,1,passHashed]
      )
      return result
    }catch(e){
      console.log(e)
    }
   
  }
    */

};
