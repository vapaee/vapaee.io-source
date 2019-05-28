import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PriceMap } from '../components/vpe-components.service';



@Injectable()
export class CoingeckoService {

    public onUpdate:Subject<PriceMap> = new Subject();
    prices: PriceMap;
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
        this.http.get<{telos:PriceMap}>(url).toPromise().then(result => {
            this.prices = result.telos;
            this.onUpdate.next(this.prices);
        });
    }

}

