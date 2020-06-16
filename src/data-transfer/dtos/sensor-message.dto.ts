/**
 * Obj mapped from sensor response and 
 * stringified for mqtt broker
 */
export interface SensorMessageDto {
    timestampUtc: Date;
    temperature: number;
    humidity: number;
}