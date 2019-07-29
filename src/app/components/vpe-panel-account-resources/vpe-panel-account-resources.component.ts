import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX } from 'src/app/services/@vapaee/dex/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account } from 'src/app/services/@vapaee/scatter/scatter.service';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { AssetDEX } from 'src/app/services/@vapaee/dex/asset-dex.class';


@Component({
    selector: 'vpe-panel-account-resources',
    templateUrl: './vpe-panel-account-resources.component.html',
    styleUrls: ['./vpe-panel-account-resources.component.scss']
})
export class VpePanelAccountResourcesComponent implements OnChanges {

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
    public current_mode: boolean;
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideuser = false;
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.current = this.dex.default;
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
