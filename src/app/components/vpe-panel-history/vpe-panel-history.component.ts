import { Component, Input, OnChanges, HostBinding } from '@angular/core';
import { HistoryTx, VapaeeDEX } from 'src/app/services/@vapaee/dex/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-history',
    templateUrl: './vpe-panel-history.component.html',
    styleUrls: ['./vpe-panel-history.component.scss']
})
export class VpePanelHistoryComponent implements OnChanges {

    @Input() public history: HistoryTx[];
    @Input() public scope: string;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;

    @HostBinding('class') display;
    public digits: number;
    public timeformat: string;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.digits = 8;
        this.display = "full";
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
    }

    ngOnChanges() {

    }

    async updateSize(event:ResizeEvent) {
        this.digits = 8;
        this.display = "normal";
        this.timeformat = "HH:mm:ss";

        if (event.device.portrait) {
            this.display = "small";
        }

        if (event.width < 320) {
            this.display = "medium";
        }
        if (event.width < 290) {
            this.display = "small";
        }
        if (event.width < 250) {
            this.digits = 7;
        }
        if (event.width < 240) {
            this.display = "tiny";
        }
        if (event.width < 210) {
            this.digits = 5;
        }
        if (event.width < 200) {
            this.timeformat = "HH:mm";
        }
        if (event.width < 180) {
            this.digits = 4;
        }
        if (event.width < 160) {
            this.digits = 3;
        }         
        if (event.width < 140) {
            this.digits = 2;
        }         
    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    /*
    

    
    */

}
