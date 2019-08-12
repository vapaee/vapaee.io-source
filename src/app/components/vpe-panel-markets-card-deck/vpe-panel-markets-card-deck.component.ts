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

    @Output() tradeMarket: EventEmitter<string> = new EventEmitter();
    
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

    goToTradeMarket(market:Market) {
        
        this.tradeMarket.next(market.scope);
    }

}
