import { Component, Input, OnChanges, Output } from '@angular/core';
import { VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';
import { Token } from 'src/app/services/utils.service';



@Component({
    selector: 'vpe-offchain-combobox',
    templateUrl: './vpe-offchain-combobox.component.html',
    styleUrls: ['./vpe-offchain-combobox.component.scss']
})
export class VpeOffChainComboboxComponent implements OnChanges {

    @Input() public btn: string;

    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.btn = "sm";
    }

    ngOnChanges() {

    }
}
