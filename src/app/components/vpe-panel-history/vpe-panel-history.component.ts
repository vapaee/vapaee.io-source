import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HistoryTx, VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';


@Component({
    selector: 'vpe-panel-history',
    templateUrl: './vpe-panel-history.component.html',
    styleUrls: ['./vpe-panel-history.component.scss']
})
export class VpePanelHistoryComponent implements OnChanges {

    @Input() public history: HistoryTx[];
    @Input() public scope: string;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
    }

    ngOnChanges() {

    }
}
