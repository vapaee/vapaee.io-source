import { Component, Input, OnChanges, HostBinding, Output } from '@angular/core'
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent, MessageBlock } from '../vpe-components.service';
import { VapaeeDEX } from '@vapaee/dex';
import { VpePanelComponent } from '../vpe-panel/vpe-panel.component';
import { Subject } from 'rxjs';


@Component({
    selector: 'vpe-panel-message',
    templateUrl: './vpe-panel-message.component.html',
    styleUrls: ['./vpe-panel-message.component.scss']
})
export class VpePanelMessageComponent implements OnChanges {

    @Input() public buttons: MessageBlock[]   = [];
    @Input() public messages: MessageBlock[]  = [];
    @Input() public title: string             = "Message";
    @Input() public hideheader: boolean       = false;
    @Input() public margintop: boolean        = true;
    @Input() public expanded: boolean         = true;
    @Input() public btnclose: boolean         = false;
  
    @Output() public onClose:Subject<VpePanelComponent>  = new Subject();
    @Output() public onBtn:Subject<MessageBlock>  = new Subject();
    constructor(
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {

    }

    ngOnChanges() {

    }

    async updateSize(event:ResizeEvent) {
        if (event.device.portrait) {}
        if (event.width < 320) {}      
    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    onPanelClose(panel: VpePanelComponent) {
        console.log("VpePanelMessageComponent.onClose()");
        this.onClose.next(panel);
    }

    onClick(btn: MessageBlock) {
        this.onBtn.next(btn);
    }

    debug() {
        console.debug([this]);
        console.debug(this.title);
        console.debug(this.messages);
    }

    
}
