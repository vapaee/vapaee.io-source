import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { TimezoneService } from '../services/timezone.service';

import { REXdata } from '@vapaee/rex';
import { TokenDEX, VapaeeDEX, AssetDEX, DEXdata, TokenOrders, OrdersSummary, MarketHeader, Market, MarketSummary, OrderRow } from '@vapaee/dex';
import { Account, Asset } from '@vapaee/wallet';


export interface OrderRowclickEvent {
    type:string;
    row:OrderRow;
}

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
    fullhd:boolean, // >= 1600px
    full:boolean,   // >= 1200px
    big:boolean,    // < 1200px
    normal:boolean, // < 992px
    medium:boolean, // < 768px
    small:boolean,  // < 576px
    tiny:boolean,   // < 420px
    portrait:boolean,
    wide:boolean,
    height:number,
    width:number,
    class:string
}

export interface ResizeEvent {
    device:Device,
    id:string,
    width:number,
    height:number,
    el: ElementRef
}

export interface BoolMap {[key:string]:boolean};

export interface MessageBlock {
    text: string;
    class: string | BoolMap;
}

@Injectable()
export class VpeComponentsService {

    public onResize:Subject<Device> = new Subject();
    public onPricesUpdate:Subject<PriceMap> = new Subject();
    public onTokenPricesUpdate:Subject<PriceMap> = new Subject();
    prices: PriceMap = {};
    prices_ok: boolean = false;
    public currencies: TokenDEX[] = [];
    tokens_prices: PriceMap = {};
    current: string = "usd";
    public device:Device = 
    // empty device object
    {
        fullhd: false,
        full: false,
        big: false,
        normal: false,
        medium: false,
        small: false,
        tiny: false,
        portrait: false,
        wide: false,
        height: 0,
        width: 0,
        class: ""
    };

    constructor(
        private dex: VapaeeDEX,
        public cookie: CookieService,
        public timezone: TimezoneService
    ) {
        this.device = VpeComponentsService.Utils.emptyDevice();
        this.prices = {};
        this.currencies = [];
        this.tokens_prices = {};
        this.current = this.cookie.get("offchain") || "usd";
    }

    // Getters ------------------------------------
    get currency(): TokenDEX {
        // var token = this.prices[this.current] ? this.prices[this.current].token : new 
        if (this.prices[this.current]) {
            return this.prices[this.current].token;
        } else {
            if (this.prices_ok) {
                console.warn("VpeComponentsService.currency() -> no currency found: ", this.current, this.prices, this.prices);
            }
            return new TokenDEX();
        }
    }

    // enter events ------------------------------
    public windowHasResized(e:Device): void {
        this.device = e;
        this.onResize.next(e);
    }

    
    public setTelosPrices(prices:PriceMap): void {
        this.prices_ok = true;
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

    public setTokensPrices(prices:PriceMap): void {
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
    public getDEXInCurrentCurrency(value: Asset | string) {

        let asset: Asset = new Asset();
        if (value == "") return new AssetDEX();
        if (!!(<Asset>value).token && !!(<Asset>value).amount) {
            asset = <Asset>value;
            value = asset.toString();
        }
        
        if (typeof value == "string") {
            if (this.cacheTIC[value]) return this.cacheTIC[value];
            asset = new AssetDEX(value, this.dex);
        }

        // console.log("asset: ", asset);
        console.assert(asset.token.symbol == this.dex.currency.symbol, "VpeComponentsService.getDEXInCurrentCurrency() -> asset.token != this.dex.currency | " + asset.toString());
        
        // TODO: resolver ratio



        let ratio = this.getTokenCurrentPrice(this.dex.telos.symbol);
        let telos = new Asset(asset.amount.multipliedBy(ratio), this.dex.telos);

        return this.getTelosInCurrentCurrency(telos);

    }

    public getTelosInCurrentCurrency(value: Asset | string) {
        let asset: Asset = new Asset();
        if (value == "") return new AssetDEX();

        if (this.dex.tokens.length == 0) return new AssetDEX();

        if (!!(<Asset>value).token && !!(<Asset>value).amount) {
            asset = <Asset>value;
            value = asset.toString();
        }
        
        if (typeof value == "string") {
            if (this.cacheTIC[value]) return this.cacheTIC[value];
            asset = new AssetDEX(value, this.dex);
        }

        // console.log("asset: ", asset);
        console.assert(asset.token.symbol == this.dex.telos.symbol, "VpeComponentsService.getTelosInCurrentCurrency() -> asset.token != this.dex.telos | " + asset.toString());
        
        let cur_price = this.getCurrentPrice();
        let amount = asset.amount.toNumber();
        let number = amount * cur_price;
        asset = new AssetDEX(number, this.getCurrentToken());
        // this.cacheTIC[<string>value] = asset;
        return asset;
    }

    public getTokenInCurrentCurrency(value: Asset | string | undefined) {
        // console.log("VpeComponentsService.getTokenInCurrentCurrency(",value?.toString(),")");
        let asset: AssetDEX = new AssetDEX();
        let dexasset: AssetDEX = new AssetDEX();
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

        if (asset.token.symbol == this.dex.currency.symbol) {
            dexasset = asset;
        } else if (asset.token.symbol == this.dex.telos.symbol) {
            asset = this.getTelosInCurrentCurrency(asset);
            this.cacheTIC[<string>value] = asset;
            return asset;
        } else {
            let cur_price = this.getTokenCurrentPrice(asset.token.symbol);
            let amount = asset.amount.toNumber();
            let number = amount * cur_price;
            dexasset = new AssetDEX(number, this.dex.currency);
        }
        
        asset = this.getDEXInCurrentCurrency(dexasset);
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
    
    
    // Utils is a static class that contains some useful functions
    public static Utils = {
        
        // returns an empty Account object
        emptyAccount: function(): Account {
            return {
                id: "",
                chainId: "",
                name: "guest",
                data: null,
                authority: "",
                blockchain: "",
                slug: "",
                publicKey: ""
            }
        },

        // returns an empty DEXdata object
        emptyDEXdata: function(): DEXdata {
            return {
                total: new AssetDEX(),
                total_inorders: new AssetDEX(),
                total_deposits: new AssetDEX(),
                deposits: [],
                inorders: [],
                balances: [],
                userorders: {},
                userpairorders: []
            }
        },

        // returns an empty REXdata object
        emptyREXdata: function(): REXdata {
            return {
                total: new Asset(),
                deposits: new Asset(),
                balance: new Asset(),
                profits: new Asset(),
                tables: {
                    rexfund: { version: 0, owner: "", balance: new Asset() },
                    rexbal: {
                        version: 0,
                        owner: "",
                        vote_stake: new Asset(),
                        rex_balance: new Asset(),
                        matured_rex: 0,
                        rex_maturities: []
                    }
                }
            }
        },

        emptyTokenOrders: function(): TokenOrders {
            return { sell: [], buy: [] }
        },

        emptyMarketHeader: function(): MarketHeader {
            return { sell: this.emptyOrdersSumary(), buy: this.emptyOrdersSumary() }
        },

        emptyOrdersSumary: function(): OrdersSummary {
            return { total: new AssetDEX(), orders: 0 }
        },

        // returns an empty device object
        emptyDevice: function(): Device {
            return {
                fullhd: false,
                full: false,
                big:false,
                normal:false,
                medium:false,
                small:false,
                tiny:false,
                portrait:false,
                wide:false,
                height:0,
                width:0,
                class:""                
            }
        },

        // returns an empty ResizeEvent object
        emptyResizeEvent: function(el: ElementRef): ResizeEvent {
            return {
                device: this.emptyDevice(),
                id: "",
                width: 0,
                height: 0,
                el: el
            }
        },


        // returns an empty MarketSummary object
        emptyMarketSummary: function(): MarketSummary {
            return {
                market: -1,
                name: "",
                price: new AssetDEX(),
                inverse: new AssetDEX(),
                price_24h_ago: new AssetDEX(),
                inverse_24h_ago: new AssetDEX(),
                min_price: new AssetDEX(),
                max_price: new AssetDEX(),
                min_inverse: new AssetDEX(),
                max_inverse: new AssetDEX(),
                volume: new AssetDEX(),
                amount: new AssetDEX(),
                percent: 0,
                percent_str: "",
                ipercent: 0,
                ipercent_str: "",
                records: []
            }
        },


        // returns an empty Market object
        emptyMarket: function(): Market {
            return {
                real: false,
                id: -1,
                name: "",
                commodity: new TokenDEX(),
                currency: new TokenDEX(),
                deals: 0,
                blocks: 0,
                direct: 0,
                inverse: 0,
                blocklist: [],
                blocklevels: [[]],
                reverseblocks: [],
                reverselevels: [[]],
                block: {},
                orders: this.emptyTokenOrders(),
                history: [],
                tx: {},
                summary: this.emptyMarketSummary(),
                header: this.emptyMarketHeader()
            }
        }


    }
}

