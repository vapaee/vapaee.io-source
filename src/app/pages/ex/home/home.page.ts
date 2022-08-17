import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VapaeeDEX, TokenDEX } from '@vapaee/dex';



@Component({
    selector: 'home-page',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss', '../../common.page.scss']
})
export class ExHomePage implements OnInit, OnDestroy {
   
    timer: NodeJS.Timer = setTimeout(() => { }, 0);
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX
    ) {
        
    }

    ngOnInit() {
        
    } 

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    get tokens(): TokenDEX[] {
        return this.dex.tokens;
    }   

    gotoAccount(name:string) {
        this.app.navigate('/exchange/account/' + name);
    }

}
