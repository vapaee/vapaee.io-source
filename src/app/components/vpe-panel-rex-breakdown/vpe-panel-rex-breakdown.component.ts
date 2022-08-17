import { Component, Input, OnChanges } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { VapaeeREX, REXdata } from '@vapaee/rex';



@Component({
    selector: 'vpe-panel-rex-breakdown',
    templateUrl: './vpe-panel-rex-breakdown.component.html',
    styleUrls: ['./vpe-panel-rex-breakdown.component.scss']
})
export class VpePanelREXBreakdawnComponent implements OnChanges {

    @Input() public hideuser: boolean     = false;
    @Input() public hidefiat: boolean     = false;
    @Input() public hideheader: boolean   = false;
    @Input() public margintop: boolean    = true;
    @Input() public expanded: boolean     = true;
    @Input() public loading: boolean      = false;
    @Input() public title: string         = "";
    @Input() public error: string         = "";
    @Input() public data: REXdata         = VpeComponentsService.Utils.emptyREXdata();
    
    public detail: boolean                = false;
    
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
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }

    debug() {
        console.log(this);
    }

}
