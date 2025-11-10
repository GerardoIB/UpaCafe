import { Router } from "express";
import { clientsController } from '../Controllers/ClientsController.js'
export const createRouter = ({ClientsModel,io})=>{
    const userRouter = Router()

    const userController = new clientsController({ClientsModel})

     /*userRouter.post('/register',userController.createUser)
    userRouter.post('/login',userController.login)
    userRouter.get('/protected',userController.verifyToken)
    userRouter.delete('/removeUser/:id',userController.removeAcount)
    userRouter.post('/logout',userController.logout)
    userRouter.delete('/removeWorker/:id',userController.deleteWorker)
    userRouter.delete('/removeAdmin/:id',userController.deleteAdmin)
    userRouter.get('/orders/:id',userController.orders)
    userRouter.get('/:id/detalle',userController.details)
    userRouter.get('/verificar',userController.validar)
    userRouter.post('/createAdmin',userController.createAdmin)
    userRouter.post('/createWorker',userController.createWorker)
    userRouter.get('/getWorkers', userController.getWorkers)
    userRouter.get('/getAdmins', userController.allUsers)
    userRouter.get('/getStats', userController.getStats )
    userRouter.get('/notificaciones/:id', userController.getNot)
    userRouter.get('/readNotifiactions/:id', userController.updateStatusNot)
    userRouter.patch('/updatePassword',userController.updatePassword)
    */
   userRouter.post('/register', userController.create)
   

    return userRouter
    

    

    
}