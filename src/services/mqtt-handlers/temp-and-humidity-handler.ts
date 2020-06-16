import { Packet } from 'mqtt';
import { LoggerService } from '../logger/logger-service';
import { BaseMqttHandler } from './base-mqtt-handler';
import { GenericAggregator } from '../aggregators/generic-aggregator';
import { SensorMessageDto } from '../../data-transfer/dtos/sensor-message.dto';

export class TempAndHumidityHandler extends BaseMqttHandler { 

    constructor(protected readonly logger: LoggerService, 
        private readonly aggregator: GenericAggregator<SensorMessageDto>) {
        super(logger); 
        this.className = 'TempAndHumidityHandler';
    }
    
    /** 
     * Converts the payload from JSON and passes to the data aggregator
     */
    public async onMessage(topic: string, payload: Buffer, packet: Packet): Promise<void> {
        const fnName = `${this.className}.onMessage`
        try {
            const sensorMessage = JSON.parse(payload.toString()) as SensorMessageDto; 
            this.logger.debug(`${fnName}: ${JSON.stringify(sensorMessage)}`, sensorMessage);

            await this.aggregator.add(sensorMessage);

        } catch (error) {
            this.logger.error(`${fnName}.error`, error);
            throw error;
        }
    }
}