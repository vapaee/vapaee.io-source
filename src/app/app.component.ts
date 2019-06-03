import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { VirtualTimeScheduler } from 'rxjs';
import { CoingeckoService } from './services/coingecko.service';
import { VapaeeService } from './services/vapaee.service';
import { Token } from './services/utils.service';
import { pipe } from '@angular/core/src/render3/pipe';
import { async } from '@angular/core/testing';

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
        
        this.coingecko.onUpdate.subscribe((p:any) => {
            this.vapaee.waitReady.then(_ => {
                var prices:PriceMap = {};
                for (var curreny in p) {
                    var price = p[curreny];
                    var token = this.vapaee.getTokenNow(curreny.toUpperCase());
                    if (token) {
                        prices[curreny] = {
                            price: price,
                            token: token
                        }    
                    }
                }
                this.components.setTelosPrices(prices);    
            });
        });

        this.vapaee.addFiatToken({ symbol: "USD", appname: "US Dollar", precision: 4 });
        this.vapaee.addFiatToken({ symbol: "EUR", appname: "Euro", precision: 4 });
        this.vapaee.addFiatToken({ symbol: "BTC", appname: "Bitcoin", precision: 8 });
        this.vapaee.addFiatToken({ symbol: "EOS", appname: "EOS", precision: 4 });
        this.vapaee.addFiatToken({ symbol: "TLOS", appname: "Telos", precision: 4 });
        
        this.vapaee.onTokensReady.subscribe((tokens:Token[]) => {
            var tokenPrices:PriceMap = {}
            if (!this.vapaee.scopes) return;
            for (var i in tokens) {
                if (this.vapaee.scopes[tokens[i].scope]) {
                    tokenPrices[tokens[i].symbol] = {
                        price: this.vapaee.scopes[tokens[i].scope].summary.price.toNumber(),
                        token: tokens[i]
                    }
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
