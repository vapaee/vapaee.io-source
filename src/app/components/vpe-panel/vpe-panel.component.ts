import { Component, Input, OnChanges, Output, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Subscriber, Subject } from 'rxjs';
import { VpeComponentsService, Device, ResizeEvent } from '../vpe-components.service';

import { VapaeeDEX } from '@vapaee/dex';

@Component({
    selector: 'vpe-panel',
    templateUrl: './vpe-panel.component.html',
    styleUrls: ['./vpe-panel.component.scss']
})
export class VpePanelComponent implements OnChanges, OnDestroy, AfterViewInit {

    @ViewChild('body') body:ElementRef =<ElementRef>{};

    @Input() public id: string                 = "";
    @Input() public title: string              = "";
    @Input() public hideheader: boolean        = false;
    @Input() public margintop: boolean         = false;
    @Input() public hidebackground: boolean    = false;
    @Input() public initclosed: boolean        = false;
    @Input() public expanded: boolean          = false;
    @Input() public btnclose: boolean          = false;
    

    private onResizeSubscriber: Subscriber<any>;
    @Output() public onResize:Subject<ResizeEvent> = new Subject();
    @Output() public onClose:Subject<VpePanelComponent>  = new Subject();
    @Output() public onShrink:Subject<ResizeEvent>  = new Subject();
    @Output() public onExpand:Subject<ResizeEvent> = new Subject();

    private bodyw: number = 0;
    private bodyh: number = 0;
    private bodyp: number = 0;
    
    private element: ElementRef;
    resizeEvent:ResizeEvent;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService,
        private el: ElementRef
    ) {
        
        this.expanded = !this.initclosed;
        this.hideheader = false;
        this.margintop = true;
        this.hidebackground = false;
        this.onResizeSubscriber = new Subscriber<Device>(this.triggerResize.bind(this));

        this.element = el;
        this.resizeEvent = VpeComponentsService.Utils.emptyResizeEvent(this.element);
    }

    

    ngOnChanges() {
        this.updateBodyMesurements();
    }

    ngOnDestroy() {
        this.onResizeSubscriber.unsubscribe();
    }

    updateBodyMesurements() {
        // delete this.body.nativeElement.style.height;
        // delete this.body.nativeElement.style.padding;
        // delete this.body.nativeElement.style.width;
    }
    
    ngAfterViewInit() {
        this.service.onResize.subscribe(this.onResizeSubscriber);
        this.updateBodyMesurements();
        this.triggerResize(this.service.device);
    }  


    triggerResize(device:Device) {        
        this.resizeEvent = {
            device: device,
            width: this.element.nativeElement.offsetWidth,
            height: this.element.nativeElement.offsetHeight,
            id: this.id,
            el: this.element
        };
        // console.assert(this.resizeEvent.width > 0, JSON.stringify(this.resizeEvent));
        this.onResize.next(this.resizeEvent);
        this.updateBodyMesurements();
    }

    turn(event:MouseEvent, offon:boolean) {
        // console.log("this.expanded", this.expanded, " -- > ", offon);

        if (this.btnclose) return this.close(event);

        this.expanded = offon;       
        if (this.expanded) {
            this.onExpand.next(this.resizeEvent);
            setTimeout(() => {
                this.body.nativeElement.style.height = "unset";
                // this.body.nativeElement.style.padding = "unset";
                this.onResize.next(this.resizeEvent);
            }, 510);             
            /// this.body.nativeElement.style.height = this.bodyh + "px";
            /// this.body.nativeElement.style.padding = this.bodyp + "px";
        } else {
            this.bodyh = this.body.nativeElement.offsetHeight;
            this.bodyw = this.body.nativeElement.offsetWidth;
            this.bodyp = parseInt(window.getComputedStyle(this.body.nativeElement, null).getPropertyValue('padding'));
            console.log(this.bodyh, this.bodyp, window.getComputedStyle(this.body.nativeElement, null).getPropertyValue('padding'));

            this.onShrink.next(this.resizeEvent);
            setTimeout(() => {
                this.body.nativeElement.style.height = "0px";
                this.body.nativeElement.style.paddingTop = "0px";
                this.body.nativeElement.style.paddingBottom = "0px";
                this.body.nativeElement.style.paddingLeft = this.bodyp + "px";
                this.body.nativeElement.style.paddingRight = this.bodyp + "px";           
            }, 0);
        }
        
        this.body.nativeElement.style.height = this.bodyh + "px";
        this.body.nativeElement.style.paddingTop = this.bodyp + "px";
        this.body.nativeElement.style.paddingBottom = this.bodyp + "px";
    }

    close(event:MouseEvent) {
        event.stopPropagation();
        this.onClose.next(this);
    }
}
