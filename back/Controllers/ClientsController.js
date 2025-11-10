import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/mailer.js";
import { messager } from "../utils/messager.js";

dotenv.config();




export class clientsController {
    constructor({ ClientsModel,io }) {
        this.ClientsModel = ClientsModel
        this.io = io
    }
    /*
   createUser = async (req, res) => {
        try {
            const { email, password, name, phone } = req.body;
            console.log(req.body);
            if (!email || !password || !name || !phone) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const rol = 3
            const emailValidated = await this.ClientsModel.validateEmail(email)
            if (emailValidated) {
                res.status(403).json({ message: 'This email have been registred' })
            } else {
                const newUser = await this.ClientsModel.createUser({ email, password, name, rol, phone });
                const JWT_SECRET = process.env.JWT_SECRET;
                const token = jwt.sign({ id: newUser.id, email: newUser.email, nombre: name, rol_id: rol, phone: phone }, JWT_SECRET, { expiresIn: '2h' });
                console.log('Generated Token:', token);
                res.cookie('access_token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
                await sendVerificationEmail(email, newUser.token);
                res.status(201).json({ message: 'User created successfully', userId: newUser.id, verificationToken: newUser.token });
            }
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
            const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h', })
            console.log('Generated Token:', token);
            res.cookie('access_token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
            res.status(200).json({ message: 'Login successful', token });


        } catch (error) {
            res.status(403).json({ message: error.message });
            console.error(error);
        }
    }
    verifyToken = (req, res) => {
        const token = req.cookies.access_token
        const JWT_SECRET = process.env.JWT_SECRET
        if (!token) {
            return res.status(401).json({ message: 'No token provided' })
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET)

            req.user = decoded

            res.json({ user: decoded })
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }
    }
    logout = (req, res) => {
        res.clearCookie('access_token', { httpOnly: true, secure: false, sameSite: 'lax' });
        res.status(200).json({ message: 'Logout successful' });
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
            const user = await this.ClientsModel.acountVerification(token)
            console.log(token)
            res.status(200).json({ message: 'Account verified successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    }
    createAdmin = async (req, res) => {
        try {

            const { email, password, name, phone } = req.body
            if (!email || !password || !name || !phone) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const rol = 1
            const newUser = await this.ClientsModel.createAdmin({ email, password, name, rol, phone });
            console.log(newUser);
            const JWT_SECRET = process.env.JWT_SECRET;
            const token = jwt.sign({ id: newUser.id, email: email, nombre: name, rol_id: rol, phone: phone }, JWT_SECRET, { expiresIn: '2h' });
            console.log(newUser)

            await sendVerificationEmail(email, newUser.token);
            res.cookie('access_token', token, { httpOnly: true, secure: false, sameSite: 'lax' })

            res.status(201).json({ message: 'Admin created successfully', userId: newUser.id });

        } catch (rror) {
            res.status(500).json({ message: rror.message });
            console.error(rror);

        }
    }
    createWorker = async (req, res) => {
        try {
            const { email, password, name, phone } = req.body;
            if (!email || !password || !name || !phone) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const rol = 2
            const validateEmail = await this.ClientsModel.validateEmail(email)
            if (validateEmail) {

                res.status(400).json({ message: 'This email have been regitred' })

            } else {
                const newUser = await this.ClientsModel.createWorker({ email, password, name, rol, phone });

                await sendVerificationEmail(email, newUser.token);
                res.status(201).json({ message: 'Worker created successfully', userId: newUser.id, verificationToken: newUser.token });

            }

        } catch (error) {
            res.status(500).json({ message: 'Ocurrio un error inesperado' });
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
        const { id } = req.params
        try {
            const notificaciones = await this.ClientsModel.getNotificationsById(id)
            console.log(notificaciones)
            res.status(200).json(notificaciones)
        }
        catch (e) {
            res.status(500).json({ message: 'algo ha salido mal' })
            console.log(e)
        }
    }
    updateStatusNot = async (req, res) => {
        const { id } = req.params
        try{
            const [result ] = await this.ClientsModel.updateStatusNot(id)
            res.status(200).json({message:'han sido leidas'})
        }catch(e){
            res.status(500).json({message:'Algo ha salido mal'})
            console.log(e)
        }
    }
    updatePassword = async (req, res) => {
        const { email, password} = req.body

        try{
            console.log(email,password)
            const result = await this.ClientsModel.updatePassword(email,password)
            console.log(result)
            res.status(200).json({message:'ha sido actualizada'})
        }catch(e){
            res.status(500).json({message:'Algo ha salido mal'})
            console.log(e)
        }
    }
        */
      create = async (req,res) => {
     try {
       const { pkPhone, name, firstName, lastName, gender, birthday, password } = req.body;

       // Required fields check
       if (!pkPhone || !name || !firstName || !lastName || !gender || !birthday || !password) {
         return res.status(400).json({ message: 'All fields are required: pkPhone, name, firstName, lastName, gender, birthday, password' });
       }

       // Basic types and formats
       const phoneStr = String(pkPhone).trim();
       if (!/^\+?\d{7,15}$/.test(phoneStr)) {
         return res.status(400).json({ message: 'pkPhone must be a phone number with 7-15 digits, optional leading +' });
       }

       if (typeof name !== 'string' || name.trim().length === 0 ||
           typeof firstName !== 'string' || firstName.trim().length === 0 ||
           typeof lastName !== 'string' || lastName.trim().length === 0) {
         return res.status(400).json({ message: 'name, firstName and lastName must be non-empty strings' });
       }

       const allowedGenders = ['male','female','other','m','f','o','Male','Female','Other'];
       if (!allowedGenders.includes(String(gender))) {
         return res.status(400).json({ message: `gender must be one of: ${allowedGenders.join(', ')}` });
       }

       // Validate birthday (ISO yyyy-mm-dd or any parsable date)
       const parsedDate = Date.parse(birthday);
       if (Number.isNaN(parsedDate)) {
         return res.status(400).json({ message: 'birthday must be a valid date (e.g. YYYY-MM-DD)' });
       }

       if (typeof password !== 'string' || password.length < 6) {
         return res.status(400).json({ message: 'password must be at least 6 characters long' });
       }

       // Create user via model
       const payload = {
         pkPhone: phoneStr,
         name: name.trim(),
         firstName: firstName.trim(),
         lastName: lastName.trim(),
         gender: String(gender).trim(),
         birthday: new Date(parsedDate).toISOString().split('T')[0],
         password
       };

       const result = await this.ClientsModel.createuser(payload);

       // If model returns result with insertId or similar
       if (result && result.insertId) {
         return res.status(201).json({ message: 'User created', id: result.insertId });
       }

       // Otherwise return generic success
       return res.status(201).json({ message: 'User created', result });

     } catch (err) {
       // handle duplicate entry from DB
       if (err && err.code === 'ER_DUP_ENTRY') {
         return res.status(409).json({ message: 'Duplicate entry (phone or user already exists)' });
       }
       console.error(err);
       return res.status(500).json({ message: 'Unexpected error creating user' });
     }
   }

}