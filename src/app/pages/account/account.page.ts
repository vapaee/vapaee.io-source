import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ScatterService } from 'src/app/services/scatter.service';
import { Subscriber } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Profile, Utils } from 'src/app/services/utils.service';
import { VapaeeService, Asset, UserOrders, UserOrdersMap } from 'src/app/services/vapaee.service';


@Component({
    selector: 'account-page',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss', '../common.page.scss']
})
export class AccountPage implements OnInit, OnDestroy {

    private subscriber: Subscriber<string>;
    current_mode: boolean;
    loading: boolean;
    error: string;
   
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public scatter: ScatterService,
        public route: ActivatedRoute,
        public vapaee: VapaeeService,
    ) {
        this.subscriber = new Subscriber<string>(this.onCntCurrentAccountChange.bind(this));
        this.current_mode = true;


        
    }


    get deposits(): Asset[] {
        return this.vapaee.deposits;
    }

    get balances(): Asset[] {
        return this.vapaee.balances;
    }    

    get userorders(): UserOrdersMap {
        return this.vapaee.userorders;
    }    

    updateAccount() {
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    ngOnInit() {
        console.log("VpeAccountPage.ngOnInit()");
        this.vapaee.onCurrentAccountChange.subscribe(this.subscriber);
        var name = this.route.snapshot.paramMap.get('name');
        setTimeout(_ => {
            if (!name) {
                name = "guest";
                this.onCntCurrentAccountChange(name);
            } else {
                this.vapaee.resetCurrentAccount(name);
            };

            var utils:Utils = new Utils("",null);
            var encodedName = utils.encodeName(name);
        }, 0);
    }

    onCntCurrentAccountChange(account: string) {
        // console.log("VaeProfilePage.onCntCurrentAccountChange() ----------------->", account);
        var url = "/exchange/account/";
        if (account) {
            url += account;
        } else {
            url += "guest";
        };
        // console.log("accountPage.onCntCurrentAccountChange()", [account], " --> ", url);
        this.app.navigate(url);
    }

    get withdraw_error() {
        return this.vapaee.feed.error('withdraw');
    }

    get deposit_error() {
        return this.vapaee.feed.error('deposit');
    }    

    onWalletConfirmDeposit(amount: Asset) {
        // console.log("------------------>", amount.toString());
        this.loading = true;
        this.vapaee.deposit(amount).then(_ => {
            // console.log("------------------>", amount.toString());
            this.loading = false;
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });
    }

    onWalletConfirmWithdraw(amount: Asset) {
        // console.log("------------------>", amount.toString());
        this.loading = true;
        this.vapaee.withdraw(amount).then(_ => {
            // console.log("------------------>", amount.toString());
            this.loading = false;
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
