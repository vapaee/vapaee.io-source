import { Token } from '@vapaee/scatter';
import { AssetDEX } from "./asset-dex.class";
import { Market } from './types-dex';

export interface TokenData {
    id:number,
    symbol: string,
    category: string,
    text: string,
    link: string,
    date: Date,
    html?: string,
    editing?: boolean,
}

export interface TokenEvent {
    event: string,
    receptor: string,
    editing?: boolean,
    new?: boolean
}

export class TokenDEX extends Token {

    public title: string;
    public website: string;
    public logo: string;
    public logolg: string;
    public tradeable: boolean | number;
    public currency: boolean;
    public banned: boolean;
    public offchain: boolean;
    public scope: string;
    public data: TokenData[];
    public brief: string;
    public banner: string;
    public owner: string;

    stat?: {
        supply: string,
        max_supply: string,
        issuer?: string
    };

    summary?: {
        volume: AssetDEX,
        price: AssetDEX,
        price_24h_ago: AssetDEX,
        percent?:number,
        percent_str?:string
    }
    
    events: TokenEvent[] = [];

    markets: Market[] = [];

    constructor(obj:any = null) {
        super(obj);
        if (obj && typeof obj == "object") {
            delete obj.symbol;
            delete obj.precision;
            delete obj.contract;
            Object.assign(this, obj);
        }
        this.toString();
    }

    basecopy(): TokenDEX {
        var cp = new TokenDEX(this);

        cp.markets = [];
        cp.events = [];
        cp.stat = Object.assign({}, this.stat);
        delete cp.summary;
        delete cp._str;
        cp.toString();
        return cp;
    }

    serialize(): any {
        var cp:any = Object.assign({}, this);
        delete cp._symbol;
        delete cp._contract;
        delete cp._precision;
        cp.symbol = this.symbol;
        cp.contract = this.contract;
        cp.precision = this.precision;
        cp.markets = [];
        cp.events = [];
        cp.stat = Object.assign({}, this.stat);
        return cp;
    }
}

export class ETokenDEX extends TokenDEX {

    constructor(obj:any = null) {
        super(obj);
    }

    set symbol(value: string) {
        this._symbol = value;
    }

    set precision(value: number) {
        this._precision = value;
    }

    set contract(value: string) {
        this._contract = value;
    }

    get symbol() { return this._symbol; }
    get precision() { return this._precision; }
    get contract() { return this._contract; }    
    
}