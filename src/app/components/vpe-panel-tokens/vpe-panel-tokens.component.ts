import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Token } from 'src/app/services/utils.service';
import { Subscriber } from 'rxjs';
import { VapaeeService, TableMap } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';



@Component({
    selector: 'vpe-panel-tokens',
    templateUrl: './vpe-panel-tokens.component.html',
    styleUrls: ['./vpe-panel-tokens.component.scss']
})
export class VpePanelTokensComponent implements OnChanges {

    @Input() public tokens: Token[];
    @Input() public scopes: TableMap;
    @Output() selectToken: EventEmitter<string> = new EventEmitter();
    token_filter:string;   
    
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
        this.token_filter = "";
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

    clockOnToken(scope:string) {
        this.selectToken.next(scope);
    }
    

    ngOnChanges() {
    }

    onStateChange() {

    }
}
