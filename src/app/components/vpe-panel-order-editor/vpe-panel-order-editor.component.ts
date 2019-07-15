import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { VapaeeService, Asset, TokenOrders, Order, OrderRow } from 'src/app/services/vapaee.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { Token } from 'src/app/services/utils.service';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { Feedback } from 'src/app/services/feedback.service';


@Component({
    selector: 'vpe-panel-order-editor',
    templateUrl: './vpe-panel-order-editor.component.html',
    styleUrls: ['./vpe-panel-order-editor.component.scss']
})
export class VpePanelOrderEditorComponent implements OnChanges {

    payment: Asset;
    fee: Asset;
    money: Asset;
    asset: Asset;
    can_sell: boolean;
    can_buy: boolean;
    feed: Feedback;
    loading: boolean;
    cant_operate: boolean;
    toolow: boolean;
    portrait: boolean;
    c_loading: {[id:string]:boolean};
    wants: string;

    deposits_comodity: Asset;
    deposits_currency: Asset;

    @Input() public owner: string;
    @Input() public comodity: Token;
    @Input() public currency: Token;
    @Input() public deposits: Asset[];
    @Input() public buyorders: OrderRow[];
    @Input() public sellorders: OrderRow[];
    @Input() public hideheader: boolean;
    @Input() public margintop: boolean;
    @Input() public expanded: boolean;

    public own: {sell:Order[], buy:Order[]};
    price: Asset;
    amount: Asset;

    @HostBinding('class') display;
    
    constructor(
        public vapaee: VapaeeService,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
        this.hideheader = false;
        this.margintop = true;
        this.expanded = true; 
        this.feed = new Feedback();
        this.loading = false;
        this.c_loading = {};
        this.deposits_comodity = new Asset();
        this.deposits_currency = new Asset();
    }

    get get_currency() {
        return this.currency || {};
    }
    get get_comodity() {
        return this.comodity || {};
    }
    get get_amount() {
        return this.amount || new Asset();
    }
    get get_payment() {
        return this.payment || new Asset();
    }

    orders_decimals: number
    async updateSize(event:ResizeEvent) {
        this.display = "normal";
        this.portrait = false;
        this.orders_decimals = 8;

        if (event.device.wide) {
            if (event.width < 900) {
                this.display = "medium";            
            }
            if (event.width < 700) {
                this.display = "tiny";
            }
            if (event.width < 660) {
                this.display = "small";
            }    
        } else {
            // portrait
            if (event.width < 800) {
                this.portrait = true;
            }
            if (event.width < 700) {
                this.orders_decimals = 7;
            }
            if (event.width < 600) {
                this.orders_decimals = 6;
            }
            if (event.width < 500) {
                this.orders_decimals = 5;
            }
            if (event.width < 400) {
                this.orders_decimals = 4;
            }
        }
    }

    onResize(event:ResizeEvent) {
        setTimeout(_ => {
            this.updateSize(event);
        });
    }

    calculate() {
        setTimeout(_ => {
            if (!this.price) this.restaure();
            if (!this.price) return;
            
            this.cant_operate = true;
            this.toolow = false;
            // console.log("calculate");

            this.deposits_comodity = new Asset("0 " + this.comodity.symbol, this.vapaee);
            this.deposits_currency = new Asset("0 " + this.currency.symbol, this.vapaee);


            var a = this.price.amount;
            this.payment.amount = this.price.amount.multipliedBy(this.amount.amount);
    
            // check if the user can sell. Does he/she have comodity?
            this.asset = new Asset("0.0 " + this.comodity.symbol, this.vapaee);
            this.can_sell = false;
            for (var i in this.deposits) {
                if (this.deposits[i].token == this.comodity) {
                    this.deposits_comodity = this.deposits[i].clone();
                    if (this.deposits[i].amount.toNumber() > 0) {
                        this.can_sell = true;
                        this.asset = this.deposits[i];
                    }
                }
            }
            // Does he/she have enough comodity?
            if (this.can_sell) {
                if (this.asset.amount.isLessThan(this.amount.amount)) {
                    this.can_sell = false;
                }
            }
    
            // check if the user can buy. Does he/she have currency?
            this.money = new Asset("0.0 " + this.currency.symbol, this.vapaee);
            this.can_buy = false;
            for (var i in this.deposits) {
                if (this.deposits[i].token == this.currency) {
                    this.deposits_currency = this.deposits[i].clone();
                    if (this.deposits[i].amount.toNumber() > 0) {
                        this.can_buy = true;
                        this.money = this.deposits[i];
                    }
                }
            }
            // Does he/she have enough currency?
            if (this.can_buy) {
                if (this.money.amount.isLessThan(this.payment.amount)) {
                    this.can_buy = false;
                }
            }

            if (this.payment.amount.isLessThan(1) && this.amount.amount.isLessThan(1)) {
                this.toolow = true;
                this.cant_operate = false;
            }

            if (this.payment.amount.toNumber()) {
                this.cant_operate = false;
            }            
            
            if (!this.wants) {
                if (this.can_buy) {
                    this.wantsTo("buy");
                } else {
                    this.wantsTo("sell");
                }
            }

            /*if (!this.can_buy && !this.can_sell) {
                this.wants = "";
            }*/
    
            // console.log("VpeOrderEditorComponent.calculate() ---->", [this.deposits, this.money, this.asset]);    
        });
    }

    wantsTo(what, takeprice:boolean = false) {
        console.assert(what == "sell" || what == "buy", "ERROR: wantsTo what??", what);
        // if (what == "sell" && !this.can_sell) return;
        // if (what == "buy" && !this.can_buy) return;
        this.wants = what;

        // set price only when is 0
        if (this.price.amount.isEqualTo(0)) {
            if (what == "sell" && this.buyorders && takeprice) {
                console.log("wantsTo",what, this.buyorders);
                if (this.buyorders.length > 0) {
                    var order = this.buyorders[0];
                    console.log("******* order", order);
                    this.price = order.price;
                }
            }
    
            if (what == "buy" && this.sellorders && takeprice) {
                console.log("wantsTo",what, this.sellorders);
                if (this.sellorders.length > 0) {
                    var order = this.sellorders[0];
                    console.log("******* order", order);
                    this.price = order.price;
                }
            }    
        }

        this.calculate();
    }

    setPrice(a:Asset) {
        this.price = a;
        this.ngOnChanges();
    }
    
    setAmount(a:Asset) {
        this.feed.clearError("form");
        this.amount = a;
        this.ngOnChanges();
    }

    sellAll() {
        this.feed.clearError("form");
        this.setAmount(this.deposits_comodity);
        this.wantsTo("sell");
    }
    
    buyAll() {
        this.feed.clearError("form");
        console.log("buyAll()", this.payment);
        this.wantsTo("buy");
        if (this.price.amount.toNumber() == 0) {
            this.feed.setError("form", this.local.string.priceNotZero);
        } else {
            this.payment.amount = this.deposits_currency.amount.minus(0.0001);
            var amount = this.payment.amount.dividedBy(this.price.amount);
            this.setAmount(new Asset(amount, this.deposits_comodity.token));    
        }
    }
    
    onChange(event:any) {
        this.feed.clearError("form");
        this.calculate();
    }

    reset() {
        this.amount = null;
        this.payment = null;
        this.comodity = null;
        this.currency = null;
        this.price = null;
        this.ngOnChanges();
    }

    private restaure() {
        if (this.comodity && !this.amount) {
            this.amount = new Asset("0.0000 " + this.comodity.symbol, this.vapaee);
        }

        if (this.currency && !this.payment) {
            this.payment = new Asset("0.0000 " + this.currency.symbol, this.vapaee);
        }

        if (this.currency && !this.price) {
            this.price = new Asset("0.0000 " + this.currency.symbol, this.vapaee);
        }

        if (this.price && this.amount && this.deposits && this.deposits.length > 0) {
            this.calculate();
        }

        console.log("this.orders ------------------>", this.sellorders, this.buyorders);

        if (this.sellorders && this.own.sell.length == 0) {
            // console.log("this.sellorders.length", this.sellorders);
            for (var i=0; i<this.sellorders.length; i++) {
                var sell = this.sellorders[i];
                for (var j=0; j<sell.orders.length; j++) {
                    var order = sell.orders[j];
                    if (order.owner == this.owner) {
                        this.own.sell.push(order);
                    }
                }
            }
        }
        if (this.buyorders && this.own.buy.length == 0) {
            // console.log("this.buyorders.length", this.buyorders.length);
            for (var i=0; i<this.buyorders.length; i++) {
                var buy = this.buyorders[i];
                for (var j=0; j<buy.orders.length; j++) {
                    var order = buy.orders[j];
                    if (order.owner == this.owner) {
                        this.own.buy.push(order);
                    }
                }
            }
        }
    }

    ngOnChanges() {
        // console.log("VpePanelOrderEditorComponent.ngOnChanges()");
        this.own = {sell:[],buy:[]};
        // changes from outside
        return this.vapaee.waitTokensLoaded.then(_ => this.restaure());
    }

    debug() {
        console.log("-------");
        console.log(this);
        console.log("-------");
    }
    

    buy() {
        if (!this.can_buy) return;
        if (this.payment.amount.toNumber() == 0) return;
        console.log("BUY");
        this.loading = true;
        this.feed.clearError("form");
        this.vapaee.createOrder("buy", this.amount, this.price).then(_ => {
            // success
            this.loading = false;
        }).catch(e => {
            console.log(e);
            if (typeof e == "string") {
                this.feed.setError("form", "ERROR: " + JSON.stringify(JSON.parse(e), null, 4));
            } else {
                this.feed.setError("form", "ERROR: " + JSON.stringify(e, null, 4));
            }
            this.loading = false;
        });
    }

    sell() {
        if (!this.can_sell) return;
        // if (this.payment.amount.toNumber() == 0) return;
        console.log("SELL");
        this.loading = true;
        this.feed.clearError("form");
        this.vapaee.createOrder("sell", this.amount, this.price).then(_ => {
            // success
            this.loading = false;
        }).catch(e => {
            console.log(e);
            if (typeof e == "string") {
                this.feed.setError("form", "ERROR: " + JSON.stringify(JSON.parse(e), null, 4));
            } else {
                this.feed.setError("form", "ERROR: " + JSON.stringify(e, null, 4));
            }
            this.loading = false;
        });
    }

    cancel(order) {
        var key = order.id;
        this.feed.clearError("orders");
        if (order.deposit.token.symbol != order.telos.token.symbol) {
            this.c_loading[key] = true;
            this.vapaee.cancelOrder("sell", order.deposit.token, order.telos.token, [order.id]).then(_ => {
                // success
                this.c_loading[key] = false;
            }).catch(e => {
                console.log(e);
                if (typeof e == "string") {
                    this.feed.setError("orders", "ERROR: " + JSON.stringify(JSON.parse(e), null, 4));
                } else {
                    this.feed.clearError("orders");
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
                    this.feed.setError("orders", "ERROR: " + JSON.stringify(JSON.parse(e), null, 4));
                } else {
                    this.feed.clearError("orders");
                }
                this.c_loading[key] = false;
            });;
        }        
    }

}

