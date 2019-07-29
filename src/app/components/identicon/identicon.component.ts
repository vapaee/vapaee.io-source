import { Component, ViewChild, Input, OnChanges } from '@angular/core';

declare var jdenticon:any;
declare var $:any;

@Component({
    selector: 'identicon-comp',
    templateUrl: './identicon.component.html',
    styleUrls: ['./identicon.component.scss']
})
export class IdenticonComponent implements OnChanges {

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
