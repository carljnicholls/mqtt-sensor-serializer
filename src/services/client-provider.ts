import { LoggerService } from './logger/logger-service';
import { IMqttClient } from '../interfaces/clients/mqtt-client';
import { MqttClient } from '../clients/mqtt/mqtt-client';
import { MqttHandlerFactory } from './mqtt-handler-factory';

export class ClientProvider {
    private readonly className: string = 'ClientProvider';
    private readonly mqttUrl = 'mqtt://localhost';

    private readonly topic = 'dht22';

    constructor(
        private readonly handlerFactory: MqttHandlerFactory,
        private readonly logger: LoggerService) {
    }

    /**
     * Returns all clients defined in config value `MQTT_CLIENTS`
     */
    public get(): IMqttClient[] {
        var result = MqttClient[0];
        try {
            this.logger.debug(`${this.className}.get`);

            const clients = process.env.MQTT_CLIENTS_JSON; 
            this.logger.debug(`${this.className}.get`, clients);

            if(clients == undefined || clients.trim().length === 0) {
                throw new Error(`Environment variable MQTT_CLIENTS_JSON is undefined`);
            }

            result = this.getClients();

        } catch (error) {
            this.logger.error(`${this.className}.get.error`, error);
            throw error;

        } finally {
            return result;
        }
    }

    private getClients(): MqttClient[] {
        try {
            var result: MqttClient[] = [];
            var result: MqttClient[] = [];
            // TODO: GET CLIENTS FROM CONFIG AND LOOP OVER THEM 
            const dhtClient = { url: this.mqttUrl, topic: this.topic };
            this.logger.debug(`${this.className}.get.dhtclient`, dhtClient);

            if (dhtClient == undefined){
                throw new Error(`No DHT22 MQTT client details in env`);
            }
            
            var client = new MqttClient(dhtClient.url, dhtClient.topic, this.handlerFactory, this.logger);
            result.push(client);

            return result;
        } catch (error) {
            throw error;
        }
    }
}