import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'vpe-checkbox',
    templateUrl: './vpe-checkbox.component.html',
    styleUrls: ['./vpe-checkbox.component.scss']
})
export class VpeCheckboxComponent implements OnChanges {

    @Input() public value: boolean;
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor(
    ) {
        
    }

    toggle() {
        this.value = !this.value;
        this.onChange.next(this.value);
    }

    ngOnChanges() {
        this.value = !!this.value;
    }
}
