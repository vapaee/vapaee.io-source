import { Component, Input, OnChanges, Output, HostBinding } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { AssetDEX, TokenDEX, OrderRow, Order, CreateOrder, VapaeeDEX, SellOrBuy, CancelOrder } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';
import { TransactionResult } from '@vapaee/wallet';
import { Subject } from 'rxjs';


@Component({
    selector: 'vpe-panel-order-editor',
    templateUrl: './vpe-panel-order-editor.component.html',
    styleUrls: ['./vpe-panel-order-editor.component.scss']
})
export class VpePanelOrderEditorComponent implements OnChanges {

    payment: AssetDEX                                = new AssetDEX();
    fee: AssetDEX                                    = new AssetDEX();
    money: AssetDEX                                  = new AssetDEX();
    asset: AssetDEX                                  = new AssetDEX();
    can_sell: boolean                                = false;
    can_buy: boolean                                 = false;
    feed: Feedback                                   = new Feedback();
    loading: boolean                                 = false;
    cant_operate: boolean                            = false;
    toolow: boolean                                  = false;
    portrait: boolean                                = false;
    c_loading: {[id:string]:boolean}                 = {};
    wants: SellOrBuy                                 = "sell";

    deposits_commodity: AssetDEX                     = new AssetDEX();
    deposits_currency: AssetDEX                      = new AssetDEX();
    public own: {sell:Order[], buy:Order[]}          = {sell:[], buy:[]};

    @Input() public clientid: number                 = 0;
    @Input() public owner: string                    = "";
    @Input() public commodity: TokenDEX              = new TokenDEX();
    @Input() public currency: TokenDEX               = new TokenDEX();
    @Input() public deposits: AssetDEX[]             = [];
    @Input() public buyorders: OrderRow[]            = [];
    @Input() public sellorders: OrderRow[]           = [];
    @Input() public hideheader: boolean              = false;
    @Input() public margintop: boolean               = true;
    @Input() public expanded: boolean                = true;

    amount: AssetDEX                                 = new AssetDEX();
    price: AssetDEX                                  = new AssetDEX();

    @HostBinding('class') display: string            = "full";
    
    @Output() public makeSwap: Subject<CreateOrder> = new Subject();
    @Output() public makeOrder: Subject<CreateOrder> = new Subject();
    @Output() public makeCancel: Subject<CancelOrder> = new Subject();
    @Output() public priceChange: Subject<AssetDEX> = new Subject();
    @Output() public amountChange: Subject<AssetDEX> = new Subject();
    constructor(
        public dex: VapaeeDEX,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {
    }

    orders_decimals: number = 8;
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
        setTimeout(() => {
            this.updateSize(event);
        });
    }

    calculate() {
        setTimeout(() => {
            if (!this.price.ok || !this.commodity.ok || !this.currency.ok || !this.payment.ok || !this.amount.ok) this.restaure();
            if (!this.price.ok || !this.commodity.ok || !this.currency.ok || !this.payment.ok || !this.amount.ok) return;

            
            this.cant_operate = true;
            this.toolow = false;
            // console.error("------------------------------");

            this.deposits_commodity = new AssetDEX("0 " + this.commodity.symbol, this.dex);
            this.deposits_currency = new AssetDEX("0 " + this.currency.symbol, this.dex);

            // console.error("this.deposits_commodity:", this.deposits_currency);
            // console.error("this.deposits_currency:", this.deposits_currency);

            var a = this.price.amount;
            this.payment.amount = this.price.amount.multipliedBy(this.amount.amount);
    
            // check if the user can sell. Does he/she have commodity?
            this.asset = new AssetDEX("0.0 " + this.commodity.symbol, this.dex);
            this.can_sell = false;
            for (var i in this.deposits) {
                // console.error("this.deposits[i].token.id:", this.deposits[i].token.id);
                if (this.deposits[i].token.id == this.commodity.id) {
                    this.deposits_commodity = this.deposits[i].clone();

                    if (this.deposits[i].amount.toNumber() > 0) {
                        this.can_sell = true;
                        this.asset = this.deposits[i];
                    }
                }
            }
            // console.error("------------------------------");
            // Does he/she have enough commodity?
            if (this.can_sell) {
                if (this.asset.amount.isLessThan(this.amount.amount)) {
                    this.can_sell = false;
                }
            }
    
            // check if the user can buy. Does he/she have currency?
            this.money = new AssetDEX("0.0 " + this.currency.symbol, this.dex);
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

    wantsTo(what:SellOrBuy, takeprice:boolean = false) {
        console.assert(what == "sell" || what == "buy", "ERROR: wantsTo what??", what);
        // if (what == "sell" && !this.can_sell) return;
        // if (what == "buy" && !this.can_buy) return;
        this.wants = what;
        this.showswap = false;

        // set price only when is 0
        if (!this.price || this.price.amount.isEqualTo(0)) {
            if (what == "sell" && this.buyorders && takeprice) {
                console.log("wantsTo",what, this.buyorders);
                if (this.buyorders.length > 0) {
                    var order = this.buyorders[0];
                    this.price = order.price;
                }
            }
    
            if (what == "buy" && this.sellorders && takeprice) {
                console.log("wantsTo",what, this.sellorders);
                if (this.sellorders.length > 0) {
                    var order = this.sellorders[0];
                    this.price = order.price;
                }
            }    
        }

        this.calculate();
    }

    showswap: boolean = false;
    setSwap(swap:boolean) {
        this.showswap = swap;
    }

    setPrice(a:AssetDEX) {
        this.price = a;
        this.priceChange.next(this.price);
        this.ngOnChanges();
    }
    
    setAmount(a:AssetDEX) {
        this.feed.clearError("form");
        this.amount = a;
        this.amountChange.next(this.amount);
        this.ngOnChanges();
    }

    sellAll() {
        this.feed.clearError("form");
        this.setAmount(this.deposits_commodity);
        this.wantsTo("sell");
    }
    
    buyAll() {
        this.feed.clearError("form");
        
        // Check if the Assets and Tokens are initialized
        if (!this.payment.ok || !this.price.ok) this.restaure();
        if (!this.payment.ok || !this.price.ok) return;

        console.log("buyAll()", this.payment);
        this.wantsTo("buy");
        if (this.price.amount.toNumber() == 0) {
            this.feed.setError("form", this.local.string.priceNotZero);
        } else {
            this.payment.amount = this.deposits_currency.amount.minus(0.0001);
            var amount = this.payment.amount.dividedBy(this.price.amount);
            this.setAmount(new AssetDEX(amount, this.deposits_commodity.token));    
        }
    }

    onAmountChange(a:AssetDEX) {
        this.amount = a;
        this.onAnyValueChange();
        this.amountChange.next(this.amount);
    }
    
    onPriceChange(a:AssetDEX) {
        this.price = a;
        this.onAnyValueChange();
        this.priceChange.next(this.price);
    }

    onAnyValueChange() {
        this.feed.clearError("form");
        this.calculate();
    }



    reset() {
        this.amount    = new AssetDEX();
        this.payment   = new AssetDEX();
        this.commodity = new TokenDEX();
        this.currency  = new TokenDEX();
        this.price     = new AssetDEX();
        this.amountChange.next(this.amount);
        this.priceChange.next(this.price);
        this.ngOnChanges();
    }

    private restaure() {
        if (this.commodity.ok && !this.amount.ok) {
            this.amount = new AssetDEX("0.0000 " + this.commodity.symbol, this.dex);
            this.amountChange.next(this.amount);
        }

        if (this.currency.ok && !this.payment.ok) {
            this.payment = new AssetDEX("0.0000 " + this.currency.symbol, this.dex);
        }

        if (this.currency.ok && !this.price.ok) {
            this.price = new AssetDEX("0.0000 " + this.currency.symbol, this.dex);
            this.priceChange.next(this.price);
        }

        if (this.price.ok && this.amount.ok && this.deposits && this.deposits.length > 0) {
            this.calculate();
        }

        // console.log("this.orders ------------------>", this.sellorders, this.buyorders);

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
        return this.dex.waitTokensLoaded.then(_ => this.restaure());
    }

    debug() {
        console.log("-------");
        console.log(this);
        console.log("-------");
    }
    

    buy() {
        if (!this.can_buy) return;

        // Check if the Assets and Tokens are initialized
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) this.restaure();
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) return;

        if (this.payment.amount.toNumber() == 0) return;

        this.makeOrder.next({
            type: "buy",
            price: this.price,
            quantity: this.amount
        });
    }

    sell() {
        if (!this.can_sell) return;
        // if (this.payment.amount.toNumber() == 0) return;

        // Check if the Assets and Tokens are initialized
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) this.restaure();
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) return;

        this.makeOrder.next({
            type: "sell",
            price: this.price,
            quantity: this.amount
        });
    }

    swap() {
        let type: SellOrBuy = "buy";
        if (this.wants == "sell") type = "sell";
        this.makeSwap.next({
            type: type,
            price: this.price,
            quantity: this.amount
        });
    }

    cancel(order: Order) {
        let key = "sell-" + order.id;
        this.feed.clearError("orders");
        if (order.deposit.token.symbol != order.currency.token.symbol) {
            key = "sell-" + order.id;
            this.c_loading[key] = true;
            console.log(key, this.c_loading);

            this.makeCancel.next({
                type: "sell",
                commodity: <TokenDEX>order.deposit.token,
                currency: <TokenDEX>order.currency.token,
                numbers: [order.id]
            });

            /*
            this.dex.cancelOrder("sell", <TokenDEX>order.deposit.token, <TokenDEX>order.currency.token, [order.id]).then(_ => {
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
            });
            */
        }
        if (order.deposit.token.symbol == order.currency.token.symbol) {
            key = "buy-" + order.id;
            this.c_loading[key] = true;
            console.log(key, this.c_loading);
            /*
            this.dex.cancelOrder("buy", <TokenDEX>order.total.token, <TokenDEX>order.currency.token, [order.id]).then(_ => {
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
            */

            this.makeCancel.next({
                type: "buy",
                commodity: <TokenDEX>order.total.token,
                currency: <TokenDEX>order.currency.token,
                numbers: [order.id]
            });

        }        
    }


}

