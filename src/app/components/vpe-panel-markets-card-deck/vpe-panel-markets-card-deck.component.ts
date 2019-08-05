import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX } from 'projects/vapaee/dex/src/lib/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { TokenDEX } from 'projects/vapaee/dex/src/lib/token-dex.class';
import { AssetDEX } from 'projects/vapaee/dex/src/lib/asset-dex.class';
import { Market } from '@vapaee/dex';


@Component({
    selector: 'vpe-panel-markets-card-deck',
    templateUrl: './vpe-panel-markets-card-deck.component.html',
    styleUrls: ['./vpe-panel-markets-card-deck.component.scss']
})
export class VpePanelMarketsCardDeckComponent implements OnChanges {

    @Input() public markets: Market[];
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public loading: boolean;
    @Input() public error: string;
    @Input() public hidebackground: boolean;
    @Input() public limit: number;

    @Output() tradeMarket: EventEmitter<TokenDEX> = new EventEmitter();
    
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

    get get_markets() {
        return this.markets;
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

    goToTradeMarket(token:TokenDEX) {
        this.tradeMarket.next(token);
    }

}
