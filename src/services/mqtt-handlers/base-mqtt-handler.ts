import { LoggerService } from '../logger/logger-service';
import { IMqttMessageHandler } from '../../interfaces/services/handlers/i-mqtt-message-handler';
import { Client, Packet } from 'mqtt';

export abstract class BaseMqttHandler implements IMqttMessageHandler {
    protected className: string = 'BaseMqttHandler';

    constructor(protected readonly logger: LoggerService) { }

    /**
     * To be implemented
     * @param topic mqtt topic of subscription
     * @param payload Buffer of data
     * @param packet 
     */
    public abstract onMessage(topic: string, payload: Buffer, packet: Packet): Promise<void> ;

    /**
     * Logs the error and does not rethrow
     * @param error 
     */
    public async onError(error: Error): Promise<void> {
        this.logger.error(`${this.className}.onError`, error);
    }

    /**
     * Logs the event and ends the connection on the client
     */
    public async onDisconnect(client: Client): Promise<void> {
        this.logger.debug(`${this.className}.onDisconnect`, client);
        client.end();
    }
}
