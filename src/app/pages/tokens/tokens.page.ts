import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { TokenDEX } from 'projects/vapaee/dex/src/lib/token-dex.class';


@Component({
    selector: 'tokens-page',
    templateUrl: './tokens.page.html',
    styleUrls: ['./tokens.page.scss', '../common.page.scss']
})
export class TokensPage implements OnInit, OnDestroy {

    
    
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        
    }

    get tokens(): TokenDEX[] {
        return this.dex.tokens;
    }
    
    /*
    summary(_scope) {
        console.error("DEPRECATED");
        var scope = this.scopes[_scope];
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, scope ? scope.summary : {});
        return _summary;
    }
    */

    tradeToken(token:TokenDEX) {
        this.app.navigate('/exchange/trade/'+token.symbol.toLowerCase()+'.tlos');
    }

    ngOnDestroy() {
    }

    ngOnInit() {


    }
}
