import { Request } from 'express';

const allowedOrigins = ['localhost', '127.0.0.1', '::1'];

// I guess it works

const registerCorsMiddleware = (req: Request, callback: any) => {
    const requestOrigin = req.hostname
    
    if(requestOrigin && allowedOrigins.includes(requestOrigin)) {
        callback(null, { origin: true });
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

export default registerCorsMiddleware;