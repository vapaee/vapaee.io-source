import { Token } from '@vapaee/scatter';
import { AssetDEX } from "./asset-dex.class";
import { Market } from './types-dex';

/*
export interface Token {
    symbol: string,
    precision?: number,
    contract?: string,
    appname?: string,
    website?: string,
    logo?: string,
    logolg?: string,
    tradeable?: boolean,
    fake?: boolean,
    offchain?: boolean,
    scope?: string,
    stat?: {
        supply: string,
        max_supply: string,
        issuer?: string,
        owner?: string,
        issuers?: string[]
    },
    summary?: {
        volume: Asset,
        price: Asset,
        price_24h_ago: Asset,
        percent?:number,
        percent_str?:string
    }

}
*/



export interface TokenData {
    id:number,
    symbol: string,
    category: string,
    text: string,
    link: string,
    html?: string
}



export class TokenDEX extends Token {
    // private _str: string;
    // private _symbol: string;
    // private _precision: number;
    // private _contract: string;

    public appname: string;
    public website: string;
    public logo: string;
    public logolg: string;
    public tradeable: boolean;
    public fake: boolean;
    public offchain: boolean;
    public scope: string;

    public data?: TokenData[];
    public title?: string;
    public brief?: string;
    public banner?: string;

    stat?: {
        supply: string,
        max_supply: string,
        issuer?: string,
        owner?: string,
        issuers?: string[]
    };

    summary?: {
        volume: AssetDEX,
        price: AssetDEX,
        price_24h_ago: AssetDEX,
        percent?:number,
        percent_str?:string
    }
    
    markets: Market[];

    constructor(obj:any = null) {
        super(obj);
        if (typeof obj == "object") {
            delete obj.symbol;
            delete obj.precision;
            delete obj.contract;
            Object.assign(this, obj);
        }
        this.title = this.title || this.appname;
        this.toString();
    }


}