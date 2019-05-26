import { Component, Input, OnChanges, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TokenOrders, VapaeeService, OrderRow, TableHeader, UserOrders } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';


@Component({
    selector: 'vpe-panel-user-orders',
    templateUrl: './vpe-panel-user-orders.component.html',
    styleUrls: ['./vpe-panel-user-orders.component.scss']
})
export class VpePanelUserOrdersComponent implements OnChanges {

    @Input() public orders: TokenOrders;
    @Input() public headers: TableHeader;
    @Input() public hideheader: boolean;
    @Input() public title: string;
    @Input() public userorders: Map<string,UserOrders>;
    @Output() onClickRow: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    @Output() onClickPrice: EventEmitter<{type:string, row:OrderRow}> = new EventEmitter();
    c_loading: {[scope_id:string]:boolean};
    error:string;
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService
    ) {
        this.c_loading = {};
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
        var result = [];
        var tables = {};
        for (var i in this.userorders) {
            var scope = this.userorders[i];
            var table = scope.table;
            var sell_scope = table;
            var buy_scope = table.split(".")[1] + "." + table.split(".")[0];
            if (table.split(".")[0] == "tlos") {
                sell_scope = buy_scope;
                buy_scope = table;
            }
            table = sell_scope;
            tables[table] = tables[table] || {
                table: table,
                sell: {
                    scope: sell_scope,
                    orders: []
                },
                buy: {
                    scope: buy_scope,
                    orders: []
                }
            };

            if (scope.table == buy_scope) {
                tables[table].buy.orders = scope.orders;
            }
            if (scope.table == sell_scope) {
                tables[table].sell.orders = scope.orders;
            }
        }
        for (var t in tables) {
            result.push(tables[t]);            
        }
        this._user_orders = result;
        return result;
    }

    getSymbols(scope) {
        if (scope.split(".")[0] == "tlos")
        return scope.split(".")[1].toUpperCase();
        return scope.split(".")[0].toUpperCase();
    }

    cancel(scope, order) {
        console.log("scope", scope, "order", order);
        var key = scope + order.id;
        
        if (order.deposit.token.symbol != order.telos.token.symbol) {
            this.c_loading[key] = true;
            this.vapaee.cancelOrder("sell", order.deposit.token, order.telos.token, [order.id]).then(_ => {
                // success
                this.c_loading[key] = false;
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    this.error = "ERROR: " + JSON.stringify(JSON.parse(e), null, 4);
                } else {
                    this.error = null;
                }
                this.c_loading[key] = false;
            });;
        }
        if (order.deposit.token.symbol == order.telos.token.symbol) {
            this.c_loading[key] = true;
            this.vapaee.cancelOrder("buy", order.total.token, order.telos.token, [order.id]).then(_ => {
                // success
                this.c_loading[key] = false;
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    this.error = "ERROR: " + JSON.stringify(JSON.parse(e), null, 4);
                } else {
                    this.error = null;
                }
                this.c_loading[key] = false;
            });;
        }
        
    }    
}
