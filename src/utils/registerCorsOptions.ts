import cors from 'cors'

const registerCorsMiddleware: cors.CorsOptionsDelegate = (req, callback) => {
    const requestOrigin = req.headers.origin as string;

    if(requestOrigin && requestOrigin.startsWith('http://localhost')) {
        callback(null, { origin: true });
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

export default registerCorsMiddleware;