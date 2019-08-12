import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { TokenDEX } from 'projects/vapaee/dex/src/lib/token-dex.class';



@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss', '../common.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
   
    timer: number;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        
    }

    ngOnInit() {
        this.dex.updateActivity()
        this.timer = window.setInterval(_ => { this.dex.updateActivity(); }, 30000);
    } 

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    get tokens(): TokenDEX[] {
        return this.dex.tokens;
    }

    tradeToken(token:TokenDEX) {
        this.app.navigate('/exchange/trade/'+token.symbol.toLowerCase()+'.tlos');
    }

    tokenPage(token:TokenDEX) {
        this.app.navigate('/exchange/token/'+token.symbol.toLowerCase());
    }    

    gotoAccount(name:string) {
        this.app.navigate('/exchange/account/' + name);
    }

    gotoScope(scope:string) {
        this.app.navigate('/exchange/trade/' + scope);
    }
}
