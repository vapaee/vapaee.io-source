import { VapaeeScatter } from "./scatter.service";
export interface TableParams {
    contract?: string;
    scope?: string;
    table_key?: string;
    lower_bound?: string;
    upper_bound?: string;
    limit?: number;
    key_type?: string;
    index_position?: string;
}
export interface TableResult {
    more: boolean;
    rows: any[];
}
export declare class SmartContract {
    contract: string;
    scatter: VapaeeScatter;
    constructor(contract?: string, scatter?: VapaeeScatter);
    excecute(action: string, params: any): Promise<any>;
    getTable(table: string, params?: TableParams): Promise<TableResult>;
}
