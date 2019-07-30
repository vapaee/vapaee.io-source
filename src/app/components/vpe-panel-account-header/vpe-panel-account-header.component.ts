import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account, VapaeeScatter } from '@vapaee/scatter';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { AssetDEX } from 'projects/vapaee/dex/src/lib/asset-dex.class';


@Component({
    selector: 'vpe-panel-account-header',
    templateUrl: './vpe-panel-account-header.component.html',
    styleUrls: ['./vpe-panel-account-header.component.scss']
})
export class VpePanelAccountHeaderComponent implements OnChanges {

    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public current: Account;

    @Output() confirmDeposit: EventEmitter<any> = new EventEmitter();
    @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    public loading_fake: boolean;
    public portrait: boolean;
    constructor(
        public dex: VapaeeDEX,
        public scatter: VapaeeScatter,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideuser = false;
        this.hideheader = true;
        this.margintop = true;
        this.expanded = true; 
        this.loading_fake = false;
        this.current = this.dex.default;
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }

    freeFakeTokens() {
        this.loading_fake = true;
        this.dex.getSomeFreeFakeTokens().then(_ => {
            this.loading_fake = false;
        }).catch(_ => {
            this.loading_fake = false;
        });        
    }

    setCurrency(currency:string) {
        this.service.setCurrentCurrency(currency);
    }

    async updateSize(event:ResizeEvent) {
        this.portrait = event.device.portrait;
    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

}
