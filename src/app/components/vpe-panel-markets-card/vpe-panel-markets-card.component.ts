import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, AssetDEX } from '@vapaee/dex';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Market } from '@vapaee/dex';


@Component({
    selector: 'vpe-panel-markets-card',
    templateUrl: './vpe-panel-markets-card.component.html',
    styleUrls: ['./vpe-panel-markets-card.component.scss']
})
export class VpePanelMarketsCardComponent implements OnChanges {

    @Input() public market: Market;
    @Output() tradeMarket: EventEmitter<string> = new EventEmitter();
    
    public deposit: AssetDEX;
    public withdraw: AssetDEX;
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
    }

    ngOnChanges() {
        if (this.market) console.log("this.market", this.market);
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

    goToTradeMarket(market:Market) {
        this.tradeMarket.next(market.scope);
    }

}
