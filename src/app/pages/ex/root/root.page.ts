import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService, AnalyticsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from 'src/app/components/vpe-components.service';

import { DropdownService } from 'src/app/services/dropdown.service';
import { TimezoneService } from 'src/app/services/timezone.service';
import { VapaeeREX } from '@vapaee/rex';
import { VapaeeWallet } from '@vapaee/wallet';
import { VapaeeDEX, VapaeeDEXSwap } from '@vapaee/dex';
import { VapaeeStyles } from '@vapaee/styles';

declare var $:any;

@Component({
    selector: 'root-page',
    templateUrl: './root.page.html',
    styleUrls: ['./root.page.scss']
})
export class ExRootPage implements OnInit {

    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public elRef: ElementRef,
        public wallet: VapaeeWallet,
        public dex: VapaeeDEX,
        public swap: VapaeeDEXSwap,
        public rex: VapaeeREX,
        public styles: VapaeeStyles,
        public analytics: AnalyticsService,
        private components: VpeComponentsService,
        public dropdown: DropdownService,
        public timezone: TimezoneService
    ) {
        
    }
    
    ngOnInit() {
    }

    collapseMenu() {
        var target = this.elRef.nativeElement.querySelector("#toggle-btn");
        var navbar = this.elRef.nativeElement.querySelector("#navbar");
        if (target && $(navbar).hasClass("show")) {
            $(target).click();
        }
    }

    navigateTo(str:string) {
        this.app.navigate(str);
    }


    debug(){
        console.log("--------------------------------");
        console.log("APP", [this.app]);
        console.log("DEX", [this.dex]);
        console.log("SWAP", [this.swap]);
        console.log("REX", [this.rex]);
        console.log("Wallet", [this.wallet]);
        console.log("Components", [this.components]);
        console.log("--------------------------------");
    }


}
