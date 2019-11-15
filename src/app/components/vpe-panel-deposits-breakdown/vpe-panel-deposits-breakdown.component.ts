import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, AssetDEX, DEXdata } from 'projects/vapaee/dex/src';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account } from '@vapaee/scatter';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';



@Component({
    selector: 'vpe-panel-deposits-breakdown',
    templateUrl: './vpe-panel-deposits-breakdown.component.html',
    styleUrls: ['./vpe-panel-deposits-breakdown.component.scss']
})
export class VpePanelDepositsBreakdawnComponent implements OnChanges {

    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public dexdata: DEXdata;

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
        this.dexdata = {
            balances:[],
            deposits:[],
            inorders:[],
            userorders:null,
            total:null,
            total_inorders: null,
            total_deposits: null,
        };
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
