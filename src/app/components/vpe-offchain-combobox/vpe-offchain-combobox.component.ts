import { Component, Input, OnChanges } from '@angular/core';
import { VapaeeDEX } from 'src/app/services/@vapaee/dex/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';



@Component({
    selector: 'vpe-offchain-combobox',
    templateUrl: './vpe-offchain-combobox.component.html',
    styleUrls: ['./vpe-offchain-combobox.component.scss']
})
export class VpeOffChainComboboxComponent implements OnChanges {

    @Input() public btn: string;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.btn = "sm";
    }

    ngOnChanges() {

    }
}
