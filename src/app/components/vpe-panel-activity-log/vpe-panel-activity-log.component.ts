import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HistoryTx, VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-activity-log',
    templateUrl: './vpe-panel-activity-log.component.html',
    styleUrls: ['./vpe-panel-activity-log.component.scss']
})
export class VpePanelActivityLogComponent implements OnChanges {

    @Input() public history: HistoryTx[];
    @Input() public scope: string;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
    }

    ngOnChanges() {

    }
}
