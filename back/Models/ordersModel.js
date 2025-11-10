import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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

export class ordersModel {
    static async createProducto({ name, description, price, disponible }) {
        const [result] = await conection.query(
            `INSERT INTO productos (nombre,descripcion,precio,disponible) VALUES (?,?,?,?)`,
            [name, description, price, disponible]
        );
        return result;
    }
    static async addIngretes({ name }) {
        const [result] = await conection.query(
            `INSERT INTO ingredientes (nombre) VALUES (?)`,
            [name]
        );
        return result;
    }
    static async createPedido({ clientId, total }) {
        const [result] = await conn.query(
            `INSERT INTO pedidos (usuario_id, estado, total) VALUES (?, 'pendiente', ?)`,
            [clientId, total]
        );
        return result.insertId; // ← Esto devuelve el ID generado
    }

    // CORREGIDO: nombres de tabla y campos
    static async createDetallePedido({ pedidoId, productoId, cantidad, precioUnitario, indicaciones }) {
        const [result] = await conn.query(
            `INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, indicaciones) VALUES (?, ?, ?, ?, ?)`,
            [pedidoId, productoId, cantidad, precioUnitario, indicaciones]
        );
        return result.insertId;
    }
    static async createDetallePedidoIngredientes({ detallePedidoId, ingredienteId, accion }) {
        const [result] = await conection.query(`INSERT INTO detalle_pedido_ingredientes (detalle_pedido_id, ingrediente_id, accion) VALUES (?, ?, ?)`,
            [detallePedidoId, ingredienteId, accion]
        );
        return result
    }
    static async getProductoPrice(productoId) {
        const [rows] = await conection.query(
            `SELECT precio FROM productos WHERE id = ?`,
            [productoId]
        );
        if (rows.length === 0) {
            throw new Error('Producto no encontrado');
        }
        return rows[0].precio;
    }
    static async createCompleteOrder({ clientId, productos }) {

        await conection.beginTransaction();
        try {
            let total = 0
            const productoPrecios = []
            for (const prod of productos) {
                const [rows] = await conection.query(
                    `SELECT precio FROM productos WHERE id = ? AND disponible = 1`,
                    [prod.producto_id]
                );
                if (rows.length === 0) {
                    throw new Error(`Producto con ID ${prod.producto_id} no encontrado o no disponible`);
                }
                const precio = rows[0].precio
                const subtotal = precio * prod.cantidad
                total += subtotal
                productoPrecios.push({ productoId: prod.producto_id, precio })
            }
            const [pedidoResult] = await conection.query(
                `INSERT INTO pedidos (usuario_id, estado, total) VALUES (?, 'pendiente', ?)`,
                [clientId, total]
            );
            const pedidoId = pedidoResult.insertId;
            for (const producto of productos) {
                console.log(producto)
                const precioProduct = await conection.query(
                    `SELECT precio FROM productos WHERE id = ?`,
                    [producto.producto_id]
                );
                console.log(precioProduct[0][0].precio)
                const precioUnitario = precioProduct[0][0].precio * producto.cantidad;
                console.log(precioUnitario)
                const [detalleResult] = await conection.query(
                    `INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, indicaciones) VALUES (?, ?, ?, ?, ?)`,
                    [pedidoId, producto.producto_id, producto.cantidad, precioUnitario, producto.indicaciones || null]
                );

                const detallePedidoId = detalleResult.insertId;
                if (producto.ingredientes_personalizados && Array.isArray(producto.ingredientes_personalizados)) {
                    for (const ingrediente of producto.ingredientes_personalizados) {
                        await conection.query(
                            `INSERT INTO detalle_pedido_ingredientes (detalle_pedido_id, ingrediente_id, accion) VALUES (?, ?, ?)`,
                            [detallePedidoId, ingrediente.ingrediente_id, ingrediente.accion]
                        );
                    }
                }
            }
            await conection.commit();
            return { pedidoId, total };
        } catch (error) {
            await conection.rollback()
            throw error;
        }

    }
    static async getAllProducts() {
        const [products] = await conection.query(
            'SELECT * FROM productos'
        );
        return products;
    }
    static async getAllIngredients() {
        const [ingredients] = await conection.query(
            'SELECT * FROM ingredientes'
        );
        return ingredients;
    }
    static async getAllOrders() {
        const [orders] = await conection.query(
            'SELECT * FROM pedidos'
        );
        return orders;
    }
    static async getOrderDetails(pedidoId) {
        const [details] = await conection.query(
            `SELECT dp.*, p.nombre AS producto_nombre
             FROM detalle_pedidos dp
             JOIN productos p ON dp.producto_id = p.id
             WHERE dp.pedido_id = ?`,
            [pedidoId]
        );
        return details;
    }
    static async getOrdersPending() {
        const [orders] = await conection.query(
            `SELECT * FROM pedidos WHERE estado = 'pendiente' or estado = 'preparando'`
        );
        return orders;
    }
    static async updateOrderStatus({ pedidoId, newState }) {
        const [result] = await conection.query(
            `UPDATE pedidos SET estado = ? WHERE id = ?`,
            [newState, pedidoId]
        );
        return result;
    }
    static async makeTicket({ pedidoId, montoTotal, pagado }) {
        const [result] = await conection.query(
            'INSERT INTO tickets (pedido_id, monto_total, pagado) VALUES (?,?,?)',
            [pedidoId, montoTotal, pagado]
        )
        return result

    }
    static async getTicketsByUserId(userId) {
        const [tickets] = await conection.query(
            `SELECT 
            t.id AS ticket_id,
            t.pedido_id,
            t.monto_total,
            t.pagado,
            t.fecha_emision,
            p.estado AS estado_pedido,
            p.total,
            p.usuario_id
        FROM tickets t
        INNER JOIN pedidos p ON t.pedido_id = p.id
        WHERE p.usuario_id = ?
        ORDER BY t.fecha_emision DESC`,
            [userId]
        );
        return tickets;
    }
    static async getAllOrders() {
        const [orders] = await conection.query(
            'SELECT * FROM pedidos'
        );
        return orders;
    }
    static async isVerificate(userId) {
        try {
            const [result] = await conection.query(
                'Select verificado FROM usuarios WHERE id =?',
                [userId]
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
    static async addIngredientsToProduct(productoId, ingredienteId) {
        try {
            const [result] = await conection.query(`INSERT INTO producto_ingredientes (producto_id, ingrediente_id) VALUES (?, ?)`,
                [productoId, ingredienteId]);
            console.log(result)
            return result;
        } catch (e) {
            console.log(e)
        }
    }
    static async getProductosConIngredientes() {
        const sql = `
    SELECT 
      p.id AS producto_id,
      p.nombre AS producto_nombre,
      p.descripcion,
      p.precio,
      p.disponible,
      i.id AS ingrediente_id,
      i.nombre AS ingrediente_nombre,
      i.unidad
    FROM productos p
    LEFT JOIN producto_ingrediente pi ON pi.producto_id = p.id
    LEFT JOIN ingredientes i ON i.id = pi.ingrediente_id
    ORDER BY p.id;
  `;
        const [rows] = await conection.query(sql);

        // Transformamos los resultados para agrupar ingredientes por producto
        const productosMap = {};

        for (const row of rows) {
            if (!productosMap[row.producto_id]) {
                productosMap[row.producto_id] = {
                    id: row.producto_id,
                    nombre: row.producto_nombre,
                    descripcion: row.descripcion,
                    precio: row.precio,
                    disponible: row.disponible,
                    ingredientes: [],
                };
            }

            if (row.ingrediente_id) {
                productosMap[row.producto_id].ingredientes.push({
                    id: row.ingrediente_id,
                    nombre: row.ingrediente_nombre,
                    unidad: row.unidad,
                });
            }
        }

        return Object.values(productosMap);
    }
    static async getIngredientesByProducto(idProduct) {
        try {
            const [ingredientes] = await conection.query(
                `
      SELECT i.id, i.nombre
      FROM ingredientes i
      INNER JOIN producto_ingredientes pi ON pi.ingrediente_id = i.id
      WHERE pi.producto_id = ?
      `,
                [idProduct]
            );
            return ingredientes;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async deleteProduct(id) {
        try {
            const [result] = await conection.query(
                'DELETE FROM productos where id=?',
                [id]
            )
            return result
        } catch (e) {
            console.log(e)
        }
    }
    static async deleteIngrediente(id) {
        try {
            const [result] = await conection.query(
                'DELETE FROM ingredientes where id=?',
                [id]
            )
            return result
        } catch (e) {
            console.log(e)
        }
    }
    static async updateProduct(id, { nombre, precio, descripcion }) {
        await conection.query(
            "UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?",
            [nombre, precio, descripcion, id]
        );
        return { id, nombre, precio, descripcion };

    }
    static async deleteProduct(id) {
        try {
            const [result] = await conection.query(
                'DELETE FROM productos where id=?',
                [id]
            )
            return result
        } catch (e) {
            console.log(e)
            throw e
        }
    }
    static async getPhoneUser(pedidoId) {
  try {
    const [result] = await conection.query(
      `
      SELECT 
        u.id AS id,
        u.nombre AS usuario,
        u.phone AS telefono
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
      `,
      [pedidoId]
    );
    console.log(result)
    // Si no encuentra el pedido, devuelve null
    if (result.length === 0) return null;

    return result[0]; // Devuelve solo un usuario (el del pedido)
  } catch (e) {
    console.log("Error en getPhoneUser:", e);
    throw e;
  }
}
 static async setNotification (idUsuario, message){
    try{
        const [result] = await conection.query(
            'INSERT INTO notificaciones (usuario_id,mensaje) VALUES(?,?)',
            [idUsuario,message]
        )
        return result;
    }catch(e){
        console.log(e)  
    }
 }
}