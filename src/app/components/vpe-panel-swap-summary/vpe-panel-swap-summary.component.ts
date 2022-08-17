import { Component, Input, HostBinding, OnChanges} from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ResizeEvent, VpeComponentsService } from '../vpe-components.service';
import { VapaeeDEX, SwapSummary } from '@vapaee/dex';

@Component({
    selector: 'vpe-panel-swap-summary',
    templateUrl: './vpe-panel-swap-summary.component.html',
    styleUrls: ['./vpe-panel-swap-summary.component.scss']
})
export class VpePanelSwapSummaryComponent implements OnChanges {

    @Input() public summary: SwapSummary | null     = null;

    @Input() public hideheader: boolean             = true;
    @Input() public margintop: boolean              = true;
    @Input() public expanded: boolean               = true;

    @HostBinding('class') display: string           = "full";

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        
    }

    warning: boolean = false;
    danger: boolean = false;
    NORMAL_SLIPPAGE: number = 5;
    HIGH_SLIPPAGE: number = 15;
    show_details: boolean = false;

    ngOnChanges() {
        this.warning = false;
        this.danger = false;
        if (!this.summary) {
            this.show_details = false;
            return;
        }

        if (this.summary.slippage > this.HIGH_SLIPPAGE) {
            this.danger = true;
        } else if (this.summary.slippage > this.NORMAL_SLIPPAGE) {
            this.warning = true;
        }

        if (this.summary.path.length == 0) {
            console.error("VpePanelSwapSummaryComponent.ngOnChanges()", "No path found");
            console.error("VpePanelSwapSummaryComponent.ngOnChanges()", "No path found");
            console.error("---->", this.summary);
        }
        
    }

    onResize(event:ResizeEvent) {
        
    }

    toggleDetails() {
        this.show_details = !this.show_details;


        

    }


    debug() {
        console.log("VpePanelSwapSummaryComponent.debug()", this);
    }




}

