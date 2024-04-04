import express, { Request, Response } from 'express';
import { ServiceInterface } from './interfaces/serviceInterface';
import ServiceHealthCheck from './utils/serviceHealth';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import registerCorsMiddleware from './utils/registerCorsOptions';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.SERVICE_PORT || 5201;
const SERVICE_CHECK_INTERVAL = parseInt(process.env.SERVICE_HEARTBEAT_INTERVAL as string) || 60000;

const registeredServices: ServiceInterface = {};

app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use(async (req: Request, res: Response, next) => {
    const serviceName = req.path.split('/')[1];

    if (req.path === '/gateway-register-service') {
        next();
    } else if (!registeredServices[serviceName]) {
        return res.status(404).json({ status: 'error', message: 'Service not found.' })
    } else if (registeredServices[serviceName] && registeredServices[serviceName].isHealthy) {
        const serviceUrl = registeredServices[serviceName].url;

        try {
            const response = await axios({
                method: req.method,
                url: req.path,
                baseURL: serviceUrl,
                data: req.body,
                timeout: 20000,
                headers: req.headers
            })

            if (response && response.status) {
                res.status(response.status).json(response.data);
            } else {
                res.status(500).send({ status: 'error', message: 'Service unavailable.' });
            }
        } catch (error) {
            console.error("Error", error);
            res.status(500).send({ status: 'error', message: 'An error occurred while making the request.' });
        }
    } else {
        res.status(503).send({ status: 'error', message: 'Service is currently offline.' });
        return
    }
});

app.post('/gateway-register-service', cors(registerCorsMiddleware), (req: Request, res: Response) => {
    const { name, url } = req.body;
    registeredServices[name] = { url, isHealthy: true };
    res.status(200).json({
        status: 'success',
        message: `Service ${name} registered successfully.`
    });
    console.log(`[REGISTER]: Service ${name} registered with url ${url}.`);
});

app.listen(port, async () => {
    console.log(`Krul gateway started at port ${port}`);
    ServiceHealthCheck(SERVICE_CHECK_INTERVAL, registeredServices);
});