import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Subscriber } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VpeComponentsService } from 'src/app/components/vpe-components.service';
import { VpePanelWalletComponent } from 'src/app/components/vpe-panel-wallet/vpe-panel-wallet.component';
import { VapaeeDEX, AssetDEX, UserOrdersMap, DEXdata, UserPairOrders } from '@vapaee/dex';
import { VapaeeREX, REXdata } from '@vapaee/rex';
import { Account } from '@vapaee/wallet';

@Component({
    selector: 'account-page',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss', '../../common.page.scss']
})
export class DexAccountPage implements OnInit, OnDestroy, AfterViewInit {

    
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

    get userpairorders(): UserPairOrders[] {
        return this.dex.userpairorders;
    }

    get dexdata(): DEXdata {
        return this.dex.dexdata;
    }
    
    ngAfterViewInit()  {
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

    ngOnInit() {
        console.log("DexAccountPage.ngOnInit()");
        this.dex.onCurrentAccountChange.subscribe(this.subscriber);
        var name = this.route.snapshot.paramMap.get('name');
        setTimeout(() => {
            if (!name) {
                name = "guest";
            } else {
                console.log("DexAccountPage.ngOnInit() -> this.dex.resetCurrentAccount('"+name+"');");
                this.dex.resetCurrentAccount(name);
            };
            console.log("DexAccountPage.ngOnInit() -> this.onDexCurrentAccountChange('"+name+"');");
            this.onDexCurrentAccountChange(name);
        }, 0);
    }

    async onDexCurrentAccountChange(account: string) {
        console.log("DexAccountPage.onDexCurrentAccountChange()", account);
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
        console.log("DexAccountPage.onDexCurrentAccountChange()", [account], " --> ", url);
        this.app.navigate(url);
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
