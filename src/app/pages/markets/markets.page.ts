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
    commodity: TokenDEX;
    _markets: Market[];
    _comodities: TokenDEX[];
    newmarket: boolean;

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

    get currency_markets() {
        if (this._markets) return this._markets;
        if (!this.dex.topmarkets) return this._markets;
        this._markets = [];
        this._comodities = null;
        for (let i in this.dex.topmarkets) {
            let market = this.dex.topmarkets[i];
            if (market.currency.symbol == this.selected.symbol) {
                this._markets.push(market);
            } else if (market.commodity.symbol == this.selected.symbol) {
                let inverse = this.dex.inverseScope(market.scope);
                market = this.dex.market(inverse);
                this._markets.push(market);
            }
        }
        return this._markets;
    }

    get comodities() {
        if (this._comodities) return this._comodities;
        this._comodities = [];
        var tokens = this.dex.tokens;
        for (var a in tokens) {
            var token = tokens[a];
            if (token.offchain) continue;
            if (token.banned) continue;
            if (token.symbol == this.selected.symbol) continue;
            this._comodities.push(token);
        }
        return this._comodities;
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
    
    selectCurrency(cur:TokenDEX, newmarket:boolean = false) {
        console.log("selectCurrency()", cur, newmarket);
        this.selected = cur;
        this.cookie.set("mcurrency", this.selected.symbol);
        delete this._markets;
        let aux = this.currency_markets;
        this.newmarket = newmarket;
        if (this.commodity && this.commodity.symbol == this.selected.symbol) {
            this.commodity = this.comodities[0];
        }
    }

    selectCommodity(token:TokenDEX) {
        this.commodity = token;
    }

    createNewMarket() {
        this._comodities = null;
        this.newmarket = true;
    }
}
