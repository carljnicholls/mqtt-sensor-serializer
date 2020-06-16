import { Packet, Client } from 'mqtt';

export interface IMqttMessageHandler {
    
    /**
     * onMessage event handler fn
     */
    onMessage(topic: string, payload: Buffer, packet: Packet): Promise<void>;

        /**
     * onError event handler fn
     */
    onError(error: Error): Promise<void>;

        /**
     * onDisconnect event handler fn
     */
    onDisconnect(client: Client): Promise<void>
}