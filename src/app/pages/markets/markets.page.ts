import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { Subscriber } from 'rxjs';
import { TokenDEX } from '@vapaee/dex';

@Component({
    selector: 'markets-page',
    templateUrl: './markets.page.html',
    styleUrls: ['./markets.page.scss', '../common.page.scss']
})
export class MarketsPage implements OnInit, OnDestroy {


    selected: TokenDEX;

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        this.dex.waitTokensLoaded.then(_ => {
            this.selected = this.dex.telos;
        });        
    }

    get markets() {
        return this.dex.topmarkets;
    }

    get currencies() {
        return this.dex.currencies;
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

    selectMarket(a:any) {
        console.log("selectMarket", a);
    }
}
