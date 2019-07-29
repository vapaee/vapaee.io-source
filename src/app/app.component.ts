import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { VirtualTimeScheduler } from 'rxjs';
import { CoingeckoService } from './services/coingecko.service';
import { VapaeeDEX, Market } from './services/@vapaee/dex/dex.service';
import { LocalStringsService } from './services/common/common.services';
import { TokenDEX } from './services/@vapaee/dex/token-dex.class';

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
                        <a class="nav-link" routerLink="{{'/exchange/home'}}" >
                            <i class="material-icons"> navigate_next </i>{{local.string.Home | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('tokens')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/tokens'" >
                            <i class="material-icons"> navigate_next </i>{{local.string.Tokens | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('markets')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/markets'" >
                            <i class="material-icons"> navigate_next </i>{{local.string.markets | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('trade')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" routerLink="{{'/exchange/trade/' + (app.getGlobal('last-market') || 'cnt.tlos') }}" >
                            <i class="material-icons"> navigate_next </i>{{local.string.Trade | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('account')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/account/' + dex.current.name" >
                            <i class="material-icons"> navigate_next </i>{{local.string.Account | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item highlight" [ngClass]="{active: app.stateStartsWith('wp')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/wp'" >
                            <i class="material-icons"> navigate_next </i>WP
                        </a>
                    </li>
                    <li class="nav-item dropdown" ngbDropdown>
                        <a ngbDropdownToggle class="nav-link dropdown-toggle cursor-pointer" data-toggle="dropdown" id="language">{{local.string.Language | titlecase}} <span class="caret"></span></a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="language">
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('en_US'); debug();">English</span>
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('es_ES'); debug();">Español</span>
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('pt_BR'); debug();">Português</span>
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
    styles: ['li.nav-item.active a.nav-link { position:relative; } li.nav-item.active a.nav-link i.material-icons { display: inline-block; } a.nav-link i.material-icons { display: none; position: absolute; left: -24px; top: 5px; }']
})
export class AppComponent {

    // ----------------------------
    private _opened: boolean = false;
 
    private _toggleSidebar() {
      this._opened = !this._opened;
    }    

    
    @HostBinding('class') class = 'box';
  
    constructor(
        public app: AppService,
        public components: VpeComponentsService,
        public coingecko: CoingeckoService,
        public dex: VapaeeDEX,
        public local: LocalStringsService
    ) {
        this.app.init("v2.1.1");
    }
    
    ngOnInit() {
        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();
        
        this.coingecko.onUpdate.subscribe((p:any) => {
            this.dex.waitTokensLoaded.then(_ => {
                var prices:PriceMap = {};
                for (var curreny in p) {
                    var price = p[curreny];
                    var token = this.dex.getTokenNow(curreny.toUpperCase());
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

        this.dex.addOffChainToken(new TokenDEX({ symbol: "USD", appname: "US Dollar", precision: 4 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "EUR", appname: "Euro", precision: 4 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "BTC", appname: "Bitcoin", precision: 8 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "EOS", appname: "EOS", precision: 4 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "TLOS", appname: "Telos", precision: 4 }));
        
        this.dex.onTokensReady.subscribe((tokens:TokenDEX[]) => {
            var tokenPrices:PriceMap = {}
            if (!this.dex.hasScopes()) return;
            for (var i in tokens) {
                var market:Market = this.dex.market(tokens[i].scope);
                if (market) {
                    tokenPrices[tokens[i].symbol] = {
                        price: market.summary ? market.summary.price.toNumber() : 0,
                        token: tokens[i]
                    }
                }
            }
            this.components.setTokensPrices(tokenPrices);
        });
     
    }


    @HostListener('window:resize')
    onWindowsResize() {
        this.app.onWindowsResize();
        this.class = this.app.device.class;
    }


    debug(){
        console.log("--------------------------------");
        console.log("VPE", [this.dex]);
        console.log("Components", [this.components]);
        console.log("--------------------------------");
    }

}
