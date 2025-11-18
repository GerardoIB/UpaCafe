import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendVerificationEmail, sendResetPassword } from "../utils/mailer.js";
import { messager } from "../utils/messager.js";
import { error } from "qrcode-terminal";

dotenv.config();

export class clientsController {
    constructor({ ClientsModel, io }) {
        this.ClientsModel = ClientsModel
        this.io = io
    }

    createUser = async (req, res) => {
        try {
            const { email, password, name, phone } = req.body;
            console.log(req.body);
            
            if (!email || !password || !name || !phone) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            
            const rol = 3;
            const emailValidated = await this.ClientsModel.validateEmail(email);
            
            if (emailValidated) {
                return res.status(403).json({ message: 'This email has been registered' });
            }
            
            const newUser = await this.ClientsModel.createUser({ email, password, name, rol, phone });
            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email, nombre: name, rol_id: rol, phone: phone },
                JWT_SECRET,
                { expiresIn: '2h' }
            );
            
            console.log('Generated Token:', token);
            
            // 1️⃣ Enviar cookie (para desktop)
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 2 * 60 * 60 * 1000
            });
            
            await sendVerificationEmail(email, newUser.token);
            
            // 2️⃣ TAMBIÉN enviar en JSON (para móvil)
            return res.status(201).json({
                message: 'User created successfully',
                token: token,
                userId: newUser.id,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    nombre: name,
                    rol_id: rol,
                    phone: phone
                }
            });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    login = async (req, res) => {
        console.log(req.body);
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            
            const user = await this.ClientsModel.login({ email, password });
            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h' });
            
            console.log('Generated Token:', token);
            
            // 1️⃣ Enviar cookie (para desktop)
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 2 * 60 * 60 * 1000
            });
            
            // 2️⃣ TAMBIÉN enviar en JSON (para móvil)
            return res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    nombre: user.nombre,
                    rol_id: user.rol_id,
                    phone: user.phone
                }
            });
            
        } catch (error) {
            res.status(403).json({ message: error.message });
            console.error(error);
        }
    }

    verifyToken = (req, res) => {
        // 1️⃣ Primero intenta leer de cookie (desktop)
        let token = req.cookies.access_token;
        
        // 2️⃣ Si no hay cookie, lee de Authorization header (móvil)
        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
        }
        
        const JWT_SECRET = process.env.JWT_SECRET;
        console.log('Token verificado desde:', req.cookies.access_token ? 'Cookie' : 'Header');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            res.json({ user: decoded });
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    logout = (req, res) => {
    try {
        // 1️⃣ Limpiar cookie (desktop)
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/' // 🆕 Asegurar que limpia desde la raíz
        });
        
        console.log('✅ Cookie cleared successfully');
        
        // 2️⃣ El frontend limpiará localStorage (móvil)
        res.status(200).json({ 
            message: 'Logout successful',
            success: true 
        });
    } catch (error) {
        console.error('❌ Error in logout:', error);
        res.status(500).json({ 
            message: 'Logout failed',
            success: false 
        });
    }
}

    deleteWorker = async (req, res) => {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            await this.ClientsModel.deleteWoroker(userId);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    deleteAdmin = async (req, res) => {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            await this.ClientsModel.deleteAdmin(userId);
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    removeAcount = async (req, res) => {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            await this.ClientsModel.deleteAcount(userId);
            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    orders = async (req, res) => {
        try {
            const userId = req.params.id;
            const orders = await this.ClientsModel.getOrders(userId);
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    details = async (req, res) => {
        try {
            const orderId = req.params.id;
            const details = await this.ClientsModel.detalle(orderId);
            console.log(details);
            res.status(200).json(details);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    validar = async (req, res) => {
        try {
            const { token } = req.query;

            if (!token) {
                return res.status(400).json({ message: 'Verification token is required' });
            }
            
            const user = await this.ClientsModel.acountVerification(token);
            console.log(token);
            res.status(200).json({ message: 'Account verified successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    createAdmin = async (req, res) => {
        try {
            const { email, password, name, phone } = req.body;
            
            if (!email || !password || !name || !phone) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            
            const rol = 1;
            const newUser = await this.ClientsModel.createAdmin({ email, password, name, rol, phone });
            console.log(newUser);
            
            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign(
                { id: newUser.id, email: email, nombre: name, rol_id: rol, phone: phone },
                JWT_SECRET,
                { expiresIn: '2h' }
            );
            
            await sendVerificationEmail(email, newUser.token);
            
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 2 * 60 * 60 * 1000
            });

            return res.status(201).json({
                message: 'Admin created successfully',
                token: token,
                userId: newUser.id
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    createWorker = async (req, res) => {
        try {
            const { email, password, name, phone, rol_id } = req.body;
            
            if (!email || !password || !name || !phone || !rol_id) {
                return res.status(400).json({ message: 'All fields are required' });
            }
           
            const validateEmail = await this.ClientsModel.validateEmail(email);
            
            if (validateEmail) {
                return res.status(400).json({ message: 'This email has been registered' });
            }
            
            const newUser = await this.ClientsModel.createWorker({ email, password, name, rol_id, phone });
            await sendVerificationEmail(email, newUser.token);
            
            return res.status(201).json({
                message: 'Worker created successfully',
                userId: newUser.id
            });

        } catch (error) {
            res.status(500).json({ message: 'Unexpected error occurred' });
            console.error(error);
        }
    }

    getWorkers = async (req, res) => {
        try {
            const workers = await this.ClientsModel.getAllWorkers();
            res.status(200).json(workers);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    getAdmins = async (req, res) => {
        try {
            const admins = await this.ClientsModel.getAllAdmins();
            res.status(200).json(admins);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    getStats = async (req, res) => {
        try {
            const data = await this.ClientsModel.getStats();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error en adminController.getStats:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas' });
        }
    }

    allUsers = async (req, res) => {
        try {
            const users = await this.ClientsModel.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }

    getNot = async (req, res) => {
        const { id } = req.params;
        try {
            const notificaciones = await this.ClientsModel.getNotificationsById(id);
            console.log(notificaciones);
            res.status(200).json(notificaciones);
        } catch (e) {
            res.status(500).json({ message: 'algo ha salido mal' });
            console.log(e);
        }
    }

    updateStatusNot = async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await this.ClientsModel.updateStatusNot(id);
            res.status(200).json({ message: 'han sido leidas' });
        } catch (e) {
            res.status(500).json({ message: 'Algo ha salido mal' });
            console.log(e);
        }
    }

    updatePassword = async (req, res) => {
        const { email, password } = req.body;
        const isVerificate = await this.ClientsModel.isVerificate(email);
        
        if (isVerificate) {
            try {
                console.log(email, password);
                const result = await this.ClientsModel.updatePassword(email, password);
                console.log(result);
                res.status(200).json({ message: 'ha sido actualizada' });
            } catch (e) {
                res.status(500).json({ message: 'Algo ha salido mal' });
                console.log(e);
            }
        } else {
            res.status(401).json({ message: "Debes estar verificado" });
        }
    }

    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            console.log(req.body);

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const user = await this.ClientsModel.validateEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'This email is not registered' });
            }

            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign(
                { id: user.id, email },
                JWT_SECRET,
                { expiresIn: '15m' }
            );

            await sendResetPassword(email, token);
            return res.status(200).json({ message: 'Reset link sent to your email' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Unexpected error sending reset email' });
        }
    };

    resetPassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ message: 'Token and new password are required' });
            }

            const JWT_SECRET = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log(decoded);

            const result = await this.ClientsModel.updatePassword(decoded.email, newPassword);
            console.log(result);

            return res.status(200).json({ message: 'Password updated successfully' });

        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
    };
    updateWorker = async (req,res) => {
            const {id} = req.params
            const {nombre, phone, rol_id, email} = req.body
            try{
                const result = await this.ClientsModel.updateWorker(id,phone,nombre,email,rol_id)
                console.log(req.body)
                console.log(result)
                res.status(200).json({message:"El usuario ha sido actualizado"})
            }catch(error){
                res.status(500).json({message:"Algo inesperado ha ocurrido"})
                console.log(error)
            }
    }
}