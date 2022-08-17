import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService } from '../vpe-components.service';
import { Market, AssetDEX, VapaeeDEX, MarketSummary } from '@vapaee/dex';



@Component({
    selector: 'vpe-panel-markets-card',
    templateUrl: './vpe-panel-markets-card.component.html',
    styleUrls: ['./vpe-panel-markets-card.component.scss']
})
export class VpePanelMarketsCardComponent implements OnChanges {

    @Input() public market: Market = VpeComponentsService.Utils.emptyMarket();
    @Output() tradeMarket: EventEmitter<string> = new EventEmitter();
    
    // public deposit:  AssetDEX = new AssetDEX();
    // public withdraw: AssetDEX = new AssetDEX();
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

    summary(market_name: string) {
        return this.tokenSummary(market_name);
    }

    tokenSummary(market_name: string) {
        return this.marketSummary(market_name);
    }

    marketSummary(market_name: string) {
        let market: Market | null = this.dex.market(market_name);
        let _summary = Object.assign({
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
        this.tradeMarket.next(market.name);
    }

}
