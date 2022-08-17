import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, TokenDEX, AssetDEX } from '@vapaee/dex';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-tokens-card',
    templateUrl: './vpe-panel-tokens-card.component.html',
    styleUrls: ['./vpe-panel-tokens-card.component.scss']
})
export class VpePanelTokensCardComponent implements OnChanges {

    @Input() public token: TokenDEX = new TokenDEX();
    @Input() public logged: string = "guest";

    @Output() tradeToken: EventEmitter<TokenDEX> = new EventEmitter();
    @Output() swapToken: EventEmitter<TokenDEX> = new EventEmitter();
    @Output() tokenPage: EventEmitter<TokenDEX> = new EventEmitter();
    @Output() editToken: EventEmitter<TokenDEX> = new EventEmitter();
    public deposit: AssetDEX = new AssetDEX();
    public withdraw: AssetDEX = new AssetDEX();
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        
    }

    ngOnChanges() {
        
    }

    summary(_table:string) {
        return this.tokenSummary(_table);
    }

    tokenSummary(_table:string) {
        return this.marketSummary(_table);
    }

    marketSummary(_table:string) {
        var market = this.dex.market(_table);
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_currency.clone(),
            records: [],
            volume: this.dex.zero_currency.clone()
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

    goToEditTokenPage(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToEditTokenPage()", token);
        this.editToken.next(token);
    }

    goToTradeToken(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToTradeToken()", token);
        this.tradeToken.next(token);
    }

    goToSwapToken(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToSwapToken()", token);
        this.swapToken.next(token);
    }

    goToTokenPage(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToTokenPage()", token);
        this.tokenPage.next(token);
    }

    debug() {
        console.log("VpePanelTokensCardComponent");
        console.log(this);
    }
}
