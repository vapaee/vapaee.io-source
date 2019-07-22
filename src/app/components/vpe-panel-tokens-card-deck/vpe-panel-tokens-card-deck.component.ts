import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService, Asset } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Token } from 'src/app/services/utils.service';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-tokens-card-deck',
    templateUrl: './vpe-panel-tokens-card-deck.component.html',
    styleUrls: ['./vpe-panel-tokens-card-deck.component.scss']
})
export class VpePanelTokensCardDeckComponent implements OnChanges {

    @Input() public tokens: Token[];
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public hidebackground: boolean;
    @Input() public limit: number;


    @Output() confirmDeposit: EventEmitter<any> = new EventEmitter();
    @Output() confirmWithdraw: EventEmitter<any> = new EventEmitter();
    @Output() tradeToken: EventEmitter<Token> = new EventEmitter();
    public deposit: Asset;
    public withdraw: Asset;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.hidebackground = false;
        this.limit = 0;
        this.vapaee.waitTokensLoaded.then(_ => {
            setTimeout(_ => {
                if (this.limit == 0) {
                    this.limit = this.vapaee.tokens.length;
                }    
            });
        });
    }

    get get_tokens() {
        var tokens = []
        for (var i in this.tokens) {
            var token = this.tokens[i];
            if (!token.offchain) {
                tokens.push(token);
            }
        }
        return tokens
    }

    async updateSize(event:ResizeEvent) {

    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        
    }

    onChange() {
        
    }

    summary(_scope) {
        return this.tokenSummary(_scope);
    }

    tokenSummary(_scope) {
        return this.marketSummary(_scope);
    }

    marketSummary(_scope) {
        var market = this.vapaee.market(_scope);
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.vapaee.zero_telos.clone(),
            records: [],
            volume: this.vapaee.zero_telos.clone()
        }, market ? market.summary : {
            volume: new Asset(),
            price: new Asset(),
            max_price: new Asset(),
            min_price: new Asset(),
        });

        _summary.volume = _summary.volume || new Asset();
        _summary.price = _summary.price || new Asset();
        _summary.max_price = _summary.max_price || new Asset();
        _summary.min_price = _summary.min_price || new Asset();
        
        return _summary;
    }

    onConfirmWithdraw() {
        this.confirmWithdraw.next(this.withdraw);
    }

    onConfirmDeposit() {
        this.confirmDeposit.next(this.deposit);
    }

    goToTradeToken(token:Token) {
        this.tradeToken.next(token);
    }
}
