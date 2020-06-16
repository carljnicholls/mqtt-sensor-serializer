import { config } from 'dotenv';
import { LoggerService } from "./services/logger/logger-service";

import { App } from "./app";
import { ClientProvider } from './services/client-provider';
import { GenericAggregator } from './services/aggregators/generic-aggregator';
import { Dht22Serializer } from './services/serializers/dht22-serializer';
import { MqttHandlerFactory } from './services/mqtt-handler-factory';
import { SensorMessageDto } from './data-transfer/dtos/sensor-message.dto';
import { ISerializer } from './interfaces/services/serializers/i-serializer';

// Set up dependencies 
const env = config();
const logger = new LoggerService();  
const args = process.argv.slice(2);

const serializer = new Dht22Serializer(logger); 
const aggregator = new GenericAggregator<SensorMessageDto>(serializer as ISerializer, logger)
const mqttHandlerFactory = new MqttHandlerFactory(aggregator, logger);
const clientProvider = new ClientProvider(mqttHandlerFactory, logger);

const app = new App(clientProvider, env, logger);

// Execute App
app.Run(args)
    .catch((ex) => {
        logger.error(ex);
    });

