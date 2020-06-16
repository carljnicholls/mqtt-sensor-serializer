import { LoggerService } from '../logger/logger-service';
import { ISerializer } from '../../interfaces/services/serializers/i-serializer';

export class GenericAggregator<T> {
    private readonly className: string = 'GenericAggregator';

    private readonly aggregationCount: number = 10;
    private _data: T[];

    constructor(
        private readonly serializer: ISerializer, 
        private readonly logger: LoggerService) {
        this._data = [];
    }

    /**
     * Adds `message` to a stack which is handed off to `ISerializer` 
     * if conditions met
     * @param message 
     */
    public async add(message: T): Promise<void> {
        try {
            this.logger.debug(`${this.className}.add`, message);

            this._data.push(message);
            await this.checkIfEqualToAggregateLength();

        } catch (error) {
            this.logger.error(`${this.className}.add.error`, error);
            throw error;
        }
    }

    /** 
     * TODO: 
     * Add Aggregation (remove results beyond deviation %)
     * Push to Queue prior to serialization
     */
    private async checkIfEqualToAggregateLength() {
        try {
            this.logger.debug(`${this.className}.checkIfEqualToAggregateLength`, { dataLength: this._data.length });

            if(this._data.length >= this.aggregationCount) {
                await this.serializer.write(this._data);
                this._data = [];
            }
            
        } catch (error) {
            this.logger.error(`${this.className}.checkIfEqualToAggregateLength.error.writingData`, error);
            throw error;
        }
    }
}