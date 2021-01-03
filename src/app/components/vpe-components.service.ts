import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { TimezoneService } from '../services/timezone.service';

import { TokenDEX, VapaeeDEX, AssetDEX } from '@vapaee/dex';
import { Asset } from '@vapaee/wallet';




export interface StringMap {[key:string]: string};

export interface PriceMap {
    [key:string]: {
        price: number;
        token: TokenDEX;
    };
}

export interface SimplePriceMap {
    [key:string]: number;
}

export interface Device {
    fullhd?:boolean, // >= 1600px
    full?:boolean,   // >= 1200px
    big?:boolean,    // < 1200px
    normal?:boolean, // < 992px
    medium?:boolean, // < 768px
    small?:boolean,  // < 576px
    tiny?:boolean,   // < 420px
    portrait?:boolean,
    wide?:boolean,
    height?:number,
    width?: number,
    class?: string
}

export interface ResizeEvent {
    device:Device,
    id:string,
    width:number,
    height:number,
    el: ElementRef
}

@Injectable()
export class VpeComponentsService {

    public onResize:Subject<Device> = new Subject();
    public onPricesUpdate:Subject<PriceMap> = new Subject();
    public onTokenPricesUpdate:Subject<PriceMap> = new Subject();
    prices: PriceMap;
    public currencies: TokenDEX[];
    tokens_prices: PriceMap;
    current: string;
    public device:Device;

    constructor(
        private dex: VapaeeDEX,
        public cookie: CookieService,
        public timezone: TimezoneService
    ) {
        this.device = {};
        this.prices = {};
        this.currencies = [];
        this.tokens_prices = {};
        this.current = this.cookie.get("offchain") || "usd";
    }

    // Getters ------------------------------------
    get currency() {
        // var token = this.prices[this.current] ? this.prices[this.current].token : new 
        if (this.prices[this.current]) {
            return this.prices[this.current].token;
        } else {
            return {title:""};
        }
    }

    // enter events ------------------------------
    public windowHasResized(e:Device) {
        this.device = e;
        this.onResize.next(e);
    }

    public setTelosPrices(prices:PriceMap) {
        this.prices = prices;
        this.currencies = [];
        for (var i in this.prices) {
            var token:TokenDEX = this.prices[i].token;
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
        this.cookie.set("offchain", currency);
        this.setTelosPrices(this.prices);
    }

    // Quesries -----------------------------------
    cacheTIC:any = {};
    public getTelosInCurrentCurrency(value: Asset | string) {
        var asset: Asset;
        if (value == "") return new AssetDEX();
        if (!!(<Asset>value).token && !!(<Asset>value).amount) {
            asset = <Asset>value;
            value = asset.toString();
        }
        
        if (typeof value == "string") {
            if (this.cacheTIC[value]) return this.cacheTIC[value];
            asset = new AssetDEX(value, this.dex);
        }
        
        var cur_price = this.getCurrentPrice();
        var amount = asset.amount.toNumber();
        var number = amount * cur_price;
        asset = new AssetDEX(number, this.getCurrentToken());
        this.cacheTIC[<string>value] = asset;
        return asset;
    }

    public getTokenInCurrentCurrency(value: Asset | string) {
        var asset: AssetDEX;
        var telos: AssetDEX;
        if (!value) return new AssetDEX();
        if (value == "0 AUX") return new AssetDEX();
        if (!!(<Asset>value).token && !!(<Asset>value).amount) {
            let temp:any = value;
            asset = temp;
            value = asset.toString();
            /*} else {
                if (<any>value instanceof Asset) {
                    value = value.toString();
                }    */
        }
        if (typeof value == "string") {
            if (this.cacheTIC[value]) return this.cacheTIC[value];
            asset = new AssetDEX(value, this.dex);
        }

        if (asset.token == this.dex.telos) {
            telos = asset;
        } else {
            var cur_price = this.getTokenCurrentPrice(asset.token.symbol);
            var amount = asset.amount.toNumber();
            var number = amount * cur_price;
            telos = new AssetDEX(number, this.dex.telos);
        }
        
        asset = this.getTelosInCurrentCurrency(telos);
        this.cacheTIC[<string>value] = asset;
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

    private getCurrentToken(): TokenDEX {
        if (!this.prices[this.current]) {
            return new TokenDEX({
                symbol: "AUX",
                title: "Auxiliar Token",
                offchain: true,
                tradeable: false
            });
        } else {
            return this.prices[this.current].token;
        }        
    }

    toLocalTimezone(d:Date | string) {
        return this.timezone.toLocal(d);
    }
    

}

