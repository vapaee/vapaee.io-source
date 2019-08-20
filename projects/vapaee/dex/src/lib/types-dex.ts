import { TokenDEX } from "./token-dex.class";
import { AssetDEX } from "./asset-dex.class";

export interface MarketMap {
    [key:string]: Market;
}

export interface Market {
    scope: string;
    commodity: TokenDEX,
    currency: TokenDEX,
    deals: number;
    blocks: number;
    direct: number;
    inverse: number;
    blocklevels: any[][][];
    blocklist: any[][];
    reverselevels: any[][][];
    reverseblocks: any[][];
    block: {[id:string]:HistoryBlock};
    orders: TokenOrders;
    history: HistoryTx[];
    tx: {[id:string]:HistoryTx};
    
    summary: MarketSummary;
    header: MarketHeader;
}


export interface MarketSummary {
    scope:string,
    price:AssetDEX,
    inverse:AssetDEX,
    price_24h_ago:AssetDEX,
    inverse_24h_ago:AssetDEX,
    min_price?:AssetDEX,
    max_price?:AssetDEX,
    min_inverse?:AssetDEX,
    max_inverse?:AssetDEX,
    volume:AssetDEX,
    amount?:AssetDEX,
    percent?:number,
    percent_str?:string,
    ipercent?:number,
    ipercent_str?:string,
    records?: any[]
}

export interface MarketHeader {
    sell:OrdersSummary,
    buy:OrdersSummary
}

export interface OrdersSummary {
    total: AssetDEX;
    orders: number;    
}

export interface TokenOrders {
    sell:OrderRow[],
    buy:OrderRow[]
}

export interface HistoryTx {
    id: number;
    str: string;
    price: AssetDEX;
    inverse: AssetDEX;
    amount: AssetDEX;
    payment: AssetDEX;
    buyfee: AssetDEX;
    sellfee: AssetDEX;
    buyer: string;
    seller: string;
    date: Date;
    isbuy: boolean;
}

export interface EventLog {
    id: number;
    user: string;
    event: string;
    params: string;
    date: Date;
    processed?: any;
}

export interface HistoryBlock {
    id: number;
    hour: number;
    str: string;
    price: AssetDEX;
    inverse: AssetDEX;
    entrance: AssetDEX;
    max: AssetDEX;
    min: AssetDEX;
    volume: AssetDEX;
    amount: AssetDEX;
    date: Date;
}

export interface Order {
    id: number;
    price: AssetDEX;
    inverse: AssetDEX;
    total: AssetDEX;
    deposit: AssetDEX;
    telos: AssetDEX;
    owner: string;
}

export interface UserOrdersMap {
    [key:string]: UserOrders;
}

export interface UserOrders {
    table: string;
    ids: number[];
    orders?:any[];
}

export interface OrderRow {
    str: string;
    price: AssetDEX;
    orders: Order[];
    inverse: AssetDEX;
    total: AssetDEX;
    sum: AssetDEX;
    sumtelos: AssetDEX;
    telos: AssetDEX;
    owners: {[key:string]:boolean}
}