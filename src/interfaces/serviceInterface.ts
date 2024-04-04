export interface ServiceInterface {
    [key: string]: {
        url: string;
        isHealthy: boolean;
    };
}