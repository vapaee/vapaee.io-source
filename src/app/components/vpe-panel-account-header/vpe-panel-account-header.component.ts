import { Component, Input, OnChanges, Output, OnInit, OnDestroy } from '@angular/core';
import { VapaeeDEX, DEXdata } from 'projects/vapaee/dex/src';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account, VapaeeScatter, Asset } from 'projects/vapaee/scatter/src';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { REXdata, VapaeeREX } from '@vapaee/rex';
import { Subscriber } from 'rxjs';



@Component({
    selector: 'vpe-panel-account-header',
    templateUrl: './vpe-panel-account-header.component.html',
    styleUrls: ['./vpe-panel-account-header.component.scss']
})
export class VpePanelAccountHeaderComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public current: Account;
    @Input() public rexdata: REXdata;
    @Input() public dexdata: DEXdata;

    
    public total: Asset;
    public portrait: boolean;
    private subscriber: Subscriber<string>;

    constructor(
        public dex: VapaeeDEX,
        public rex: VapaeeREX,
        public scatter: VapaeeScatter,
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
        this.total = null;
    }

    get total_balance() {
        if (!this.current.data.total_balance) return "";
        if (!this.total) {
            if (this.scatter.isNative(this.current.data.total_balance_asset)) {
                this.total = this.current.data.total_balance_asset;

                if (this.scatter.isNative(this.rexdata.total)) {
                    this.total = this.total.plus(this.rexdata.total);
                }
    
                if (this.scatter.isNative(this.dexdata.total)) {
                    this.total = this.total.plus(this.dexdata.total);
                }    
            }
        }
        return this.total;
    }

    async onDexCurrentAccountChange(account: string) {
        // this.total = null;
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    ngOnInit() {
        this.dex.onCurrentAccountChange.subscribe(this.subscriber);
    }

    ngOnChanges() {
        this.total = null;
    }

    onChange() {
        
    }

    print_debug() {
        console.log([this.rexdata], this.rexdata.total.toString());
        console.log([this.dexdata], this.dexdata.total.toString());
        console.log([this.current], this.current.data.total_balance);
    }

    setCurrency(currency:string) {
        this.service.setCurrentCurrency(currency);
    }

    async updateSize(event:ResizeEvent) {
        this.portrait = event.device.portrait;
        this.total = null;
    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

}
