import { Component, Input, OnChanges } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';

import { VapaeeDEX } from 'projects/vapaee/dex';



@Component({
    selector: 'vpe-offchain-combobox',
    templateUrl: './vpe-offchain-combobox.component.html',
    styleUrls: ['./vpe-offchain-combobox.component.scss']
})
export class VpeOffChainComboboxComponent implements OnChanges {

    @Input() public btn: string;
    @Input() public hideprice: boolean;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.btn = "sm";
        this.hideprice = false;
    }

    ngOnChanges() {

    }
}
