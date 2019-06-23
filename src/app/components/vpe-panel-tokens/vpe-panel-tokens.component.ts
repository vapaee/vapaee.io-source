import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Token } from 'src/app/services/utils.service';
import { Subscriber } from 'rxjs';
import { VapaeeService, TableMap } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';



@Component({
    selector: 'vpe-panel-tokens',
    templateUrl: './vpe-panel-tokens.component.html',
    styleUrls: ['./vpe-panel-tokens.component.scss']
})
export class VpePanelTokensComponent implements OnChanges {

    @Input() public tokens: Token[];
    @Input() public scopes: TableMap;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public complete: boolean;
    @Input() public search: string;
    @Output() selectToken: EventEmitter<string> = new EventEmitter();
    token_filter:string;
    
    @HostBinding('class') display;
    volume_digits: number;
    price_digits: number;
    
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.token_filter = "";
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.complete = true;
    }

    get get_tokens() {
        var tokens = []
        for (var i in this.tokens) {
            var token = this.tokens[i];
            if (token.verified) {
                tokens.push(token);
            }
        }
        return tokens
    }

    get local_string_change () {
        if (this.display == "small" || this.display == "tiny") {
            return this.local.string.chg;
        } else {
            return this.local.string.change;
        }
    }

    async updateSize(event:ResizeEvent) {
        this.volume_digits = 4;
        this.price_digits = 8;
        
        this.display = "normal";
        if (event.width < 370) {
            this.display = "medium";
        }
        if (event.width < 360) {
            this.price_digits = 7;
        }
        if (event.width < 350) {
            this.volume_digits = 3;
        }
        if (event.width < 320) {
            this.display = "small";
        }
        if (event.width < 300) {
            this.price_digits = 6;
            this.volume_digits = 2;
        }
        if (event.width < 280) {
            this.price_digits = 5;
        }
        if (event.width < 260) {
            this.volume_digits = 1;
        }
        if (event.width < 250) {
            this.display = "tiny";
        }
        if (event.width < 230) {
            this.price_digits = 5;
        }
        if (event.width < 210) {
            this.price_digits = 4;
        }
    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    summary(_scope) {
        var scope = this.scopes[_scope];
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.vapaee.zero_telos.clone(),
            records: [],
            volume: this.vapaee.zero_telos.clone()
        }, scope ? scope.summary : {});
        return _summary;
    }

    clickOnToken(scope:string) {
        this.selectToken.next(scope);
    }
    

    ngOnChanges() {
        
    }

    onStateChange() {

    }
}
