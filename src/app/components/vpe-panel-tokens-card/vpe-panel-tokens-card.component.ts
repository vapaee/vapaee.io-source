import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, TokenDEX, AssetDEX } from 'projects/vapaee/dex/src';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-tokens-card',
    templateUrl: './vpe-panel-tokens-card.component.html',
    styleUrls: ['./vpe-panel-tokens-card.component.scss']
})
export class VpePanelTokensCardComponent implements OnChanges {

    @Input() public token: TokenDEX;
    @Input() public logged: string;

    @Output() tradeToken: EventEmitter<TokenDEX> = new EventEmitter();
    @Output() tokenPage: EventEmitter<TokenDEX> = new EventEmitter();
    @Output() editToken: EventEmitter<TokenDEX> = new EventEmitter();
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        
    }

    ngOnChanges() {
        
    }

    summary(_table) {
        return this.tokenSummary(_table);
    }

    tokenSummary(_table) {
        return this.marketSummary(_table);
    }

    marketSummary(_table) {
        var market = this.dex.market(_table);
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

    goToEditTokenPage(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToEditTokenPage()", token);
        this.editToken.next(token);
    }

    goToTradeToken(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToTradeToken()", token);
        this.tradeToken.next(token);
    }

    goToTokenPage(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToTokenPage()", token);
        this.tokenPage.next(token);
    }
}
