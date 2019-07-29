import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TokenOrders, VapaeeDEX, OrderRow, MarketHeader } from 'src/app/services/@vapaee/dex/dex.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';


@Component({
    selector: 'vpe-panel-orders',
    templateUrl: './vpe-panel-orders.component.html',
    styleUrls: ['./vpe-panel-orders.component.scss']
})
export class VpePanelOrdersComponent implements OnChanges {

    @Input() public orders: TokenOrders;
    @Input() public inverted: OrderRow[];
    @Input() public headers: MarketHeader;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;

    
    @Output() onClickRow: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onClickPrice: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();

    digits: {[key:string]:number};
    split: boolean;
    portrait: boolean;
    @HostBinding('class') display;
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
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    ngOnChanges() {
        delete this.inverted;
    }

    clickRow(type:string, row:OrderRow) {
        this.onClickRow.next({type: type, row: row});
    }

    clickPrice(type:string, row:OrderRow) {
        this.onClickPrice.next({type: type, row: row});
    }
}
