import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';


@Component({
    selector: 'vpe-panel',
    templateUrl: './vpe-panel.component.html',
    styleUrls: ['./vpe-panel.component.scss']
})
export class VpePanelComponent implements OnChanges {

    @Input() public title: string;
    @Input() public hideheader: boolean;
    @Input() public hidebackground: boolean;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
        this.hideheader = false;
        this.hidebackground = false;
    }

    ngOnChanges() {

    }
}
