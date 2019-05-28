import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { VirtualTimeScheduler } from 'rxjs';
import { CoingeckoService } from './services/coingecko.service';
import { VapaeeService } from './services/vapaee.service';
import { Token } from './services/utils.service';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    styles: ['display: block;']
})
export class AppComponent {

    // @HostBinding('class.hola') deviceClass: boolean = true;
    @HostBinding('class') class = 'box';
  
    constructor(
        private app: AppService,
        private components: VpeComponentsService,
        private coingecko: CoingeckoService,
        private vapaee: VapaeeService,
        
    ) {
        this.app.init();
    }
    
    ngOnInit() {
        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();
        
        this.coingecko.onUpdate.subscribe((p:PriceMap) => {
            this.components.setTelosPrices(p);
        });
        
        this.vapaee.onTokensReady.subscribe((tokens:Token[]) => {
            var tokenPrices:PriceMap = {}
            if (!this.vapaee.scopes) return;
            for (var i in tokens) {
                if (this.vapaee.scopes[tokens[i].scope]) {
                    tokenPrices[tokens[i].symbol] = this.vapaee.scopes[tokens[i].scope].summary.price.toNumber();
                }
            }
            this.components.setTokensPrices(tokenPrices);
        })
    }


    @HostListener('window:resize')
    onWindowsResize() {
        this.app.onWindowsResize();
        this.class = this.app.device.class;
    }
    
}
