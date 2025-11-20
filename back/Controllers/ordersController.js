import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { messager } from '../utils/messager.js';
dotenv.config();
export class OrdersController {
    constructor({ ordersModel, io }) {
        this.ordersModel = ordersModel;
        this.io = io
    }

    createProducto = async (req, res) => {
        try {
            const { nombre, descripcion, precio, disponible, ingredientes } = req.body;
            console.log(req.body)

            if (!nombre || !descripcion || !precio) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }
                console.log(nombre)
            // 1️⃣ Crear producto
            const newProduct = await this.ordersModel.createProducto({
                nombre,
                descripcion,
                precio,
                disponible
            });

            // 2️⃣ Obtener el ID del producto recién creado
            const idProduct = newProduct.insertId;

            // 3️⃣ Asociar ingredientes seleccionados
            if (ingredientes && ingredientes.length > 0) {
                for (const ingredienteId of ingredientes) {
                    const addIngretes = await this.ordersModel.addIngredientsToProduct(idProduct, ingredienteId);

                }

            }
            console.log()
            res.status(201).json({
                message: '✅ Producto creado correctamente',
                id: idProduct,
            });

        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({ message: error.message });
        }
    };


    addIngretes = async (req, res) => {
        try {
            const { name } = req.body;
            console.log(req.body);
            if (!name) {
                return res.status(400).json({ message: 'Name field is required' });
            }
            const newIngrete = await this.ordersModel.addIngretes({ name });
            res.status(201).json({ message: 'Ingrediente agregado correctamente', ingrediente: newIngrete });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    createCompleteOrder = async (req, res) => {
        try {
            const { clientId, productos } = req.body;
            console.log(req.body);
            const isValid = await this.ordersModel.isVerificate(clientId)
            if (isValid) {

                if (!clientId || !Array.isArray(productos) || productos.length === 0) {
                    return res.status(400).json({ message: 'clientId y productos son requeridos' });
                }

                for (const [index, producto] of productos.entries()) {
                    if (!producto.producto_id || !producto.cantidad) {
                        return res.status(400).json({ message: `Producto en índice ${index} sin producto_id o cantidad` });
                    }
                    if (typeof producto.cantidad !== 'number' || producto.cantidad <= 0) {
                        return res.status(400).json({ message: `Cantidad inválida en índice ${index}` });
                    }
                }

                const { pedidoId, total } = await this.ordersModel.createCompleteOrder({ clientId, productos });
                const ticket = await this.ordersModel.makeTicket({ pedidoId, montoTotal: total, pagado: 1 })

                res.status(201).json({ message: 'Pedido creado correctamente', pedidoId, total });
            } else {
                res.status(401).json({ message: 'Debes verificar tu cuenta antes de realizar un pedido' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    ordersInProgress = async (req, res) => {
        try {
            const orders = await this.ordersModel.getOrdersPending();
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    productos = async (req, res) => {
        try {
            const productos = await this.ordersModel.getAllProducts();
            res.status(200).json(productos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    ingredientes = async (req, res) => {
        try {
            const ingredientes = await this.ordersModel.getAllIngredients();
            res.status(200).json(ingredientes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }

    updateOrderStatus = async (req, res) => {
        try {
            const pedidoId = req.params.id;
            const { newState } = req.body;
            if (!newState) {
                return res.status(400).json({ message: 'Nuevo estado requerido' });
            }

            await this.ordersModel.updateOrderStatus({ pedidoId, newState });
            const user = await this.ordersModel.getPhoneUser(pedidoId)
            console.log(user)
            const message = `Su pedido con id #${pedidoId} cambio su estatus a ${newState}`
            const not = await this.ordersModel.setNotification(user.id, message)
            await messager(user.telefono, pedidoId, newState)
            this.io.emit("orderStatusChanged", {
                pedidoId,
                newState,
                telefono: user.telefono
            });



            res.status(200).json({ message: 'Estado de pedido actualizado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
    getTicketsByUserId = async (req, res) => {
        try {
             let token = req.cookies.access_token;
        
        // 2️⃣ Si no hay cookie, lee de Authorization header (móvil)
        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
        }
            console.log(token)
            const JWT_SECRET = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.id;
            const tickets = await this.ordersModel.getTicketsByUserId(userId);
            res.status(200).json(tickets);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
    getAllOrders = async (req, res) => {
        try {
            const orders = await this.ordersModel.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
    getProductosConIngredientes = async (req, res) => {
        try {
            const productos = await this.ordersModel.getProductosConIngredientes();
            res.status(200).json(productos);
        } catch (error) {
            console.error("Error al obtener productos con ingredientes:", error);
            res.status(500).json({ message: error.message });
        }
    };
    getIngredientesByProducto = async (req, res) => {
        const { id } = req.params; // ✅ corrección
        try {
            const ingredientes = await this.ordersModel.getIngredientesByProducto(id);
            console.log(ingredientes)

            if (ingredientes.length === 0) {
                return res.status(404).json({ message: "No se encontraron ingredientes para este producto" });
            }

            res.json(ingredientes);
        } catch (e) {
            console.error("Error al obtener ingredientes:", e); // ✅ corrección
            res.status(500).json({ message: "Error al obtener ingredientes del producto" });
        }
    };
    deleteProduct = async (req, res) => {
        const { idProd } = req.params;
        try {
            console.log(idProd)
            const deleteProduct = await this.ordersModel.deleteProduct(idProd)
            console.log(deleteProduct)
            res.status(200).json({ message: 'El producto ha sido eliminado' })
        } catch (e) {
            res.status(500).json({ message: 'Ha ocurrido un error al eliminarlo' })
            console.log(e)
        }
    }
    updateProduct = async (req, res) => {
        const { id } = req.params
        const { name, price, description } = req.body
        try {
            const [updatePro] = await this.ordersModel.updateProduct(id, { name, price, description })
            res.status(201).json({ message: 'El producto ha sido actualizado' })
        } catch (e) {
            res.status(500).json({ message: 'Ha ocurrido algun error al actualizar' })
            console.log(e)
        }
    }
    deletIngrediente = (req,res) => {
        try{
            const id = req.params
            const result = this.ordersModel.deleteIngrediente(id)
            console.log(result)
            res.status(200).json({message:"Este ingrediente ha sido eiminado"})

        }catch(e){
            res.status(500).json({message:"Ha sucedido algo inesperado"})
            console.log(e)
        }
    }
}
