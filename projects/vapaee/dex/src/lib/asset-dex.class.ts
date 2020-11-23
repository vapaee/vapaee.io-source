import BigNumber from 'bignumber.js';
import { TokenDEX } from './token-dex.class';
import { Asset, Token } from '@vapaee/scatter2';



export interface IVapaeeDEX {
    getTokenNow(symbol:string): TokenDEX;
}

export class AssetDEX extends Asset {
    amount:BigNumber;
    
    constructor(a: any = null, b: any = null) {
        super(a,b);

        if (a instanceof Asset) {
            this.amount = a.amount;
            this._token = new TokenDEX(a.token);
            return;
        }

        if (!!b && b['getTokenNow']) {
            this.parseDex(a,b);
        }

    }

    protected do_clone(): any {
        return new AssetDEX(this.amount, this.token);
    }

    plus(b:Asset) {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(!!b.token, "ERROR: b has no token", b, this.str);
        console.assert(!!this.token, "ERROR: this has no token", b, this);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to sum assets with different tokens: " + this.str + " and " + b.str);
        var amount = this.amount.plus(b.amount);
        return new AssetDEX(amount, this.token);
    }

    minus(b:Asset):Asset {
        console.assert(!!b, "ERROR: b is not an Asset", b, this.str);
        console.assert(!!b.token, "ERROR: b has no token", b, this.str);
        console.assert(!!this.token, "ERROR: this has no token", b, this);
        console.assert(b.token.symbol == this.token.symbol, "ERROR: trying to substract assets with different tokens: " + this.str + " and " + b.str);
        var amount = this.amount.minus(b.amount);
        return new AssetDEX(amount, this.token);
    }    

    parseDex(text: string, dex: IVapaeeDEX) {
        if (text == "") return;
        var sym = text.split(" ")[1];
        this._token = dex.getTokenNow(sym);
        if (!this.token) {
            this._token = new TokenDEX({symbol: sym});
        }
        /*if (this.token) {
            let tmp = new AssetDEX();
            this.token = tmp.token || <TokenDEX>{};
            console.assert(!!this.token, "ERROR: parsin assetDEX. Token unknown", text);
        }*/
        var amount_str = text.split(" ")[0];
        this.amount = new BigNumber(amount_str);
    }

    
    toString(decimals:number = -1): string {
        if (!this.token) return "0.0000";
        return this.valueToString(decimals) + " " + this.token.symbol.toUpperCase();
    }

    inverse(token: Token): Asset {
        var result = new BigNumber(1).dividedBy(this.amount);
        var asset =  new AssetDEX(result, token);
        return asset;
    }
}