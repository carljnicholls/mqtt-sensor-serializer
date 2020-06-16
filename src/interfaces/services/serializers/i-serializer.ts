export interface ISerializer {
    write<T>(data: T[]): Promise<void>;
}