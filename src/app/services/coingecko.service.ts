import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SimplePriceMap } from '../components/vpe-components.service';



@Injectable()
export class CoingeckoService {

    public onUpdate:Subject<SimplePriceMap> = new Subject();
    prices: SimplePriceMap;
    currency_list: string[];

    private setReady: Function;
    public waitReady: Promise<any> = new Promise((resolve) => {
        this.setReady = resolve;
    });

    constructor(
        private http: HttpClient
    ) {
        this.currency_list = ["usd", "eur", "btc" , "eos"];
        this.init();
        this.update().then(_ => {
            this.setReady();
        });
    }

    async init() {
        setInterval(_ => this.update(), 60 * 1000);
    }

    async update() {
        var api_endpoint = "https://api.coingecko.com/api/v3";
        var action = "/simple/price?ids=telos&vs_currencies=";
        var url = api_endpoint + action + this.currency_list.join(",");
        this.http.get<{telos:SimplePriceMap}>(url).toPromise().then(result => {
            this.prices = result.telos;
            this.prices.tlos = 1;
            console.log("*********************************");
            console.log(this.prices);
            console.log("*********************************");
            this.onUpdate.next(this.prices);
        });
    }

}

