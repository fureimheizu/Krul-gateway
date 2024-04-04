import axios from 'axios';
import { ServiceInterface } from '../interfaces/serviceInterface';

const ServiceHealthCheck = (interval: number, services: ServiceInterface) => {
    setInterval(() => {
        checkService(services)
    }, interval)
}

const checkService = async (services: ServiceInterface) => {
    for (const serviceName in services) {
        let serviceUrl = `${services[serviceName].url}/health`;
        try {
            let response = await axios.get(serviceUrl);
            if (response.status >= 200 && response.status < 300) {
                console.log(`[SERVICE CHECK]: Service ${serviceName} is healthy.`);
                if (!services[serviceName].isHealthy) {
                    services[serviceName].isHealthy = true;
                }
                console.table(services);
            } else {
                console.log(`[SERVICE CHECK]: Service ${serviceName} is not healthy.`);
                if (services[serviceName].isHealthy) {
                    services[serviceName].isHealthy = false;
                }
                console.table(services);
            }
        } catch (error) {
            console.log(`[SERVICE CHECK]: Service ${serviceName} is not healthy (Not responding).`);
            if (services[serviceName].isHealthy) {
                services[serviceName].isHealthy = false;
            }
            console.table(services);
        }
    }
}

export default ServiceHealthCheck;