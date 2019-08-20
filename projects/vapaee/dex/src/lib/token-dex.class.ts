import { Token } from '@vapaee/scatter';
import { AssetDEX } from "./asset-dex.class";
import { Market } from './types-dex';

export interface TokenData {
    id:number,
    symbol: string,
    category: string,
    text: string,
    link: string,
    html?: string
}



export class TokenDEX extends Token {

    public appname: string;
    public website: string;
    public logo: string;
    public logolg: string;
    public tradeable: boolean;
    public banned: boolean;
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