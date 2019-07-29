import { Component, ViewChild, Input, OnChanges } from '@angular/core';

declare var jdenticon:any;
declare var $:any;

@Component({
    selector: 'vpe-identicon',
    templateUrl: './vpe-identicon.component.html',
    styleUrls: ['./vpe-identicon.component.scss']
})
export class VpeIdenticonComponent implements OnChanges {

    @ViewChild('svg') private svg;
    @Input() value: string;
    
    constructor() {
        
    }

    ngOnChanges() {
        if (typeof this.value == "string") {
            $(this.svg.nativeElement).attr("data-jdenticon-value", this.value);
            jdenticon();
        }
    }
}
