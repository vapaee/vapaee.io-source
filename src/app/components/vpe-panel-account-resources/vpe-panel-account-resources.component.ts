import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';

import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Account } from '@vapaee/wallet';
import { AssetDEX, VapaeeDEX } from '@vapaee/dex';



@Component({
    selector: 'vpe-panel-account-resources',
    templateUrl: './vpe-panel-account-resources.component.html',
    styleUrls: ['./vpe-panel-account-resources.component.scss']
})
export class VpePanelAccountResourcesComponent implements OnChanges {

    @Input() public hideuser: boolean   = false;
    @Input() public hidefiat: boolean   = false;
    @Input() public hideheader: boolean = false;
    @Input() public margintop: boolean  = false;
    @Input() public expanded: boolean   = false;
    @Input() public loading: boolean    = false;
    @Input() public title: string       = "";
    @Input() public error: string       = "";
    @Input() public account: Account    = VpeComponentsService.Utils.emptyAccount();

    // @Output() confirmDeposit: EventEmitter<any>  = new EventEmitter();
    // @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();

    public current_mode: boolean = false;
    // public deposit: AssetDEX  = new AssetDEX();
    // public withdraw: AssetDEX = new AssetDEX();

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideuser = false;
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.account = this.dex.default;
    }

    async updateSize(event:ResizeEvent) {

    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }

}
