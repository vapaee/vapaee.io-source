import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService, Asset } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';
import { Subscriber } from 'rxjs';
import { Feedback } from 'src/app/services/feedback.service';


@Component({
    selector: 'vpe-panel-wallet',
    templateUrl: './vpe-panel-wallet.component.html',
    styleUrls: ['./vpe-panel-wallet.component.scss']
})
export class VpePanelWalletComponent implements OnChanges {

    @Input() public deposits: Asset[];
    @Input() public balances: Asset[];
    @Input() public _fake_balances: Asset[];
    @Input() public _nonfake_balances: Asset[];
    @Input() public _fake_tlos_balance: Asset;
    @Input() public actions: boolean;
    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;

    @Output() confirmDeposit: EventEmitter<any> = new EventEmitter();
    @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();
    @Output() gotoAccount: EventEmitter<void> = new EventEmitter();

    
    
    public deposit: Asset;
    public withdraw: Asset;
    public alert_msg:string;
    public loading_fake_tlos: boolean;
    public loading_fake: boolean;

    public show_prices_top: boolean;
    public show_prices_bottom: boolean;
    public feed: Feedback;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.feed = new Feedback();
        this.show_prices_top = true;
        this.show_prices_bottom = true;
        this._fake_tlos_balance = new Asset();
        this.hideuser = false;
        this.hideheader = false;
        this.actions = false;
        this.alert_msg = "";
        this.deposit = new Asset();
        this.withdraw = new Asset();
    }

    

    get get_fake_tlos_balance() {
        if (this._fake_tlos_balance && this._fake_tlos_balance.amount.toNumber() > 0) return this._fake_tlos_balance;
        for (var i in this.balances) {
            if (this.balances[i].token.fake) {
                if (!this._fake_tlos_balance && this.balances[i].token.symbol == "TLOS") {
                    this._fake_tlos_balance = this.balances[i];
                }
            }
        }
        return this._fake_tlos_balance || new Asset();
    }    

    get get_fake_balances() {
        if (this._fake_balances) return this._fake_balances;
        this._fake_balances = this._fake_balances || [];
        for (var i in this.balances) {
            if (this.balances[i].token.fake) {
                this._fake_balances.push(this.balances[i]);
            }
        }
        return this._fake_balances;
    }

    get get_non_fake_balances() {
        if (this._nonfake_balances) return this._nonfake_balances;
        this._nonfake_balances = this._nonfake_balances || [];
        for (var i in this.balances) {
            if (!this.balances[i].token.fake) {
                this._nonfake_balances.push(this.balances[i]);
            }
        }
        // console.log(this._nonfake_balances);
        return this._nonfake_balances;
    }
    
    first_deposit() {
        this.feed.setError("first_deposit", "");
        if (!this.balances) {
            console.error("ERROR: deposits not ready", this.deposits);
            return;
        }
        if (this.balances.length == 0) {
            this.feed.setError("first_deposit", this.local.string.udhavetoken);
            return;
        }
        if (this.balances.length == 1) {
            var asset:Asset = this.balances[0];
            this.depositForm(asset);
        }
        if (this.balances.length > 1) {
            this.show_prices_bottom=false;
        }        
    }

    depositForm(asset:Asset) {
        this.alert_msg = "";
        if (!this.vapaee.logged) return;
        if (!this.actions) return;
        if (!asset.token.verified) {
            this.alert_msg = this.local.string.tinallowed;
            this.deposit = new Asset();
            return;
        }
        if (this.deposit.token.symbol == asset.token.symbol) {
            this.deposit = new Asset();
        } else {
            this.deposit = asset.clone();
        }        
        this.withdraw = new Asset();
    }

    withdrawForm(asset:Asset) {
        if (!this.vapaee.logged) return;
        if (!this.actions) return;
        if (this.withdraw.token.symbol == asset.token.symbol) {
            this.withdraw = new Asset();
        } else {
            this.withdraw = asset.clone();
        }
        this.deposit = new Asset();
    }

    hasNoFake() {
        var resutl = true;
        for (var i in this.vapaee.tokens) {
            if (this.vapaee.tokens[i].fake) {
                resutl = false;
                break;
            }
        }
        return resutl;
    }

    private setquiet(name:string) {
        this.deposit = new Asset();
        this.loading_fake = false;
        this.loading_fake_tlos = false;
    }

    freeFakeTokens() {
        this.loading_fake = true;
        this.vapaee.getSomeFreeFakeTokens().then(_ => {
            this.loading_fake = false;
        }).catch(_ => {
            this.loading_fake = false;
        });        
    }

    freeFakeTelos() {
        console.log("freeFakeTelos()");
        this.loading_fake_tlos = true;
        this.vapaee.getSomeFreeFakeTokens("TLOS").then(_ => {
            this.loading_fake_tlos = false;
        }).catch(_ => {
            this.loading_fake_tlos = false;
        });
    }    

    ngOnChanges() {
        this._nonfake_balances = null;
        this._fake_balances = null;
        this._fake_tlos_balance = null;
    }

    onChange() {
        
    }

    clickOnAccount() {
        this.gotoAccount.next();
    }

    onConfirmWithdraw() {
        this.confirmWithdraw.next(this.withdraw);
    }

    onConfirmDeposit() {
        this.confirmDeposit.next(this.deposit);
    }
}
