import { Component, Input, OnChanges, Output, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subscriber } from 'rxjs';
import { VapaeeDEX } from '@vapaee/dex';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Market } from '@vapaee/dex';



@Component({
    selector: 'vpe-panel-markets',
    templateUrl: './vpe-panel-markets.component.html',
    styleUrls: ['./vpe-panel-markets.component.scss']
})
export class VpePanelMarketsComponent implements OnChanges, OnInit, OnDestroy {

    @Input() public markets: Market[];
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public complete: boolean;
    @Input() public search: string;
    @Output() selectMarket: EventEmitter<string> = new EventEmitter();
    token_filter:string;
    
    @HostBinding('class') display;
    volume_digits: number;
    price_digits: number;
    hide_symbol: boolean;
    hide_maxmin: boolean;
    private onTokensChangeSubscriber: Subscriber<any>;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.token_filter = "";
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.complete = true;
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
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    summary(_table) {
        var table = this.dex.market(_table);
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, table ? table.summary : {});
        return _summary;
    }

    clickOnMarket(table:string) {
        this.selectMarket.next(table);
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
}
