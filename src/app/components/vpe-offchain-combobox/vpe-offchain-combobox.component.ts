import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';

import { VapaeeDEX } from '@vapaee/dex';
import { DropdownService } from 'src/app/services/dropdown.service';



@Component({
    selector: 'vpe-offchain-combobox',
    templateUrl: './vpe-offchain-combobox.component.html',
    styleUrls: ['./vpe-offchain-combobox.component.scss']
})
export class VpeOffChainComboboxComponent implements OnChanges, OnDestroy {

    @Input() public btn: string = "sm";
    @Input() public hideprice: boolean = false;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService,
        public dropdown: DropdownService
    ) {
    }

    ngOnChanges() {

    }

    ngOnDestroy(): void {
        this.dropdown.close();
    }
}
