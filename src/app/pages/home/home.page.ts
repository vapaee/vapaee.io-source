import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ScatterService } from 'src/app/services/scatter.service';
import { VapaeeService } from 'src/app/services/vapaee.service';
import { Token } from 'src/app/services/utils.service';


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
        public scatter: ScatterService,
        public vapaee: VapaeeService
    ) {
        
    }

    ngOnInit() {
        this.vapaee.updateActivity()
        this.timer = window.setInterval(_ => { this.vapaee.updateActivity(); }, 3000);        
    } 

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    get tokens(): Token[] {
        return this.vapaee.tokens;
    }

    tradeToken(token:Token) {
        this.app.navigate('/exchange/trade/'+token.symbol.toLowerCase()+'.tlos');
    }
}
