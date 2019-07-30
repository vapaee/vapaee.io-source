import { Token } from '@vapaee/scatter';
import { AssetDEX } from "./asset-dex.class";

/*
export interface Token {
    symbol: string,
    precision?: number,
    contract?: string,
    appname?: string,
    website?: string,
    logo?: string,
    logolg?: string,
    verified?: boolean,
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
export class TokenDEX extends Token {
    // private _str: string;
    // private _symbol: string;
    // private _precision: number;
    // private _contract: string;

    public appname: string;
    public website: string;
    public logo: string;
    public logolg: string;
    public verified: boolean;
    public fake: boolean;
    public offchain: boolean;
    public scope: string;

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

    constructor(obj:any = null) {
        super(obj);
        if (typeof obj == "object") {
            delete obj.symbol;
            delete obj.precision;
            delete obj.contract;
            Object.assign(this, obj);
        }
        this.toString();
    }


}