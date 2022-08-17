import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { DEXdata, AssetDEX, VapaeeDEX } from '@vapaee/dex';



@Component({
    selector: 'vpe-panel-deposits-breakdown',
    templateUrl: './vpe-panel-deposits-breakdown.component.html',
    styleUrls: ['./vpe-panel-deposits-breakdown.component.scss']
})
export class VpePanelDepositsBreakdawnComponent implements OnChanges {

    @Input() public hideuser: boolean                    = false;
    @Input() public hidefiat: boolean                    = false;
    @Input() public hideheader: boolean                  = false;
    @Input() public margintop: boolean                   = true;
    @Input() public expanded: boolean                    = true;
    @Input() public loading: boolean                     = false;
    @Input() public title: string                        = "";
    @Input() public error: string                        = "";
    @Input() public dexdata: DEXdata                     = VpeComponentsService.Utils.emptyDEXdata();

    // @Output() confirmDeposit: EventEmitter<any>          = new EventEmitter();
    // @Output() confirmWithdraw: EventEmitter<any>         = new EventEmitter();
    // public deposit:  AssetDEX                            = new AssetDEX();
    // public withdraw: AssetDEX                            = new AssetDEX();
    public detail: boolean                               = false;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideuser = false;
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true;
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
