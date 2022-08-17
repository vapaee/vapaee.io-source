import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent, OrderRowclickEvent } from '../vpe-components.service';
import { TokenOrders, OrderRow, MarketHeader, VapaeeDEX } from '@vapaee/dex';

@Component({
    selector: 'vpe-panel-orders',
    templateUrl: './vpe-panel-orders.component.html',
    styleUrls: ['./vpe-panel-orders.component.scss']
})
export class VpePanelOrdersComponent implements OnChanges {

    @Input() public orders: TokenOrders         = VpeComponentsService.Utils.emptyTokenOrders();
    @Input() public headers: MarketHeader       = VpeComponentsService.Utils.emptyMarketHeader();
    @Input() public inverted: OrderRow[] | null = null;
    @Input() public hideheader: boolean         = false;
    @Input() public margintop: boolean          = true;
    @Input() public expanded: boolean           = true;

    
    @Output() onClickRow: EventEmitter<OrderRowclickEvent>   = new EventEmitter();
    @Output() onClickPrice: EventEmitter<OrderRowclickEvent> = new EventEmitter();

    split: boolean                              = false;
    portrait: boolean                           = false;
    @HostBinding('class') display: string       = "full";

    digits: {[key:string]:number};
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.split = false;
        this.digits = {
            price:8,
            total:8,
            telos:6,
            sumtelos:6,
        };        
    }

    get orders_sell_inverted() {
        // portrait display only
        // this function invertes the sell order array to display it over buy-order, so the first one must be inversed (decreasing in price)
        if (!this.inverted || this.inverted.length != this.orders.sell.length) {
            this.inverted = this.orders.sell.map(x => x);
            // console.log("this.orders.sell[0]: ", this.orders.sell[0], "this.inverted[0]", this.inverted[0]);
            this.inverted.reverse();
            // console.log("this.orders.sell[0]: ", this.orders.sell[0], "this.inverted[0]", this.inverted[0]);
            // console.log("orders_sell_inverted(): ", this.orders.sell);
            // console.log("orders_sell_inverted(): ", this.inverted);
        }        
        return this.inverted;
    }

    async updateSize(event:ResizeEvent) {
        this.split = false;
        this.digits = {
            price:8,
            total:8,
            telos:6,
            sumtelos:6,
        };
        this.display = "normal";
        this.portrait = event.device.portrait;

        if (this.portrait) {
            this.display = "small";
            this.digits.price = 4;
            this.digits.total = 4;
            this.digits.telos = 2;
            this.digits.sumtelos = 2;            
        } else {
            if (event.width < 900) {
                this.display = "medium";            
            }
            if (event.width < 850) {
                this.digits.telos = 5;
                this.digits.sumtelos = 5;
            }
            if (event.width < 830) {
                this.digits.price = 7;
                this.digits.total = 7;
            }
            if (event.width < 770) {
                this.digits.price = 6;
                this.digits.total = 6;
            }
            if (event.width < 740) {
                this.digits.telos = 4;
                this.digits.sumtelos = 4;
                this.split = true;
            }        
            if (event.width < 700) {
                this.display = "small";
            }
            if (event.width < 660) {
                this.display = "tiny";
            }     
            if (event.width < 600) {
                this.digits.price = 5;
                this.digits.total = 5;
                this.digits.telos = 3;
                this.digits.sumtelos = 3;
            }
            if (event.width < 560) {
                this.digits.price = 4;
                this.digits.total = 4;
                this.digits.telos = 2;
                this.digits.sumtelos = 2;
            }
        }
    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        this.inverted = null;
    }

    clickRow(type:string, row:OrderRow) {
        this.onClickRow.next({type, row});
    }

    clickPrice(type:string, row:OrderRow) {
        this.onClickPrice.next({type, row});
    }
}

