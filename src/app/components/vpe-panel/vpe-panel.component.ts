import { Component, Input, OnChanges, Output, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { VapaeeService } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Subscriber, Subject } from 'rxjs';
import { VpeComponentsService } from '../vpe-components.service';



@Component({
    selector: 'vpe-panel',
    templateUrl: './vpe-panel.component.html',
    styleUrls: ['./vpe-panel.component.scss']
})
export class VpePanelComponent implements OnChanges, OnDestroy, AfterViewInit {

    @ViewChild('body') body:ElementRef;
    @Input() public title: string;
    @Input() public hideheader: boolean;
    @Input() public hidebackground: boolean;
    @Input() public initclosed: boolean;
    @Input() public expanded: boolean;
    devicecache:any[][];

    private onResizeSubscriber: Subscriber<any>;
    @Output() public onResize:Subject<any[][]> = new Subject();
    @Output() public onClose:Subject<any[][]> = new Subject();
    @Output() public onExpand:Subject<any[][]> = new Subject();

    private bodyw: number;
    private bodyh: number;
    private bodyp: number;
    
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService,
    ) {
        this.expanded = !this.initclosed;
        this.hideheader = false;
        this.hidebackground = false;
        this.onResizeSubscriber = new Subscriber<string>(this.triggerResize.bind(this));
    }

    triggerResize(device:any[][]) {
        this.devicecache = device;
        this.onResize.next(device);
        this.updateBodyMesurements();
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
    }  

    turn(offon:boolean) {
        // console.log("this.expanded", this.expanded, " -- > ", offon);
        this.expanded = offon;       
        if (this.expanded) {
            this.onExpand.next(this.devicecache);
            setTimeout(_ => {
                this.body.nativeElement.style.height = "unset";
                // this.body.nativeElement.style.padding = "unset";
                this.onResize.next(this.devicecache);
            }, 510);             
            /// this.body.nativeElement.style.height = this.bodyh + "px";
            /// this.body.nativeElement.style.padding = this.bodyp + "px";
        } else {
            this.bodyh = this.body.nativeElement.offsetHeight;
            this.bodyw = this.body.nativeElement.offsetWidth;
            this.bodyp = parseInt(window.getComputedStyle(this.body.nativeElement, null).getPropertyValue('padding'));
            console.log(this.bodyh, this.bodyp, window.getComputedStyle(this.body.nativeElement, null).getPropertyValue('padding'));

            this.onClose.next(this.devicecache);
            setTimeout(_ => {
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
}
