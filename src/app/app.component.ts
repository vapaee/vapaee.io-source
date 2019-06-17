import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { VirtualTimeScheduler } from 'rxjs';
import { CoingeckoService } from './services/coingecko.service';
import { VapaeeService } from './services/vapaee.service';
import { Token } from './services/utils.service';
import { LocalStringsService } from './services/common/common.services';

@Component({
    selector: 'app-root',
    // template: '<router-outlet></router-outlet>',
    template: `
    <!-- Container for sidebar(s) + page content -->
    <ng-sidebar-container id="sidebar">
 
        <!-- A sidebar -->
        <ng-sidebar [(opened)]="app.sidemenu.opened" [position]="'right'">
            <div class="sidebar-content">
                <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('home')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" routerLink="{{'/exchange/home'}}" >{{local.string.Home}}</a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('tokens')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/tokens'" >{{local.string.Tokens}}</a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('trade')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" routerLink="{{'/exchange/trade/' + (app.getGlobal('last-market') || 'cnt.tlos') }}" >{{local.string.Trade}}</a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('account')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/account/' + vapaee.current.name" >{{local.string.Account}}</a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('wp')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/wp'" >WP</a>
                    </li>
                    <li class="nav-item dropdown" ngbDropdown>
                        <a ngbDropdownToggle class="nav-link dropdown-toggle cursor-pointer" data-toggle="dropdown" id="language">{{local.string.Language}} <span class="caret"></span></a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="language">
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('en_US');">English</span>
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('es_ES');">Español</span>
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('pt_BR');">Português</span>
                        </div>
                    </li>                    
                </ul>        
            </div>

        </ng-sidebar>

        <div ng-sidebar-content (click)="app.closeSideMenu()">
            <router-outlet></router-outlet>
        </div>
 
    </ng-sidebar-container>
    <!-- Page content -->
      
  `,
    styles: ['display: block; ']
})
export class AppComponent {

    // ----------------------------
    private _opened: boolean = false;
 
    private _toggleSidebar() {
      this._opened = !this._opened;
    }    

    
    @HostBinding('class') class = 'box';
  
    constructor(
        private app: AppService,
        private components: VpeComponentsService,
        private coingecko: CoingeckoService,
        private vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
        this.app.init("v1.7.0");
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
