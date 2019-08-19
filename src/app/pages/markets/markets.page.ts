import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { Subscriber } from 'rxjs';
import { TokenDEX, Market } from '@vapaee/dex';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'markets-page',
    templateUrl: './markets.page.html',
    styleUrls: ['./markets.page.scss', '../common.page.scss']
})
export class MarketsPage implements OnInit, OnDestroy {


    selected: TokenDEX;
    _markets: Market[];

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public cookie: CookieService
    ) {
        this.dex.waitTokensLoaded.then(_ => {
            var cached = this.cookie.get("mcurrency");
            if (cached) {
                this.selectCurrency(this.dex.getTokenNow(cached));
            } else {
                this.selectCurrency(this.dex.telos);
            }
        });       
    }

    get markets() {
        return this.dex.topmarkets;
    }

    get currencies() {
        return this.dex.currencies;
    }

    get currency_markets() {
        if (this._markets) return this._markets;
        if (!this.dex.topmarkets) return this._markets;
        this._markets = [];
        for (let i in this.dex.topmarkets) {
            let market = this.dex.topmarkets[i];
            if (market.currency.symbol == this.selected.symbol) {
                this._markets.push(market);
            } else if (market.comodity.symbol == this.selected.symbol) {
                let inverse = this.dex.inverseScope(market.scope);
                market = this.dex.market(inverse);
                this._markets.push(market);
            }
        }
        return this._markets;
    }

    ngOnDestroy() {
        // this.subscriber.unsubscribe();
    }

    ngOnInit() {
        // this.dex.onTokensReady.subscribe(this.subscriber);
    }

    tradeMarket(scope:string) {
        this.app.navigate('/exchange/trade/'+scope);
    }
    
    selectCurrency(cur:TokenDEX) {
        this.selected = cur;
        this.cookie.set("mcurrency", this.selected.symbol);
        delete this._markets;
        let aux = this.currency_markets;        
    }
}
