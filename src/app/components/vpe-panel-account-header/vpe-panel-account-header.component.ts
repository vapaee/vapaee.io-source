import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService, Asset } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account, ScatterService } from 'src/app/services/scatter.service';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';


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
    public deposit: Asset;
    public withdraw: Asset;
    public loading_fake: boolean;
    public portrait: boolean;
    constructor(
        public vapaee: VapaeeService,
        public scatter: ScatterService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideuser = false;
        this.hideheader = true;
        this.margintop = true;
        this.expanded = true; 
        this.loading_fake = false;
        this.current = this.vapaee.default;
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }

    freeFakeTokens() {
        this.loading_fake = true;
        this.vapaee.getSomeFreeFakeTokens().then(_ => {
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
