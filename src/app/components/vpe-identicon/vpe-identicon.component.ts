import { Component, ViewChild, Input, OnChanges } from '@angular/core';

declare var jdenticon:any;
declare var $:any;

@Component({
    selector: 'vpe-identicon',
    templateUrl: './vpe-identicon.component.html',
    styleUrls: ['./vpe-identicon.component.scss']
})
export class VpeIdenticonComponent implements OnChanges {
    @Input() value: string;
    
    constructor() {
        
    }

    ngOnChanges() {
        if (typeof this.value == "string") {
            $("svg.jdenticon").attr("data-jdenticon-value", this.value);
            jdenticon();
        }
    }
}
