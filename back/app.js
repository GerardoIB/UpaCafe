import express from 'express'
import dotenv  from 'dotenv'
import http from 'node:http'
import {Server as SocketServer} from 'socket.io'
import { createRouterOrders } from './routes/orders.js'
import { createRouter } from './routes/users.js'
import { ClientsModel } from './Models/clientsModel.js'
import { ordersModel } from './Models/ordersModel.js'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middelwares/cors.js'


dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server,{
    cors:{
        origin: "https://upa-cafe.vercel.app", // o el puerto de tu frontend
    credentials: true}
})
app.use(corsMiddleware)
app.use(cookieParser())
app.use(express.json())
app.use('/api/orders', createRouterOrders({ordersModel,io}))
app.use('/api/user',createRouter({ClientsModel,io}))

           
app.post("/hello",(req,res) => {
  const {name} = req.body
  res.json({message:'HelloWorld ' + name})
})

const PORT = process.env.PORT ?? 3001;

// Usa el servidor HTTP, no app.listen()
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Escuchar nuevas conexiones de sockets
io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});


