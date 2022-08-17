import { Component, HostListener, HostBinding } from '@angular/core';
import { AppService } from './services/common/app.service';
import { VpeComponentsService, PriceMap } from './components/vpe-components.service';
import { CoingeckoService } from './services/coingecko.service';
import { LocalStringsService, AnalyticsService } from './services/common/common.services';
import { DropdownService } from './services/dropdown.service';
import { HttpClient } from '@angular/common/http';

import { VapaeeDEX, TokenDEX, Market, VapaeeDEXSwap } from '@vapaee/dex';
import { Skin, VapaeeStyles } from '@vapaee/styles';
import { VapaeeREX } from '@vapaee/rex';
import { VapaeeWallet } from '@vapaee/wallet';
import { AnchorIdProvider } from '@vapaee/idp-anchor';
// import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { ILocalStorage } from '@vapaee/core';
import { routes } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';
import { Route } from '@angular/router';

@Component({
    selector: 'app-root',
    // template: '<router-outlet></router-outlet>',
    template: `
    <!-- Container for sidebar(s) + page content -->
    <ng-sidebar-container id="sidebar">
 
        <!-- A sidebar -->
        <ng-sidebar [(opened)]="app.sidemenu.opened" [position]="'right'">
            <div class="sidebar-content">
                
            
                <ul class="nav navbar-nav ml-auto" *ngIf="isOnSite('dex')">
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('home')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" routerLink="{{'/dex/home'}}" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> home </i>
                            {{local.string.Home | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('tokens')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/dex/tokens'" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> view_list </i>
                            {{local.string.Tokens | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('markets')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/dex/swap/' + (app.getGlobal('lastmarket', 'TLOS/EUROT'))" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> attach_money </i>
                            {{local.string.markets | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('trade')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" routerLink="{{'/dex/trade/' + (app.getGlobal('lastmarket', 'TLOS/EUROT')) }}" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> insert_chart_outlined </i>
                            {{local.string.Trade | titlecase}}
                        </a>
                    </li>
                    <li class="nav-item" [ngClass]="{active: app.stateStartsWith('account')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/dex/account/' + dex.current.name" >
                            <i class="material-icons nav"> navigate_next </i>
                            <i class="material-icons"> perm_identity </i>
                            {{local.string.Account | titlecase}}
                        </a>
                    </li>
                    <!--li class="nav-item wp highlight" [ngClass]="{active: app.stateStartsWith('wp')}" (click)="app.closeSideMenu()">
                        <a class="nav-link" [routerLink]="'/wp'" >
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
                                (click)="styles.setSkin(skin.id); dropdown.close(); app.closeSideMenu(); "
                                *ngFor="let skin of styles.skins"
                                [ngClass]="{'active': skin.id == styles.current.id}"
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
        public swap: VapaeeDEXSwap,
        public rex: VapaeeREX,
        public wallet: VapaeeWallet,
        public local: LocalStringsService,
        public styles: VapaeeStyles,
        public dropdown: DropdownService,
        public http: HttpClient,
        public analytics: AnalyticsService
    ) {
        this.app.init("v4.0.1", this.appname, routes);

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

    isOnSite(site:string):boolean {
        let node: Route | null = this.app.node;
        if (!node) return false;
        if (!node.data) return false;
        return node.data.site == site;
    }
    
    async ngOnInit() {

        this.dex.onLoggedAccountChange.subscribe(logged => {
            this.analytics.setUserId(logged ? this.dex.account.name : "anonymous");
        });

        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();

        this.addOffChainToken();

        let STORAGE = this.getStorage();

        // console.error("Check point 1");
        await this.local.init(STORAGE);

        // console.error("Check point 2");
        await this.styles.init(this.getSkins(), STORAGE);

        // console.error("Check point 3");
        await this.wallet.init("assets/endpoints.json");
        
        // console.error("Check point 4");

        // if enviroment prod

        let old_version = window.location.href.indexOf("exchange") > 0;
        if (old_version) {
            this.styles.setSkin("skin-jungle");
            
            await this.dex.init(this.appname, {
                telosmaindex:"telosmaindex",
                telosbookdex:"telosbookdex",
                telosswapdex:"telosswapdex",
                vapaeetokens:"vapaeetokens",
                network: "telos",
                skip_markets: true
            }, STORAGE, AnchorIdProvider);
            
        } else {    
            this.styles.setSkin("skin-reload");

            await this.dex.init(this.appname, {
                telosmaindex:"telosmaindex",
                telosbookdex:"telosbookdex",
                telosswapdex:"telosswapdex",
                vapaeetokens:"vapaeetokens",
                network: "local"
            }, STORAGE, AnchorIdProvider);    
        }

        // console.error("Check point 5");
        await this.swap.init();
        // console.error("Check point 6");
        await this.rex.init();
        console.error("Check point FIN !");
     
    }

    // Storage --------------------
    localStorage: Storage = window.localStorage;
    getStorage(): ILocalStorage {
        let self = this;
        if (!this.localStorage) {
            this.localStorage = window.localStorage;
            console.assert(!!this.localStorage, "ERROR: no local Storage !!!");    
        }
        return {
            get(key: string): Observable<any> {
                if (self.isLocalStorageSupported) {
                    let aux = self.localStorage.getItem(key);
                    console.debug("STORAGE.get("+key+") -> ", aux);
                    console.debug(aux);
                    let result: any = null;
                    try {
                         result = JSON.parse(aux || "");
                    } catch (e) {}
                    console.debug("STORAGE.get("+key+") -> ", result);
                    return of(result);
                }
                console.debug("STORAGE.get("+key+") -> null");
                return of(null);
            },
            set(key: string, value: any): Observable<any> {
                console.debug("STORAGE.set("+key+")");
                if (self.isLocalStorageSupported) {
                    self.localStorage.setItem(key, JSON.stringify(value));
                    return of(true);
                }
                return of(false);
            },
            remove(key: string): Observable<any> {
                console.debug("STORAGE.remove("+key+")");
                if (self.isLocalStorageSupported) {
                    self.localStorage.removeItem(key);
                    return of(true);
                }
                return of(false);
            }            
        } 
    }

    get isLocalStorageSupported(): boolean {
        return !!window.localStorage
    }
    // Storage (end) --------------------

    // getStorage(): IStorage {
    //     return {
    //         get: (key: string) => this.cookies.get(key),
    //         set: (key: string, value: any) => this.cookies.set(key, value),
    //     }
    // }

    getSkins(): Skin[] {
        return [
            {
                "id": "skin-reload",
                "name": "Reload",
                "url": "/assets/skins/skin-reload.css"
            },
            {
                "id": "skin-jungle",
                "name": "Jungle",
                "url": "/assets/skins/skin-jungle.css"
            }
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

            console.debug("AppComponent.addOffChainToken() this.coingecko.onUpdate");

            var prices:PriceMap = {};
            for (var curreny in p) {
                var price = p[curreny];
                var token:TokenDEX = this.dex.getTokenNow(curreny.toUpperCase());
                if (token.ok) {
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
        
        this.dex.onTokensUpdated.subscribe((tokens:TokenDEX[]) => {
            var tokenPrices:PriceMap = {}
            for (var i in tokens) {
                let token = tokens[i];
                let market:Market|null = this.dex.market(tokens[i].table);
                // console.log(i, "--------", tokens[i].symbol, market);
                if (market) {
                    tokenPrices[tokens[i].symbol] = {
                        token,
                        price: market.summary.price.toNumber(),
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
        console.log("APP", [this.app]);
        console.log("DEX", [this.dex]);
        console.log("SWAP", [this.swap]);
        console.log("REX", [this.rex]);
        console.log("Wallet", [this.wallet]);
        console.log("Components", [this.components]);
        console.log("--------------------------------");
    }

}
