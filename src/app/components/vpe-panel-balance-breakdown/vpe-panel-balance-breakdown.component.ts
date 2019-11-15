import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, AssetDEX } from 'projects/vapaee/dex/src';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account } from '@vapaee/scatter';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';



@Component({
    selector: 'vpe-panel-balance-breakdown',
    templateUrl: './vpe-panel-balance-breakdown.component.html',
    styleUrls: ['./vpe-panel-balance-breakdown.component.scss']
})
export class VpePanelBalanceBreakdawnComponent implements OnChanges {

    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public account: Account;

    @Output() confirmDeposit: EventEmitter<any> = new EventEmitter();
    @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    public detail: boolean;
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
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }


}
