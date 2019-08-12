import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { TokenDEX } from 'projects/vapaee/dex/src/lib/token-dex.class';
import { AssetDEX } from 'projects/vapaee/dex/src/lib/asset-dex.class';


@Component({
    selector: 'vpe-panel-tokens-card',
    templateUrl: './vpe-panel-tokens-card.component.html',
    styleUrls: ['./vpe-panel-tokens-card.component.scss']
})
export class VpePanelTokensCardComponent implements OnChanges {

    @Input() public token: TokenDEX;

    @Output() tradeToken: EventEmitter<TokenDEX> = new EventEmitter();
    @Output() tokenPage: EventEmitter<TokenDEX> = new EventEmitter();
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

    goToTradeToken(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToTradeToken()", token);
        this.tradeToken.next(token);
    }

    goToTokenPage(token:TokenDEX) {
        console.log("VpePanelTokensCardComponent.goToTokenPage()", token);
        this.tokenPage.next(token);
    }
}
