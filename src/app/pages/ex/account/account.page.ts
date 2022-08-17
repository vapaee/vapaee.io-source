import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Subscriber } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VpeComponentsService } from 'src/app/components/vpe-components.service';
import { VpePanelWalletComponent } from 'src/app/components/vpe-panel-wallet/vpe-panel-wallet.component';
import { VapaeeDEX, AssetDEX, UserOrdersMap, DEXdata, UserPairOrders } from '@vapaee/dex';
import { VapaeeREX, REXdata } from '@vapaee/rex';
import { Account, VapaeeWallet, VapaeeWalletConnexion, Asset } from '@vapaee/wallet';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AnchorIdProvider } from '@vapaee/idp-anchor';
import { Location } from '@angular/common';

export interface TokenInfoI {
    name: string;
    logo: string;
    symbol: string;
    account: string;
    chain: string;
    precision: number;
    table_stat?: string;
    supply?:string,
    max_supply?:string,
    dex_swap: boolean;
}


@Component({
    selector: 'account-page',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss', '../../common.page.scss']
})
export class ExAccountPage implements OnInit, OnDestroy, AfterViewInit {

    
    current_mode: boolean = true;;
    loading: boolean = false;
    error: string = "";
    account: Account = VpeComponentsService.Utils.emptyAccount();
    rexdata: REXdata = VpeComponentsService.Utils.emptyREXdata();
    clientid: number = 0;
   
    private subscriber: Subscriber<string>;
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public route: ActivatedRoute,
        public dex: VapaeeDEX,
        public components: VpeComponentsService,
        public rex: VapaeeREX,
        public http: HttpClient,
        public wallet: VapaeeWallet,
        public location: Location
    ) {
        this.subscriber = new Subscriber<string>(this.onDexCurrentAccountChange.bind(this));
        this.current_mode = true;
        this.rexdata = this.rex.default;
        this.clientid = 0;
    }

    _balances: AssetDEX[] = [];
    public tokens: {
        all: TokenInfoI[];
        chain: {[slug:string]:TokenInfoI[]};
        byid: {[tokenid:string]:TokenInfoI};
        specials: TokenInfoI[];
    } = {all:[], chain:{}, byid:{}, specials:[]};

    async updateBalances() {
        // Creating a connexion with network
        let connexion: VapaeeWalletConnexion = await this.wallet.createConnexion("telos", AnchorIdProvider);

        /*
        this.http.get<TokenInfoI[]>(environment.tokens_json_url).subscribe((tokens) => {
            this.tokens.all = [];
            // this.tokens.all = tokens;

            let contracts: {[key:string]:Boolean} = {};

            for (let i=0; i<tokens.length; i++) {
                // token.id = this.getTokenId(token);
                this.tokens.all.push(tokens[i]);
                console.log("tokens[",i,"]", tokens[i]);
                contracts[tokens[i].account] = true;
            }

            for (let name in contracts) {
                let contract = connexion.getContract(name);
                
                contract.getTable("accounts").then((accounts) => {
                    // iteerate over accounts.rows and create a Asset for each row and put it in this._balances;
                    console.error("accounts", accounts);
                    for (let i=0; i<accounts.rows.length; i++) {
                        let row = accounts.rows[i];
                        let bal = new Asset(row.balance);
                        let index = this._balances.findIndex(b => b.token.symbol == bal.token.symbol);
                        if (index != -1) {
                            this._balances[index] = bal;
                        } else {
                            this._balances.push(bal);
                        }
                    }
                });
            }
        });        
        */
    }

    get deposits(): AssetDEX[] {
        return this.dex.deposits;
    }

    get balances(): AssetDEX[] {
        return this.dex.balances;
    }   

    get inorders(): AssetDEX[] {
        return this.dex.inorders;
    }    

    get userpairorders(): UserPairOrders[] {
        return this.dex.userpairorders;
    }

    get dexdata(): DEXdata {
        return this.dex.dexdata;
    }
    
    ngAfterViewInit()  {
        this.updateBalances();
        setTimeout(() => { this.components.windowHasResized(this.components.device); },  500);
        setTimeout(() => { this.components.windowHasResized(this.components.device); }, 1500);
        setTimeout(() => { this.components.windowHasResized(this.components.device); }, 2000);
        setTimeout(() => { this.components.windowHasResized(this.components.device); }, 2500);
    }

    updateAccount() {
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    init: boolean = false;
    ngOnInit() {
        console.log("ExAccountPage.ngOnInit()");
        if (this.init) return;
        this.init = true;

        console.log("ExAccountPage.ngOnInit() goes on....");
        this.dex.onCurrentAccountChange.subscribe(this.subscriber);
        var name = this.route.snapshot.paramMap.get('name');
        setTimeout(() => {
            if (!name) {
                name = "guest";
            } else {
                console.log("ExAccountPage.ngOnInit() -> this.dex.resetCurrentAccount('"+name+"');");
                this.dex.resetCurrentAccount(name);
            };
            console.log("ExAccountPage.ngOnInit() -> this.onDexCurrentAccountChange('"+name+"');");
            this.onDexCurrentAccountChange(name);
        }, 0);
    }

    async onDexCurrentAccountChange(account: string) {
        console.log("ExAccountPage.onDexCurrentAccountChange()", account);
        var url = "/exchange/account/";
        if (account) {
            url += account;
            this.account = this.dex.current;
            this.rexdata = await this.rex.getAccountREXData(account);
        } else {
            this.account = this.dex.default;
            url += "guest";
        };
        
        let current = this.location.path().toString();
        if (current.indexOf(url) == -1) {
            console.log("ExAccountPage.onDexCurrentAccountChange()", [account], " --> ", url);  
            this.app.navigate(url);
        }
    }

    get withdraw_error(): string {
        return this.dex.feed.error('withdraw') || "";
    }

    get deposit_error(): string {
        return this.dex.feed.error('deposit') || "";
    }    

    onWalletConfirmDeposit(amount: AssetDEX, wallet: VpePanelWalletComponent) {
        this.loading = true;
        this.dex.deposit(amount).then(_ => {
            this.loading = false;
            wallet.closeInputs();
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });
    }

    onWalletConfirmWithdraw(amount: AssetDEX, wallet: VpePanelWalletComponent) {
        this.loading = true;
        
        this.dex.withdraw(amount, this.clientid).then(_ => {
            this.loading = false;
            wallet.closeInputs();
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });        
    }

    navigateToTable(event: string) {
        // console.log("-------------->", event);
        this.app.navigate('/exchange/trade/' + event)
    }

}
