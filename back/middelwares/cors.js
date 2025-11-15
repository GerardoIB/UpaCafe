import cors from 'cors';

// TEMPORAL: Acepta todos los orígenes
app.use(cors({
    origin: true,  // Acepta cualquier origin
    credentials: true
}));

// Socket.io
const io = new Server(server, {
    cors: {
        origin: true,  // Acepta cualquier origin
        credentials: true
    }
});