import { DotenvConfigOutput } from 'dotenv/types';
import { LoggerService } from './services/logger/logger-service';
import { ClientProvider } from './services/client-provider';
import { IMqttClient } from './interfaces/clients/mqtt-client';

/**
 * Asynchronous Starting Point for Application
 */
export class App {
    private readonly className = 'App';

    private clients: IMqttClient[];

    constructor(
        private readonly clientProvider: ClientProvider, 
        config: DotenvConfigOutput | undefined,
        private readonly logger: LoggerService, 
    ) {
        if(config === undefined) throw new Error('Env variables are undefined');
        if(config.error) throw config.error;
        this.clients = [];
    }

    /**
     * The Asynchronous Entry Point for the Application
     * @param args string array of arguments. 
     * First is command, anything after is omitted or used as additional params 
     */
    public async Run(args: string[]): Promise<void> { 
        try{
            this.logger.debug(`${this.className}.Run`, args);

            this.clients = this.clientProvider.get();

        } catch(error) {
            this.logger.error('Application Error Catch: ', error);

            this.clients.forEach(client => {
                client.dispose();
            });
            
        } finally {
            this.logger.debug('App.Run() - finish', args);
        }
    }
}