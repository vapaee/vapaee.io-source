import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Subscriber } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VpeComponentsService } from 'src/app/components/vpe-components.service';
import { VpePanelWalletComponent } from 'src/app/components/vpe-panel-wallet/vpe-panel-wallet.component';
import { VapaeeDEX, AssetDEX, UserOrdersMap, DEXdata } from 'projects/vapaee/dex/src';
import { VapaeeREX, REXdata } from 'projects/vapaee/rex/src/public_api';
import { Account } from 'projects/vapaee/scatter/src';

@Component({
    selector: 'account-page',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss', '../common.page.scss']
})
export class AccountPage implements OnInit, OnDestroy, AfterViewInit {

    private subscriber: Subscriber<string>;
    current_mode: boolean;
    loading: boolean;
    error: string;
    account: Account;
    rexdata: REXdata;
    clientid: number;
   
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public route: ActivatedRoute,
        public dex: VapaeeDEX,
        public components: VpeComponentsService,
        public rex: VapaeeREX
    ) {
        this.subscriber = new Subscriber<string>(this.onDexCurrentAccountChange.bind(this));
        this.current_mode = true;
        this.rexdata = this.rex.default;
        this.clientid = 0;
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

    get userorders(): UserOrdersMap {
        return this.dex.userorders;
    }

    get dexdata(): DEXdata {
        return this.dex.dexdata;
    }
    
    ngAfterViewInit()  {
        setTimeout(_ => { this.components.windowHasResized(this.components.device); },  500);
        setTimeout(_ => { this.components.windowHasResized(this.components.device); }, 1500);
        setTimeout(_ => { this.components.windowHasResized(this.components.device); }, 2000);
        setTimeout(_ => { this.components.windowHasResized(this.components.device); }, 2500);
    }

    updateAccount() {
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    ngOnInit() {
        console.log("AccountPage.ngOnInit()");
        this.dex.onCurrentAccountChange.subscribe(this.subscriber);
        var name = this.route.snapshot.paramMap.get('name');
        setTimeout(_ => {
            if (!name) {
                name = "guest";
            } else {
                this.dex.resetCurrentAccount(name);
            };
            this.onDexCurrentAccountChange(name);
        }, 0);
    }

    async onDexCurrentAccountChange(account: string) {
        console.log("AccountPage.onDexCurrentAccountChange()", account);
        var url = "/exchange/account/";
        if (account) {
            url += account;
            this.account = this.dex.current;
            this.rexdata = await this.rex.getAccountREXData(account);
            console.log("------>", this.rex);
            console.log("------>", this.rexdata);
        } else {
            this.account = this.dex.default;
            url += "guest";
        };
        console.log("AccountPage.onDexCurrentAccountChange()", [account], " --> ", url);
        this.app.navigate(url);
    }

    get withdraw_error() {
        return this.dex.feed.error('withdraw');
    }

    get deposit_error() {
        return this.dex.feed.error('deposit');
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

    navigateToTable(event) {
        // console.log("-------------->", event);
        this.app.navigate('/exchange/trade/' + event)
    }

}
