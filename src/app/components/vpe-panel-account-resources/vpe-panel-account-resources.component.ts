import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService, Asset } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Account } from 'src/app/services/scatter.service';


@Component({
    selector: 'vpe-panel-account-resources',
    templateUrl: './vpe-panel-account-resources.component.html',
    styleUrls: ['./vpe-panel-account-resources.component.scss']
})
export class VpePanelAccountResourcesComponent implements OnChanges {

    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public current: Account;

    @Output() confirmDeposit: EventEmitter<any> = new EventEmitter();
    @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();
    public current_mode: boolean;
    public deposit: Asset;
    public withdraw: Asset;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
        this.hideuser = false;
        this.hideheader = false;
        this.current = this.vapaee.default;
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }

}
