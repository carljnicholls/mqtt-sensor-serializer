import { IMqttMessageHandler } from '../interfaces/services/handlers/i-mqtt-message-handler';
import { TempAndHumidityHandler } from './mqtt-handlers/temp-and-humidity-handler';
import { LoggerService } from './logger/logger-service';
import { GenericAggregator } from './aggregators/generic-aggregator';
import { SensorMessageDto } from '../data-transfer/dtos/sensor-message.dto';

/**
 * Constructs and provides implementations of `IMqttMessageHandler`
 */
export class MqttHandlerFactory {

    constructor( private readonly aggregator: GenericAggregator<SensorMessageDto>,
        private readonly logger: LoggerService) { }

    /**
     * Returns an implementation of `IMqttMessageHandler conditionally on the given key
     * @throws No implementation for key
     */
    public get(key: string): IMqttMessageHandler {

        switch(key.toLowerCase()){
            case 'dht22': {
                return new TempAndHumidityHandler(this.logger, this.aggregator);
            }
            default: 
                throw new Error(`Mqtt Message Handler for '${key}' does not exist.`);
        }
    }
}
