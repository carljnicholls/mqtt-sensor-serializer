import * as mqtt from "mqtt";
import { LoggerService } from '../../services/logger/logger-service';
import { MqttHandlerFactory } from '../../services/mqtt-handler-factory';
import { IMqttMessageHandler } from '../../interfaces/services/handlers/i-mqtt-message-handler';
import { IMqttClient } from '../../interfaces/clients/mqtt-client';

export class MqttClient implements IMqttClient {
    private readonly className = 'MqttClient';

    private _client: mqtt.Client; 
    private _messageHandler: IMqttMessageHandler; 

    constructor(
        readonly url: string, 
        private readonly topic: string,
        private readonly handlerFactory: MqttHandlerFactory,
        private readonly logger: LoggerService) {
            this._messageHandler = this.handlerFactory.get(topic);
            this._client = mqtt.connect(url);

            this.setupSubscriptions(url);
    }    
    
    /**
     * End the client connection
     */
    public dispose(): void {
        this._client.end();
    }

    private setupSubscriptions(url: string): void {
        this._client.on('connect', () => {
            this._client.subscribe(this.topic, () => {
                this.logger.debug(`${this.className}.connected `, url);
            });

            try {
                this._client.on('message', async (topic: string, payload: Buffer, packet: mqtt.Packet) => {
                    try {
                        this.logger.debug(`${this.className}.on.message.topic: ${topic}`,);
                        await this._messageHandler.onMessage(topic, payload, packet);
    
                    } catch (error) {
                        this.logger.error(`${this.className}.on.message.error`, error)
                        // no rethrow 
                    }
                });
                
                this._client.on('error', async (error: Error) => await this._messageHandler.onError(error));
    
                this._client.on(`disconnect`, async () => await this._messageHandler.onDisconnect(this._client));
                
            } catch (error) {
                this.logger.error(`${this.className}.on.connect.error`, error)
            }
        });
    }
}