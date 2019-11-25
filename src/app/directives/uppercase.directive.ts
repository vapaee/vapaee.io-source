import { Directive, OnInit, Output, Input, EventEmitter } from "@angular/core";


@Directive({
    selector: '[uppercase]',
    host: {
        '[value]': 'uppercase',
        '(input)': 'format($event.target.value)'
    }
})
export class UppercaseDirective implements OnInit {

    @Input() uppercase: string;
    @Output() uppercaseChange: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        this.uppercase = this.uppercase || '';
        this.format(this.uppercase);
    }

    format(value) {
        value = value.toUpperCase();
        this.uppercaseChange.next(value);
    }
}