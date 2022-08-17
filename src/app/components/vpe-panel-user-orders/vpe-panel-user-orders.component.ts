import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { TokenOrders, MarketHeader, UserOrders, OrderRow, VapaeeDEX, Order, TokenDEX, UserPairOrders } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';


@Component({
    selector: 'vpe-panel-user-orders',
    templateUrl: './vpe-panel-user-orders.component.html',
    styleUrls: ['./vpe-panel-user-orders.component.scss']
})
export class VpePanelUserOrdersComponent implements OnChanges {

    @Input() public orders: TokenOrders = VpeComponentsService.Utils.emptyTokenOrders();
    @Input() public headers: MarketHeader = VpeComponentsService.Utils.emptyMarketHeader();
    @Input() public hideheader: boolean = false;
    @Input() public margintop: boolean = true;
    @Input() public expanded: boolean = true;
    @Input() public title: string = "";
    @Input() public userpairorders: UserPairOrders[] = [];
    @Output() onClickRow: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onClickPrice: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onTableSelected: EventEmitter<string> = new EventEmitter();
    feed: Feedback = new Feedback();

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
    }

    async updateSize(event:ResizeEvent) {

    }

    onResize(event:ResizeEvent) {
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    selectTable(table:string) {
        this.onTableSelected.next(table);
    }

    ngOnChanges() {
        console.error("VpePanelUserOrdersComponent.ngOnChanges() userorders: ");
        this._user_orders = [];
        for (let i in this.userpairorders) {
            this._user_orders.push(this.userpairorders[i]);
        }
    }

    clickRow(type:string, row:OrderRow) {
        this.onClickRow.next({type: type, row: row});
    }

    clickPrice(type:string, row:OrderRow) {
        this.onClickPrice.next({type: type, row: row});
    }

    _user_orders: UserPairOrders[] = [];
    get user_orders(): UserPairOrders[] {
        return this._user_orders;
    }

    cancel(table: string, order: Order) {
        console.log("table", table, "order", order);
        var key = table + "-" + order.id;
        
        if (order.deposit.token.symbol != order.currency.token.symbol) {
            this.feed.setLoading(key);
            this.dex.cancelOrder("sell", <TokenDEX>order.deposit.token, <TokenDEX>order.currency.token, [order.id]).then(_ => {
                // success
                this.feed.setLoading(key, false);
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    this.feed.setError(key, "ERROR: " + JSON.stringify(JSON.parse(e), null, 4));
                } else {
                    this.feed.setError(key, e.message);
                }
                this.feed.setLoading(key, false);
            });;
        }
        if (order.deposit.token.symbol == order.currency.token.symbol) {
            this.feed.setLoading(key);
            this.dex.cancelOrder("buy", <TokenDEX>order.total.token, <TokenDEX>order.currency.token, [order.id]).then(_ => {
                // success
                this.feed.setLoading(key, false);
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    this.feed.setError(key, "ERROR: " + JSON.stringify(JSON.parse(e), null, 4));
                } else {
                    this.feed.setError(key, e.message);
                }
                this.feed.setLoading(key, false);
            });;
        }
        
    }

    debug() {
        console.log("this.userpairorders", this.userpairorders);
        console.log("this.headers", this.headers);
        console.log("this.orders", this.orders);
        console.log("this.user_orders", this.user_orders);
    }
}
