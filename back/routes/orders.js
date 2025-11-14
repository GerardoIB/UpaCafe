import { Router } from "express";
import { OrdersController } from "../Controllers/ordersController.js";


export const createRouterOrders = ({ordersModel,io})=>{
    const orderRouter = Router()


    const ordersController = new OrdersController({ordersModel,io})

    orderRouter.post('/createProduct', ordersController.createProducto)
    orderRouter.post('/addIngretes', ordersController.addIngretes)
    orderRouter.post('/createPedido', ordersController.createCompleteOrder)
    orderRouter.get('/pending', ordersController.ordersInProgress)
    orderRouter.get('/productos', ordersController.productos)
    orderRouter.patch('/updateOrderStatus/:id', ordersController.updateOrderStatus)
    orderRouter.get('/ingredientes', ordersController.ingredientes)
    orderRouter.get('/tickets/user/', ordersController.getTicketsByUserId)
    orderRouter.get('/allOrders', ordersController.getAllOrders)
    orderRouter.get('/productosConIngredientes', ordersController.getProductosConIngredientes);
    orderRouter.get("/productos/:id/ingredientes",ordersController.getIngredientesByProducto)
    orderRouter.delete('/delete/:idProd',ordersController.deleteProduct)
    orderRouter.patch('/update/:id',ordersController.updateProduct)



    
    return orderRouter   
    

    
}