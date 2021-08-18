import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { CoingeckoService } from './services/coingecko.service';
import { LocalStringsService, AnalyticsService } from './services/common/common.services';
import { DropdownService } from './services/dropdown.service';
import { HttpClient } from '@angular/common/http';

import { VapaeeDEX, TokenDEX, Market } from '@vapaee/dex';
import { IStorage, Skin, VapaeeStyle } from '@vapaee/style';
import { VapaeeREX } from '@vapaee/rex';
import { VapaeeWallet } from '@vapaee/wallet';
import { ScatterIdProvider } from '@vapaee/idp-scatter';
import { CookieService } from 'ngx-cookie-service';


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
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> home </i>
                            {{local.string.Home | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('tokens')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/tokens'" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> view_list </i>
                            {{local.string.Tokens | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('markets')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/markets'" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> attach_money </i>
                            {{local.string.markets | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('trade')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" routerLink="{{'/exchange/trade/' + (app.getGlobal('lastmarket', 'cnt.tlos')) }}" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> insert_chart_outlined </i>
                            {{local.string.Trade | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('account')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/account/' + dex.current.name" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> perm_identity </i>
                            {{local.string.Account | titlecase}}
                        </a>
                    </li>
                    <!--li class="nav-item wp highlight" [ngClass]="{active: app.stateStartsWith('wp')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/exchange/wp'" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> how_to_vote </i>
                            WP
                        </a>
                    </li-->
                    <li class="nav-item skin dropdown">
                        <a class="nav-link dropdown-toggle cursor-pointer" (click)="dropdown.drop('skin')">
                            <i class="material-icons"> palette </i>
                            {{local.string.skin | titlecase}}
                            <span class="caret"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" [ngClass]="{show:dropdown.isOpen('skin')}">
                            <span
                                class="cursor-pointer dropdown-item"
                                (click)="style.setSkin(skin.id); dropdown.close(); app.closeSideMenu(); "
                                *ngFor="let skin of style.skins"
                                [ngClass]="{'active': skin.id == style.current.id}"
                            >{{skin.name}}</span>
                        </div>
                    </li>
                    <li class="nav-item language dropdown" >
                        <a  class="nav-link dropdown-toggle cursor-pointer" (click)="dropdown.drop('language')">
                            <i class="material-icons"> language </i>
                            {{local.string.Language | titlecase}}
                            <span class="caret"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" [ngClass]="{show: dropdown.isOpen('language')}" >
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('en_US'); dropdown.close(); app.closeSideMenu(); debug();">English</span>
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('es_ES'); dropdown.close(); app.closeSideMenu(); debug();">Español</span>
                            <span class="cursor-pointer dropdown-item" (click)="local.setLocal('pt_BR'); dropdown.close(); app.closeSideMenu(); debug();">Português</span>
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
    styles: ['li.nav-item.active a.nav-link { position:relative; } li.nav-item.active a.nav-link i.material-icons.nav { display: inline-block; } a.nav-link i.material-icons.nav { display: none; position: absolute; left: -24px; top: 7px; } a.nav-link i.material-icons:not(.nav) { vertical-align: middle; margin-top: -3px; }']
})
export class AppComponent {
    private _opened: boolean = false;
    public appname:string = "Vapaée-TelosDEX"
 
    private _toggleSidebar() {
      this._opened = !this._opened;
    }    

    
    @HostBinding('class') class = 'box';
  
    constructor(
        public app: AppService,
        public components: VpeComponentsService,
        public coingecko: CoingeckoService,
        public dex: VapaeeDEX,
        public rex: VapaeeREX,
        public wallet: VapaeeWallet,
        public local: LocalStringsService,
        public style: VapaeeStyle,
        public dropdown: DropdownService,
        public http: HttpClient,
        public analytics: AnalyticsService,
        public cookies: CookieService
    ) {
        this.app.init("v3.8.1", this.appname);

        // Check if this is the last version. If not, reload site.
        this.http.get<any>("assets/app.json?_="+Math.random()).toPromise().then((appjson) => {
            if (this.app.version != appjson.version) {
                console.error(appjson, "ERROR: version missmatch. Reloading site...");
                // alert("load version " + appjson.version);
                window.location.href = 
                    window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/?_="+Math.random();
            } else {
                console.log("APP: ", appjson);
            }
        });        
    }
    
    async ngOnInit() {

        this.dex.onLoggedAccountChange.subscribe(logged => {
            this.analytics.setUserId(logged ? logged : 0);
        });

        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();

        this.addOffChainToken();

        await this.style.init(this.getSkins(), this.getStorage());
        await this.wallet.init("assets/endpoints.json");
        await this.dex.init(this.appname, {telosbookdex:"vapaeetokens", vapaeetokens:"vapaeetokens"}, ScatterIdProvider);
        await this.rex.init();
     
    }

    getStorage(): IStorage {
        return {
            get: (key: string) => this.cookies.get(key),
            set: (key: string, value: any) => this.cookies.set(key, value),
        }
    }

    getSkins(): Skin[] {
        return [
            {
                "id": "skin-rain",
                "name": "Gray Rain",
                "url": "/assets/skins/skin-rain.css"
            },
            {
                "id": "skin-jungle",
                "name": "Jungle",
                "url": "/assets/skins/skin-jungle.css"
            },
            {
                "id": "skin-sky",
                "name": "Sky",
                "url": "/assets/skins/skin-sky.css"
            },
        ]
    }

    async addOffChainToken() {
        await this.dex.waitTokensLoaded;
        console.log("AppComponent.addOffChainToken()");

        this.dex.addOffChainToken(new TokenDEX({ symbol: "USD", title: "US Dollar", precision: 4 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "EUR", title: "Euro", precision: 4 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "BTC", title: "Bitcoin", precision: 8 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "EOS", title: "EOS", precision: 4 }));
        this.dex.addOffChainToken(new TokenDEX({ symbol: "TLOS", title: "Telos", precision: 4 }));        
        
        
        this.coingecko.onUpdate.subscribe((p:any) => {

            console.error("AppComponent.addOffChainToken() this.coingecko.onUpdate");

            var prices:PriceMap = {};
            for (var curreny in p) {
                var price = p[curreny];
                var token = this.dex.getTokenNow(curreny.toUpperCase());
                if (token) {
                    prices[curreny] = {
                        price: price,
                        token: token
                    }    
                } else {
                    console.error("ERROR token not fount ", curreny.toUpperCase())
                }
            }
            this.components.setTelosPrices(prices);
        });
        this.coingecko.update();
        
        this.dex.onTokensReady.subscribe((tokens:TokenDEX[]) => {
            var tokenPrices:PriceMap = {}
            for (var i in tokens) {
                var market:Market = this.dex.market(tokens[i].table);
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
