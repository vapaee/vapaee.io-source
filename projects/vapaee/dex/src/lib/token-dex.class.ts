
import { AssetDEX } from "./asset-dex.class";
import { Market } from './types-dex';
import { Token } from "@vapaee/scatter2";

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
    public icon: string;
    public iconlg: string;
    public tradeable: boolean | number;
    public currency: boolean;
    public offchain: boolean;
    public table: string;
    public data: TokenData[];
    public brief: string;
    public banner: string;
    public admin: string;

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
        cp.clear();
        cp.toString();
        return cp;
    }

    clear() {
        super.clear();
        delete this.summary;
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

    setSymbol(value: string) {
        this._symbol = value;
    }

    setPrecision(value: number) {
        this._precision = value;
    }

    setContract(value: string) {
        this._contract = value;
    }
}