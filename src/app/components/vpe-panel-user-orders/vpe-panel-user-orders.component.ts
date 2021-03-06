import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { TokenOrders, MarketHeader, UserOrders, OrderRow, VapaeeDEX } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';


@Component({
    selector: 'vpe-panel-user-orders',
    templateUrl: './vpe-panel-user-orders.component.html',
    styleUrls: ['./vpe-panel-user-orders.component.scss']
})
export class VpePanelUserOrdersComponent implements OnChanges {

    @Input() public orders: TokenOrders;
    @Input() public headers: MarketHeader;
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;
    @Input() public title: string;
    @Input() public userorders: Map<string,UserOrders>;
    @Output() onClickRow: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onClickPrice: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onTableSelected: EventEmitter<string> = new EventEmitter();
    feed: Feedback;

    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.feed = new Feedback();
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
    }

    async updateSize(event:ResizeEvent) {

    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    selectTable(table:string) {
        this.onTableSelected.next(table);
    }

    ngOnChanges() {
        this._user_orders = null;
    }

    clickRow(type:string, row:OrderRow) {
        this.onClickRow.next({type: type, row: row});
    }

    clickPrice(type:string, row:OrderRow) {
        this.onClickPrice.next({type: type, row: row});
    }

    _user_orders: any;
    get user_orders() {
        if (this._user_orders) return this._user_orders;
        let result = [];
        let tables = {};
        for (let i in this.userorders) {
            // ---------------
            let table = this.userorders[i].table;
            let sell_table = table;
            let buy_table = table.split(".")[1] + "." + table.split(".")[0];
            if (table.split(".")[0] == "tlos") {
                sell_table = buy_table;
                buy_table = table;
            }
            table = sell_table;
            // ---------------
            tables[table] = tables[table] || {
                table: table,
                sell: {
                    table: sell_table,
                    orders: []
                },
                buy: {
                    table: buy_table,
                    orders: []
                }
            };
            
            if (table == buy_table) {
                tables[table].buy.orders = this.userorders[i].orders;
            }
            if (table == sell_table) {
                tables[table].sell.orders = this.userorders[i].orders;
            }
        }
        for (var t in tables) {
            result.push(tables[t]);            
        }
        this._user_orders = result;
        return result;
    }

    getSymbols(table) {
        if (table.split(".")[0] == "tlos")
            return table.split(".")[1].toUpperCase();
        return table.split(".")[0].toUpperCase();
    }

    cancel(table, order) {
        console.log("table", table, "order", order);
        var key = table + "-" + order.id;
        
        if (order.deposit.token.symbol != order.telos.token.symbol) {
            this.feed.setLoading(key);
            this.dex.cancelOrder("sell", order.deposit.token, order.telos.token, [order.id]).then(_ => {
                // success
                this.feed.setLoading(key, false);
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    order.error = "ERROR: " + JSON.stringify(JSON.parse(e), null, 4);
                } else {
                    order.error = e.message;
                }
                this.feed.setLoading(key, false);
            });;
        }
        if (order.deposit.token.symbol == order.telos.token.symbol) {
            this.feed.setLoading(key);
            this.dex.cancelOrder("buy", order.total.token, order.telos.token, [order.id]).then(_ => {
                // success
                this.feed.setLoading(key, false);
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    order.error = "ERROR: " + JSON.stringify(JSON.parse(e), null, 4);
                } else {
                    order.error = e.message;
                }
                this.feed.setLoading(key, false);
            });;
        }
        
    }    
}
