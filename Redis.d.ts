import { IDatabaseConfig, IDeleteResult, IQueryResult, IUpsertResult, KeyValueDatabase } from "@vesta/core";
export declare class Redis implements KeyValueDatabase {
    private connection;
    private config;
    constructor(config: IDatabaseConfig);
    connect(): Promise<KeyValueDatabase>;
    close(connection: any): Promise<boolean>;
    find<T>(key: number | string): Promise<IQueryResult<T>>;
    insert<T>(key: string, value: T): Promise<IUpsertResult<T>>;
    update<T>(key: string, value: T): Promise<IUpsertResult<T>>;
    remove(key: string): Promise<IDeleteResult>;
}
