import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, AssetDEX } from 'projects/vapaee/dex/src';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Feedback } from 'projects/vapaee/feedback/src';


@Component({
    selector: 'vpe-panel-wallet',
    templateUrl: './vpe-panel-wallet.component.html',
    styleUrls: ['./vpe-panel-wallet.component.scss']
})
export class VpePanelWalletComponent implements OnChanges {

    @Input() public deposits: AssetDEX[];
    @Input() public balances: AssetDEX[];
    @Input() public _nonfake_balances: AssetDEX[];
    @Input() public _fake_tlos_balance: AssetDEX;
    @Input() public actions: boolean;
    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public withdraw_error: string;
    @Input() public deposit_error: string;

    @Output() confirmDeposit: EventEmitter<any> = new EventEmitter();
    @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();
    @Output() gotoAccount: EventEmitter<void> = new EventEmitter();

    
    
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    public alert_msg:string;
    public loading_fake_tlos: boolean;
    public loading_fake: boolean;
    public portrait: boolean;

    public show_prices_top: boolean;
    public show_prices_bottom: boolean;
    public feed: Feedback;

    @HostBinding('class') display;
    digits: {[key:string]:number};

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.digits = {
            amount:8,
            offchain:4
        };
        this.feed = new Feedback();
        this.show_prices_top = true;
        this.show_prices_bottom = true;
        this._fake_tlos_balance = new AssetDEX();
        this.hideuser = false;
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.actions = false;
        this.alert_msg = "";
        this.deposit = new AssetDEX();
        this.withdraw = new AssetDEX();
    }   

    get get_non_fake_balances() {
        if (this._nonfake_balances) return this._nonfake_balances;
        this._nonfake_balances = this._nonfake_balances || [];
        for (var i in this.balances) {
            if (!this.balances[i].token) {
                console.error("ERROR: invalid balance on index i: ", i, this.balances);
                continue;
            }
            if (!this.balances[i].token.offchain) {
                this._nonfake_balances.push(this.balances[i]);
            }
        }
        // console.log("get_non_fake_balances --->", this.balances);
        return this._nonfake_balances;
    }

    async updateSize(event:ResizeEvent) {
        this.digits = {
            amount:8,
            offchain:4
        };

        this.portrait = event.device.portrait;
        this.display = "normal";
        // console.log("updateSize() event.device.wide --->", event.device.wide);
        if (event.device.wide) {
            if (event.width < 370) {
                this.display = "medium";
            }            
            if (event.width < 360) {
                this.digits.amount = 7;
            }
            if (event.width < 350) {
                this.digits.offchain = 3;
            }
            if (event.width < 320) {
                this.display = "small";
            }
            if (event.width < 300) {
                this.digits.amount = 6;
                this.digits.offchain = 2;
            }
            if (event.width < 280) {
                this.digits.amount = 5;
            }
            if (event.width < 260) {
                this.digits.offchain = 1;
            }
            if (event.width < 250) {
                this.display = "tiny";
            }
            if (event.width < 230) {
                this.digits.amount = 5;
            }
            if (event.width < 210) {
                this.digits.amount = 4;
            }
        } else {
            this.digits.amount = 8;
            this.digits.offchain = 4;
            if (event.width < 370) {
                this.display = "medium";
            }
            if (event.width < 300) {
                this.digits.amount = 6;
                this.digits.offchain = 2;
            }
        }

    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
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
            var asset:AssetDEX = this.balances[0];
            this.depositForm(asset);
        }
        if (this.balances.length > 1) {
            this.show_prices_bottom=false;
        }        
    }

    depositForm(asset:AssetDEX) {
        this.alert_msg = "";
        if (!this.dex.logged) return;
        if (!this.actions) return;
        if (!asset.token.tradeable) {
            this.alert_msg = this.local.string.tinallowed;
            this.deposit = new AssetDEX();
            return;
        }
        if (this.deposit.token.symbol == asset.token.symbol) {
            this.deposit = new AssetDEX();
            this.deposit_error = "";
        } else {
            this.deposit = asset.clone();
        }        
        this.withdraw = new AssetDEX();
    }

    withdrawForm(asset:AssetDEX) {
        if (!this.dex.logged) return;
        if (!this.actions) return;
        if (this.withdraw.token.symbol == asset.token.symbol) {
            this.withdraw = new AssetDEX();
            this.withdraw_error = "";
        } else {
            this.withdraw = asset.clone();
        }
        this.deposit = new AssetDEX();
    }

    private setquiet(name:string) {
        this.deposit = new AssetDEX();
        this.loading_fake = false;
        this.loading_fake_tlos = false;
    }

    ngOnChanges() {
        this._nonfake_balances = null;
        this._fake_tlos_balance = null;
        this.service.windowHasResized(this.service.device);
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

    closeInputs() {
        this.withdraw = new AssetDEX();
        this.withdraw_error = "";
        this.deposit = new AssetDEX();
        this.deposit_error = "";        
    }
}
