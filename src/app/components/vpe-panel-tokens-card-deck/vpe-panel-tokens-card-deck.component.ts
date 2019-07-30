import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { TokenDEX } from 'projects/vapaee/dex/src/lib/token-dex.class';
import { AssetDEX } from 'projects/vapaee/dex/src/lib/asset-dex.class';


@Component({
    selector: 'vpe-panel-tokens-card-deck',
    templateUrl: './vpe-panel-tokens-card-deck.component.html',
    styleUrls: ['./vpe-panel-tokens-card-deck.component.scss']
})
export class VpePanelTokensCardDeckComponent implements OnChanges {

    @Input() public tokens: TokenDEX[];
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
    @Output() tradeToken: EventEmitter<TokenDEX> = new EventEmitter();
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.hidebackground = false;
        this.limit = 0;
        this.dex.waitTokensLoaded.then(_ => {
            setTimeout(_ => {
                if (this.limit == 0) {
                    this.limit = this.dex.tokens.length;
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
        var market = this.dex.market(_scope);
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, market ? market.summary : {
            volume: new AssetDEX(),
            price: new AssetDEX(),
            max_price: new AssetDEX(),
            min_price: new AssetDEX(),
        });

        _summary.volume = _summary.volume || new AssetDEX();
        _summary.price = _summary.price || new AssetDEX();
        _summary.max_price = _summary.max_price || new AssetDEX();
        _summary.min_price = _summary.min_price || new AssetDEX();
        
        return _summary;
    }

    onConfirmWithdraw() {
        this.confirmWithdraw.next(this.withdraw);
    }

    onConfirmDeposit() {
        this.confirmDeposit.next(this.deposit);
    }

    goToTradeToken(token:TokenDEX) {
        this.tradeToken.next(token);
    }
}
