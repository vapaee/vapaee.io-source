import { Component, Input, OnChanges, Output, OnInit, OnDestroy } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Subscriber } from 'rxjs';

import { REXdata, VapaeeREX } from '@vapaee/rex';
import { DEXdata, VapaeeDEX } from '@vapaee/dex';
import { Asset, VapaeeWallet, Account, Token } from '@vapaee/wallet';



@Component({
    selector: 'vpe-panel-account-header',
    templateUrl: './vpe-panel-account-header.component.html',
    styleUrls: ['./vpe-panel-account-header.component.scss']
})
export class VpePanelAccountHeaderComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public hideuser: boolean   = false;
    @Input() public hideheader: boolean = false;
    @Input() public margintop: boolean  = false;
    @Input() public expanded: boolean   = false;
    @Input() public loading: boolean    = false;
    @Input() public title: string       = "";
    @Input() public error: string       = "";
    @Input() public current: Account    = VpeComponentsService.Utils.emptyAccount();
    @Input() public rexdata: REXdata    = VpeComponentsService.Utils.emptyREXdata();
    @Input() public dexdata: DEXdata    = VpeComponentsService.Utils.emptyDEXdata();
    @Input() public network: string     = "telos";

    
    public total: Asset                 = new Asset();
    public portrait: boolean            = false;
    private subscriber: Subscriber<string>;

    constructor(
        public dex: VapaeeDEX,
        public rex: VapaeeREX,
        public wallet: VapaeeWallet,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.subscriber = new Subscriber<string>(this.onDexCurrentAccountChange.bind(this));
        this.hideuser = false;
        this.hideheader = true;
        this.margintop = true;
        this.expanded = true; 
        this.current = this.dex.default;
        this.rexdata = this.rex.default;
    }

    private isNative(aux:Asset | Token) {
        var con = this.wallet.connexion[this.network];
        return con.isNative(aux);
    }

    get total_balance(): string {
        if (!this.current) return "";
        if (!this.current.data) return "";
        if (!this.current.data.total_balance) return "";
        if (!this.total.ok) {
            this.total = new Asset(this.current.data.total_balance);
            // console.log("total_balance() ------------", typeof this.current.data.total_balance_asset, this.current.data.total_balance_asset);
            if (this.isNative(this.current.data.total_balance_asset)) {
                this.total = this.current.data.total_balance_asset;

                if (this.isNative(this.rexdata.total)) {
                    this.total = this.total.plus(this.rexdata.total);
                }
    
                if (this.isNative(this.dexdata.total)) {
                    this.total = this.total.plus(this.dexdata.total);
                }    
            } else {
                console.error("wtf just happened?", [this.total, this.current.data, this.rexdata.total,this.dexdata.total])
            }
        }
        return this.total.toString();
    }

    get hide_login_spinner() {
        if (this.wallet.feed.loading('endpoints')) return false;
        if (this.wallet.feed.loading('connexion')) return false;
        if (this.dex.feed.loading('log-state')) return false;
        if (this.dex.feed.loading('login')) return false;
        if (this.dex.connexion && this.dex.connexion.feed.loading('connecting')) return false;
        return true;
    }

    async onDexCurrentAccountChange(account: string) {
        this.total = new Asset();
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    ngOnInit() {
        this.dex.onCurrentAccountChange.subscribe(this.subscriber);
    }

    ngOnChanges() {
        this.total = new Asset();;
    }

    onChange() {
        
    }

    print_debug() {
        console.log("rexdata:",[this.rexdata], this.rexdata.total.toString());
        console.log("dexdata:",[this.dexdata], this.dexdata.total.toString());
        console.log("current:",[this.current], this.current.data ? this.current.data.total_balance : "0.0000 TLOS");
    }

    setCurrency(currency:string) {
        this.service.setCurrentCurrency(currency);
    }

    async updateSize(event:ResizeEvent) {
        this.portrait = event.device.portrait;
        this.total = new Asset();
    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

}
