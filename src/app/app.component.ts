import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { VirtualTimeScheduler } from 'rxjs';
import { CoingeckoService } from './services/coingecko.service';
import { VapaeeService, Table } from './services/vapaee.service';
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
                        <a class="nav-link" [routerLink]="'/exchange/account/' + vapaee.current.name" >
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
        public vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
        this.app.init("v2.1.0");
    }
    
    ngOnInit() {
        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();
        
        this.coingecko.onUpdate.subscribe((p:any) => {
            this.vapaee.waitTokensLoaded.then(_ => {
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

        this.vapaee.addOffChainToken({ symbol: "USD", appname: "US Dollar", precision: 4 });
        this.vapaee.addOffChainToken({ symbol: "EUR", appname: "Euro", precision: 4 });
        this.vapaee.addOffChainToken({ symbol: "BTC", appname: "Bitcoin", precision: 8 });
        this.vapaee.addOffChainToken({ symbol: "EOS", appname: "EOS", precision: 4 });
        this.vapaee.addOffChainToken({ symbol: "TLOS", appname: "Telos", precision: 4 });
        
        this.vapaee.onTokensReady.subscribe((tokens:Token[]) => {
            var tokenPrices:PriceMap = {}
            if (!this.vapaee.hasScopes()) return;
            for (var i in tokens) {
                var table:Table = this.vapaee.table(tokens[i].scope);
                if (table) {
                    tokenPrices[tokens[i].symbol] = {
                        price: table.summary.price.toNumber(),
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
        console.log("VPE", [this.vapaee]);
        console.log("Components", [this.components]);
        console.log("--------------------------------");
    }

}
