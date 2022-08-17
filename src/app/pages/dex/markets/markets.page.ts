import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { TokenDEX, Market, VapaeeDEX } from '@vapaee/dex';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'markets-page',
    templateUrl: './markets.page.html',
    styleUrls: ['./markets.page.scss', '../../common.page.scss']
})
export class DexMarketsPage implements OnInit, OnDestroy {

    _markets: Market[] | null       = null;
    _commodities: TokenDEX[] | null = null;

    selected: TokenDEX              = new TokenDEX();
    commodity: TokenDEX             = new TokenDEX();
    newmarket: boolean              = false;

    _currency_all: TokenDEX = new TokenDEX("ALL");

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public cookie: CookieService
    ) {
        this.dex.waitTokensLoaded.then(_ => {
            var cached:string = this.cookie.get("mcurrency");
            if (cached) {
                let currency:TokenDEX = this.dex.getTokenNow(cached);
                if (currency.ok) {
                    this.selectCurrency(currency);
                } else {
                    this.selectCurrency(this._currency_all);    
                }
            } else {
                this.selectCurrency(this._currency_all);
            }
        });       
    }

    get markets() {
        return this.dex.topmarkets;
    }

    get currency_markets(): Market[] {
        if (this._markets) return this._markets;
        if (!this.dex.topmarkets) return this._markets || [];
        this._markets = [];
        this._commodities = null;
        for (let i in this.dex.topmarkets) {
            let market: Market = this.dex.topmarkets[i];
            if (this.selected.symbol == this._currency_all.symbol) {
                this._markets.push(market);
            } else if (market.currency.symbol == this.selected.symbol) {
                this._markets.push(market);
            } else if (market.commodity.symbol == this.selected.symbol) {
                let inverse = this.dex.inverseName(market.name);
                market = <Market>this.dex.market(inverse);
                console.assert(market, "market not found: "+inverse);
                this._markets.push(market);
            }
        }
        return this._markets;
    }

    get commodities() {
        if (this._commodities) return this._commodities;
        this._commodities = [];
        var tokens = this.dex.tokens;
        for (var a in tokens) {
            var token = tokens[a];
            if (token.offchain) continue;
            if (token.symbol == this.selected.symbol) continue;
            this._commodities.push(token);
        }
        return this._commodities;
    }

    ngOnDestroy() {
        // this.subscriber.unsubscribe();
    }

    ngOnInit() {
        // this.dex.onTokensReady.subscribe(this.subscriber);
    }

    tradeMarket(table:string) {
        this.app.navigate('/exchange/trade/'+table);
    }
    
    selectCurrency(cur:TokenDEX, newmarket:boolean = false) {
        console.log("selectCurrency()", cur, newmarket);
        this.selected = cur;
        this.cookie.set("mcurrency", this.selected.symbol);
        this._markets = null;
        let aux = this.currency_markets;
        this.newmarket = newmarket;
        if (this.commodity.ok && this.commodity.symbol == this.selected.symbol) {
            this.commodity = this.commodities[0];
        }
    }

    selectCommodity(token:TokenDEX) {
        this.commodity = token;
    }

    createNewMarket() {
        this._commodities = null;
        this.newmarket = true;
        this.commodity = this.commodities[0];
        if (this.selected == this._currency_all) {
            this.selectCurrency(this.dex.currency);
        }
    }

    gotoTrade(commodity:TokenDEX|string, selected:TokenDEX|string) {
        let url = '/exchange/trade/' + this.dex.getNameFor(commodity, selected);
        this.app.navigate(url);
    }
}
