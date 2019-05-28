import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export interface PriceMap {
    [key:string]: number;
}


@Injectable()
export class VpeComponentsService {

    public onResize:Subject<any[][]> = new Subject();
    public onPricesUpdate:Subject<PriceMap> = new Subject();
    public onTokenPricesUpdate:Subject<PriceMap> = new Subject();
    prices: PriceMap;
    tokens_prices: PriceMap;

    constructor(
    ) {
        this.prices = {usd:0, eur:0, btc:0, eos:0};
    }

    public windowHasResized(e) {
        this.onResize.next(e);
    }

    setTelosPrices(prices:PriceMap) {
        this.prices = prices;
        this.onPricesUpdate.next(this.prices);
        console.log("VpeComponentsService.setTelosPrices() ------------------->", this.prices);
    }

    setTokensPrices(prices:PriceMap) {
        this.tokens_prices = prices;
        this.onTokenPricesUpdate.next(this.tokens_prices);
        console.log("VpeComponentsService.setTokensPrices() ------------------->", this.tokens_prices);
    }

}

