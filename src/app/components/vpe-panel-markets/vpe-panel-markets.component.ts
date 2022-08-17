import { Component, Input, OnChanges, Output, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subscriber } from 'rxjs';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Market, VapaeeDEX } from '@vapaee/dex';




@Component({
    selector: 'vpe-panel-markets',
    templateUrl: './vpe-panel-markets.component.html',
    styleUrls: ['./vpe-panel-markets.component.scss']
})
export class VpePanelMarketsComponent implements OnChanges, OnInit, OnDestroy {

    @Input() public markets: Market[]             = [];
    @Input() public hideheader: boolean           = false;
    @Input() public margintop: boolean            = true;
    @Input() public expanded: boolean             = true; 
    @Input() public complete: boolean             = true;
    @Input() public search: string                = "";
    @Output() selectMarket: EventEmitter<string>  = new EventEmitter();
    token_filter:string                           = "";
    
    @HostBinding('class') display: string         = "full";
    volume_digits: number                         = 8;
    price_digits: number                          = 8;
    hide_symbol: boolean                          = false;
    hide_maxmin: boolean                          = false;
    private onTokensChangeSubscriber: Subscriber<any>;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.onTokensChangeSubscriber = new Subscriber<string>(_ => {

        });
    }

    get local_string_change () {
        if (this.display == "small" || this.display == "tiny") {
            return this.local.string.chg;
        } else {
            return this.local.string.change;
        }
    }

    async updateSize(event:ResizeEvent) {
        this.volume_digits = 8;
        this.price_digits = 8;
        this.hide_symbol = false;
        this.hide_maxmin = false;

        if (event.width < 691) {
            this.hide_symbol = true;
            this.hide_maxmin = true;
            this.volume_digits = 6;
        }
        
        this.display = "normal";
        if (event.width < 370) {
            this.volume_digits = 4;
            this.display = "medium";
        }
        if (event.width < 360) {
            this.price_digits = 6;
        }
        if (event.width < 350) {
            this.volume_digits = 3;
        }
        if (event.width < 320) {
            this.display = "small";
        }
        if (event.width < 300) {
            this.price_digits = 5;
            this.volume_digits = 2;
        }
        if (event.width < 280) {
            this.price_digits = 4;
        }
        if (event.width < 260) {
            this.volume_digits = 1;
        }
        if (event.width < 250) {
            this.display = "tiny";
        }
        if (event.width < 230) {
            this.price_digits = 3;
        }
        if (event.width < 210) {
            this.price_digits = 2;
        }
    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    summary(market_name: string) {
        var name = this.dex.market(market_name);
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, name ? name.summary : {});
        return _summary;
    }

    clickOnMarket(name:string) {
        this.selectMarket.next(name);
    }
    

    ngOnChanges() {
        // console.log("vpe-panel-markets", this.markets);
    }

    ngOnInit() {
        this.dex.onTokensReady.subscribe(this.onTokensChangeSubscriber);
    }

    ngOnDestroy() {
        this.onTokensChangeSubscriber.unsubscribe();
    }

    onStateChange() {

    }

    debug() {
        console.log("this", this);
        console.log("this.markets", this.markets);
    }
}
