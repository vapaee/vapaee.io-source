import { Component, Input, OnChanges } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { VapaeeREX, REXdata } from 'projects/vapaee/rex';



@Component({
    selector: 'vpe-panel-rex-breakdown',
    templateUrl: './vpe-panel-rex-breakdown.component.html',
    styleUrls: ['./vpe-panel-rex-breakdown.component.scss']
})
export class VpePanelREXBreakdawnComponent implements OnChanges {

    @Input() public hideuser: boolean;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public data: REXdata;
    
    public detail: boolean;
    constructor(
        public rex: VapaeeREX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideuser = false;
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.data = this.rex.default;
    }

    async updateSize(event:ResizeEvent) {

    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }


}
