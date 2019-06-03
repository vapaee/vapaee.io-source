import { Component, Input, OnChanges, Output } from '@angular/core';
import { VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';


@Component({
    selector: 'vpe-fiat-combobox',
    templateUrl: './vpe-fiat-combobox.component.html',
    styleUrls: ['./vpe-fiat-combobox.component.scss']
})
export class VpeFIatComboboxComponent implements OnChanges {

    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
    }

    ngOnChanges() {

    }
}
