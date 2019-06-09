import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Asset, VapaeeService } from '../services/vapaee.service';
import { Token } from '../services/utils.service';
import { CookieService } from 'ngx-cookie-service';



export interface StringMap {[key:string]: string};

export interface PriceMap {
    [key:string]: {
        price: number;
        token: Token;
    };
}

export interface SimplePriceMap {
    [key:string]: number;
}


@Injectable()
export class VpeComponentsService {

    public onResize:Subject<any[][]> = new Subject();
    public onPricesUpdate:Subject<PriceMap> = new Subject();
    public onTokenPricesUpdate:Subject<PriceMap> = new Subject();
    prices: PriceMap;
    public currencies: Token[];
    tokens_prices: PriceMap;
    current: string;

    constructor(
        private vapaee: VapaeeService,
        public cookie: CookieService
    ) {
        this.prices = {};
        this.currencies = [];
        this.tokens_prices = {};
        this.current = this.cookie.get("fiat") || "usd";
    }

    // Getters ------------------------------------
    get currency() {
        // var token = this.prices[this.current] ? this.prices[this.current].token : new 
        if (this.prices[this.current]) {
            return this.prices[this.current].token;
        } else {
            return {appname:""};
        }
    }

    // enter events ------------------------------
    public windowHasResized(e) {
        this.onResize.next(e);
    }

    public setTelosPrices(prices:PriceMap) {
        this.prices = prices;
        this.currencies = [];
        for (var i in this.prices) {
            var token:Token = this.prices[i].token;
            this.currencies.push(token);
        }
        this.onPricesUpdate.next(this.prices);
        this.cacheTIC = {};
        // console.log("VpeComponentsService.setTelosPrices() ------------------->", this.prices);
    }

    public setTokensPrices(prices:PriceMap) {
        this.tokens_prices = prices;
        this.onTokenPricesUpdate.next(this.tokens_prices);
        this.cacheTIC = {};
        // console.log("VpeComponentsService.setTokensPrices() ------------------->", this.tokens_prices);
    }

    // Change State -----------------------------------
    setCurrentCurrency(currency:string) {
        this.current = currency;
        this.cookie.set("fiat", currency);
        this.setTelosPrices(this.prices);
    }

    // Quesries -----------------------------------
    cacheTIC:any = {};
    public getTelosInCurrentCurrency(value: Asset | string) {
        var asset: Asset;
        if (value == "") return new Asset();
        if (value instanceof Asset) {
            asset = value;
            value = asset.toString();
        }
        if (typeof value == "string") {
            if (this.cacheTIC[value]) return this.cacheTIC[value];
            asset = new Asset(value, this.vapaee);
        }
        
        var cur_price = this.getCurrentPrice();
        var amount = asset.amount.toNumber();
        // console.log("*********** VpeComponentsService.getTelosInCurrentCurrency() amount", amount, "cur_price", cur_price);
        var number = amount * cur_price;
        asset = new Asset(number, this.getCurrentToken());
        this.cacheTIC[value] = asset;
        return asset;
    }

    public getTokenInCurrentCurrency(value: Asset | string) {
        var asset: Asset;
        var telos: Asset;
        if (value == "") return new Asset();
        if (value instanceof Asset) {
            asset = value;
            value = asset.toString();
        }
        if (typeof value == "string") {
            if (this.cacheTIC[value]) return this.cacheTIC[value];
            asset = new Asset(value, this.vapaee);
        }

        if (asset.token == this.vapaee.telos) {
            telos = asset;
        } else {
            var cur_price = this.getTokenCurrentPrice(asset.token.symbol);
            var amount = asset.amount.toNumber();
            var number = amount * cur_price;
            telos = new Asset(number, this.vapaee.telos);
        }
        
        asset = this.getTelosInCurrentCurrency(telos);
        this.cacheTIC[value] = asset;
        return asset;
    }




    // private auxiliar functions -----------------

    private getTokenCurrentPrice(symbol: string) {
        if (!this.tokens_prices[symbol]) {
            return 0;
        } else {
            return this.tokens_prices[symbol].price;
        }        
    }

    private getCurrentPrice() {
        if (!this.prices[this.current]) {
            return 0;
        } else {
            return this.prices[this.current].price;
        }        
    }

    private getCurrentToken(): Token {
        if (!this.prices[this.current]) {
            return {
                symbol: "AUX",
                appname: "Auxiliar Token",
                fiat: true,
                verified:false
            };
        } else {
            return this.prices[this.current].token;
        }        
    }


    

}

