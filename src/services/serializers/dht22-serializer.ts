import { LoggerService } from '../logger/logger-service';
import * as sqlite3 from "sqlite3";
import { SensorMessageDto } from '../../data-transfer/dtos/sensor-message.dto';

export class Dht22Serializer {
    private readonly className: string = 'Dht22Serializer';
    private readonly insertIntoStatement = `INSERT INTO dhtreadings(temperature, humidity, currentdate, currentime, device) `;

    private db: sqlite3.Database | undefined;

    constructor(private readonly logger: LoggerService) {
    }

    /**
     * Writes a new `Dht22Readings` entity per table row in 
     * local sqlite3 db @ `/db/sensorData.db` 
     */
    public async write(data: SensorMessageDto[]): Promise<void> {
        const methodName = `${this.className}.write`;
        try {
            this.logger.debug(`${methodName}`, data);
            await this.writeMessage(data);
            
        } catch (error) {
            this.logger.error(`${methodName}.error`, error);
            throw error;
        }
    }

    /**
     * Writes new `Dht22Readings` entities
     * @param sensorMessage 
     */
    private async writeMessage(sensorMessage: SensorMessageDto[]): Promise<void> {
        const fnName = `${this.className}.writeMessage: ${sensorMessage}`;
        try {    
            this.logger.debug(`${fnName}`, sensorMessage);

            this.db = new sqlite3.Database(`./db/sensorData.db`);
            this.db.run(this.createInsertStatement(sensorMessage));
            this.db.close();

        } catch (error) {
            if(this.db != undefined) {
                this.db.close();
            }

            this.logger.error(`${fnName}.error`, error);
            throw error;
        }
    }

    private createInsertStatement(sensorMessages: SensorMessageDto[]): string {
        const sqlValueCmds: string[] = [];
        sensorMessages.forEach(sensorMessage => {
            const date = new Date(sensorMessage.timestampUtc.toString());
            const dateString = date.toISOString().substring(0,9);
            const timeString = date.toISOString().substring(11, 19); 

            sqlValueCmds.push(`(${sensorMessage.temperature}, ${sensorMessage.humidity}, "${dateString}", "${timeString}", "raspi")`);
            
        });
        
        const cmd = this.insertIntoStatement + 'VALUES' + sqlValueCmds.join(',') + ';';

        this.logger.debug(`${this.className}.formInsertStatement: ${cmd}`);
        return cmd;
    }
}