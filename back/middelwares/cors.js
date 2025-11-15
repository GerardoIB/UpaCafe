import cors from 'cors'
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5174',
    'https://upa-cafe.vercel.app'
]
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};
export const corsMiddleware = cors(corsOptions);