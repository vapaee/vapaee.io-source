import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { TokenDEX } from 'projects/vapaee/dex/src/lib/token-dex.class';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'token-page',
    templateUrl: './token.page.html',
    styleUrls: ['./token.page.scss', '../common.page.scss']
})
export class TokenPage implements OnInit, OnDestroy {

    token: TokenDEX;
    
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public route: ActivatedRoute
    ) {
        var symbol = this.route.snapshot.paramMap.get('symbol');
        this.dex.waitTokensLoaded.then(_ => {
            this.token = this.dex.getTokenNow(symbol.toUpperCase());
            console.log("----> token: ", this.token);
        });
    }


    tradeToken(token:TokenDEX) {
        this.app.navigate('/exchange/trade/'+token.symbol.toLowerCase()+'.tlos');
    }

    ngOnDestroy() {
    }

    ngOnInit() {


    }
}
