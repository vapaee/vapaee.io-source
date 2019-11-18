import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeDEX, AssetDEX } from 'projects/vapaee/dex/src';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Market } from 'projects/vapaee/dex/src';


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
    public marketClass;
    private _max;
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

    get max() {
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
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        this._max = this.limit;
    }

    onChange() {
        
    }

    goToTradeMarket(market:Market) {
        
        this.tradeMarket.next(market.table);
    }

}
