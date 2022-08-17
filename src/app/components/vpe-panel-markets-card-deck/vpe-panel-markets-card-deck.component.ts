import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Market, AssetDEX, VapaeeDEX } from '@vapaee/dex';


@Component({
    selector: 'vpe-panel-markets-card-deck',
    templateUrl: './vpe-panel-markets-card-deck.component.html',
    styleUrls: ['./vpe-panel-markets-card-deck.component.scss']
})
export class VpePanelMarketsCardDeckComponent implements OnChanges {

    @Input() public markets: Market[]           = [];
    @Input() public hideheader: boolean         = false;
    @Input() public margintop: boolean          = true;
    @Input() public expanded: boolean           = true;
    @Input() public loading: boolean            = false;
    @Input() public title: string               = "";
    @Input() public error: string               = "";
    @Input() public hidebackground: boolean     = false;
    @Input() public limit: number               = 0;

    @Output() tradeMarket: EventEmitter<string> = new EventEmitter();
    
    // public deposit: AssetDEX                    = new AssetDEX();
    // public withdraw: AssetDEX                   = new AssetDEX();
    public marketClass: string                  = "col-4";
    private _max: number                        = 0;
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
            setTimeout(() => {
                if (this.limit == 0) {
                    this.limit = this.dex.tokens.length;
                }    
            });
        });
    }

    get get_markets() {
        return this.markets;
    }

    get max(): number {
        return this._max;
    }

    async updateSize(event:ResizeEvent) {
        // class="col-sm-12 col-md-6 col-lg-4"
        this.marketClass = "col-4";
        // console.log("event.width: ", event.width);
        this._max = this.limit;

        if (event.width < 700) {
            this.marketClass = "col-6";
            this._max++;
        }

        if (event.width < 530) {
            this.marketClass = "col-12";
            this._max = this.limit;
        }
    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        this._max = this.limit;
    }

    onChange() {
        
    }

    goToTradeMarket(market:Market) {
        this.tradeMarket.next(market.name);
    }

}
