import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX, TokenDEX } from '@vapaee/dex';


@Component({
    selector: 'tokens-page',
    templateUrl: './tokens.page.html',
    styleUrls: ['./tokens.page.scss', '../../common.page.scss']
})
export class DexTokensPage implements OnInit, OnDestroy {

    public filter:string = "";
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        
    }

    get tokens(): TokenDEX[] {
        return this.dex.tokens;
    }

    editToken(token:TokenDEX) {
        console.log("DexTokensPage.editToken()", [token]);
        this.app.setGlobal("edit-token", true);
        this.app.navigate('/dex/token/'+token.symbol.toLowerCase());
    }

    tradeToken(token:TokenDEX) {
        this.app.navigate('/dex/trade/'+token.table);
    }

    swapToken(token:TokenDEX) {
        this.app.navigate('/dex/swap/'+token.table);
    }

    tokenPage(token:TokenDEX) {
        this.app.navigate('/dex/token/'+token.symbol.toLowerCase());
    } 

    ngOnDestroy() {
    }

    ngOnInit() {
    }
}
