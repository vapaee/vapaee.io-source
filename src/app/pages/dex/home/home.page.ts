import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX, TokenDEX } from '@vapaee/dex';



@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss', '../../common.page.scss']
})
export class DexHomePage implements OnInit, OnDestroy {
   
    timer: NodeJS.Timer = setTimeout(() => { }, 0);
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        
    }

    ngOnInit() {
        this.dex.updateActivity()
        this.timer = setInterval(() => { this.dex.updateActivity(); }, 30000);
    } 

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    get tokens(): TokenDEX[] {
        return this.dex.tokens;
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

    gotoAccount(name:string) {
        this.app.navigate('/dex/account/' + name);
    }

    gotoTable(table:string) {
        this.app.navigate('/dex/trade/' + table);
    }
}
