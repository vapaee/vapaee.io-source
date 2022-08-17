import { Component, Input, OnChanges, Output, HostBinding, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { VpeComponentsService, ResizeEvent } from '../vpe-components.service';
import { AssetDEX, TokenDEX, OrderRow, Order, VapaeeDEX, SellOrBuy, InOutAssets, SwapSummary, VapaeeDEXSwap } from '@vapaee/dex';
import { Feedback } from '@vapaee/feedback';
import { Subject, Subscriber } from 'rxjs';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'vpe-panel-swap',
    templateUrl: './vpe-panel-swap.component.html',
    styleUrls: ['./vpe-panel-swap.component.scss']
})
export class VpePanelSwapComponent implements OnChanges, OnInit, OnDestroy {

    fee: AssetDEX                                   = new AssetDEX();
    money: AssetDEX                                 = new AssetDEX();
    asset: AssetDEX                                 = new AssetDEX();
    can_sell: boolean                               = false;
    can_buy: boolean                                = false;
    feed: Feedback                                  = new Feedback();
    loading: boolean                                = false;
    cant_operate: boolean                           = false;
    toolow: boolean                                 = false;
    portrait: boolean                               = false;
    c_loading: {[id:string]:boolean}                = {};
    wants: SellOrBuy                                = "sell";

    deposits_commodity: AssetDEX                    = new AssetDEX();
    deposits_currency: AssetDEX                     = new AssetDEX();

    @Input() public clientid: number                = 0;
    @Input() public owner: string                   = "";
    @Input() public commodity: TokenDEX             = new TokenDEX();
    @Input() public currency: TokenDEX              = new TokenDEX();
    // @Input() public deposits: AssetDEX[]            = [];
    @Input() public buyorders: OrderRow[]           = [];
    @Input() public sellorders: OrderRow[]          = [];
    @Input() public hideheader: boolean             = false;
    @Input() public margintop: boolean              = true;
    @Input() public expanded: boolean               = true;
    @Input() public balance_from: AssetDEX          = new AssetDEX();
    @Input() public balance_to:   AssetDEX          = new AssetDEX();
    @Input() public summary: SwapSummary | null     = null;

    // public own: {sell:Order[], buy:Order[]}         = {sell:[], buy:[]};
    @Output() fromChanged:  Subject<AssetDEX>       = new Subject();
    @Output() toChanged:    Subject<AssetDEX>       = new Subject();
    @Output() valueChanged: Subject<InOutAssets>    = new Subject();
    @Output() makeSwap:     Subject<void>           = new Subject();

    @HostBinding('class') display: string           = "full";

    constructor(
        public dex: VapaeeDEX,
        public swap: VapaeeDEXSwap,
        public local: LocalStringsService,
        public service: VpeComponentsService
    ) {  
    }

    // from & to token lists ---------
    _from_list: TokenDEX[] | null             = null;
    _to_list:   TokenDEX[] | null             = null;

    get_x_list(type:string) {
        var list:TokenDEX[] | null = type=="to"?this._to_list:this._from_list || null;
        if (list != null) return list;

        list = [this.dex.currency];
        type=="to" ? this._to_list = list : this._from_list = list;

        this.dex.waitTokenStats.then(() => {

            list = [];
            var tokens: TokenDEX[] = [];
            tokens = tokens.concat(
                this.swap.pools.available.map(pool => this.dex.getTokenNow(pool.state.currency.token.symbol) as TokenDEX )
            )
            tokens = tokens.concat(
                this.swap.pools.available.map(pool => this.dex.getTokenNow(pool.state.commodity.token.symbol) as TokenDEX )
            );

            if (tokens.length == 0) {
                console.error("--------------------------------");
                console.error("--------------------------------");
                console.error(tokens);
                console.error(this.swap.pools.available);
                console.error("--------------------------------");
                console.error("--------------------------------");                
            }

            tokens.push(this.dex.currency);

            // filter repeated tokens in the list.
            // Two tokens are the same if the symbol is the same.
            var symbols: string[] = [];
            var filtered: TokenDEX[] = [];
            tokens.forEach(token => {
                if (symbols.indexOf(token.symbol) == -1) {
                    symbols.push(token.symbol);
                    filtered.push(token);
                }
            });
            tokens = filtered;

            for (var a in tokens) {
                var token = tokens[a];
                if (token.offchain) continue;
                if (token.symbol == (type=="to"?this.to:this.from).token.symbol) continue;
                list.push(token);
            }
            type=="to" ? this._to_list = list : this._from_list = list;
            
        });

        return list;
        // console.error("get_x_list", type, list);
        // return type=="to"?this._to_list:this._from_list;
    }

    get from_list(): TokenDEX[] {
        return this.get_x_list("from") || [];
    }

    get to_list(): TokenDEX[] {
        return this.get_x_list("to") || [];
    }

    // --------------------------------

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


    wantsTo(what:SellOrBuy, takeprice:boolean = false) {
        console.assert(what == "sell" || what == "buy", "ERROR: wantsTo what??", what);
        // if (what == "sell" && !this.can_sell) return;
        // if (what == "buy" && !this.can_buy) return;
        this.wants = what;

        // set price only when is 0
        if (!this.price || this.price.amount.isEqualTo(0)) {
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
    }

    setPrice(a:AssetDEX) {
        this.price = a;
        this.ngOnChanges();
    }
    
    setAmount(a:AssetDEX) {
        this.feed.clearError("form");
        this.amount = a;
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
        if (!this.payment || !this.price) this.restaure();
        if (!this.payment || !this.price) return;

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
    
    onChange(event:AssetDEX, type:string) {
        console.log("VpePanelSwapComponent.onChange()", event.str, type);
        this.feed.clearError("form");
        
        if (type == "from") {
            this.to = new AssetDEX(0, this.currency);
            this.from = event;
        } else {
            this.from = new AssetDEX(0, this.commodity);
            this.to = event;
        }

        this.valueChanged.next({ in: this.from, out: this.to });
    }

    reset() {
        this.amount    = new AssetDEX();
        this.payment   = new AssetDEX();
        this.commodity = new TokenDEX();
        this.currency  = new TokenDEX();
        this.price     = new AssetDEX();
        this.ngOnChanges();
    }

    price: AssetDEX           = new AssetDEX();
    amount: AssetDEX          = new AssetDEX();
    payment: AssetDEX         = new AssetDEX();
    @Input() from: AssetDEX   = new AssetDEX();
    @Input() to: AssetDEX     = new AssetDEX();

    counter: number = 0;
    private restaure() {
        if (!this.currency) return;
        if (!this.commodity) return;
       
        this.counter += 1;
        if (this.counter > 1000) {
            console.error("ERROR: VpePanelSwapComponent.restaure()");
        }
        console.debug("VpePanelSwapComponent.restaure()");
        

        if (!this.from.ok || this.commodity.id != this.from.token.id) {
            // console.error("SETTING FROM", this.from ? this.from.token.id : "null", this.commodity.id);
            this.from = new AssetDEX(this.from?this.from.amount:0, this.commodity);
        }

        if (!this.to.ok || this.currency.id != this.to.token.id) {
            // console.error("SETTING TO", this.to ? this.to.token.id : "null", this.currency.id);
            this.to = new AssetDEX(this.to?this.to.amount:0, this.currency);
        }
        
    }

    ngOnChanges() {
        console.debug("VpePanelSwapComponent.ngOnChanges()");
        // this.own = {sell:[],buy:[]};
        // changes from outside
        if (!this.from.ok) {
            this.restaure();
        }
        
        // return this.dex.waitTokensLoaded.then(_ => this.restaure());
    }

    debug() {
        console.log("-------");
        console.log(this);
        console.log("-------");
    }
    

    /*
    buy() {
        if (!this.can_buy) return;

        // Check if the Assets and Tokens are initialized
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) this.restaure();
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) return;

        if (this.payment.amount.toNumber() == 0) return;
        console.error("---- buy()", this.payment, this.price, this.amount);
        let use_deposits = false;
        this.loading = true;
        this.feed.clearError("form");
        this.dex.createOrder("buy", this.amount, this.price, this.clientid, use_deposits).then(_ => {
            // success
            console.error("---- buy() success!!", _);
            this.loading = false;
        }).catch(e => {
            console.error("---- buy() error", e);
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

        // Check if the Assets and Tokens are initialized
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) this.restaure();
        if (!this.payment.ok || !this.price.ok || !this.amount.ok) return;
        
        console.log("SELL");
        let use_deposits = false;
        this.loading = true;
        this.feed.clearError("form");
        this.dex.createOrder("sell", this.amount, this.price, this.clientid, use_deposits).then(_ => {
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

    cancel(order: Order) {
        let key = "sell-" + order.id;
        this.feed.clearError("orders");
        if (order.deposit.token.symbol != order.currency.token.symbol) {
            key = "sell-" + order.id;
            this.c_loading[key] = true;
            console.log(key, this.c_loading);
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
            });;
        }
        if (order.deposit.token.symbol == order.currency.token.symbol) {
            key = "buy-" + order.id;
            this.c_loading[key] = true;
            console.log(key, this.c_loading);
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
        }        
    }
    */

    // swap ------------------------------------
    private onTokensReadySubscriber: Subscriber<boolean> = new Subscriber<boolean>();

    openTokenListFor(type: string, event: PointerEvent) {
        console.log("VpePanelSwapComponent.openTokenListFor()", type);
    }

    max_percent: number = 1;
    putPercentCommodity(percent: number, event: MouseEvent) {
        console.log("VpePanelSwapComponent.putPercentCommodity()", percent);
        if (this.balance_from) {
            this.from = new AssetDEX(this.balance_from.amount.multipliedBy(percent), this.commodity);
            this.fromChanged.next(this.from);
        }
    }

    ngOnDestroy(): void {
        console.log("VpePanelSwapComponent.ngOnDestroy()");
        this.onTokensReadySubscriber.unsubscribe();
    }

    ngOnInit(): void {
        console.log("VpePanelSwapComponent.ngOnInit()");
        this.onTokensReadySubscriber = new Subscriber<boolean>(this.handleTokenReady.bind(this));
    }

    ngAfterViewInit() {
        this.dex.onTokensReady.subscribe(this.onTokensReadySubscriber);
    }

    handleTokenReady(ready: boolean) {
        console.log("VpePanelSwapComponent.handleTokenReady() entra:", ready);
        this._from_list = null;
        this._to_list = null;
        var from_aux = this.from_list;
        var to_aux = this.to_list;
        console.log("VpePanelSwapComponent.handleTokenReady()  sale:", from_aux, to_aux);
    }

    handleFromChanged(token: TokenDEX) {
        console.log("VpePanelSwapComponent.handleFromChanged()", token);
        if (this.currency == token) {
            this.performSwitch();
        } else {
            this.commodity = token;
            this.restaure();
            this.fromChanged.next(this.from);    
        }
    }

    handleToChanged(token: TokenDEX) {
        console.log("VpePanelSwapComponent.handleToChanged()", token);
        if (this.commodity == token) {
            this.performSwitch();
        } else {
            this.currency = token;
            this.restaure();
            this.toChanged.next(this.to);
        }
    }

    performSwitch(event: MouseEvent | null = null) {
        console.error("VpePanelSwapComponent.performSwitch()");
        let auxT:TokenDEX = this.commodity;
        this.commodity = this.currency;
        this.currency = auxT;
        
        event ? event.stopPropagation() : null;

        // switch from with to
        let auxA:AssetDEX = this.from;
        this.from = this.to;
        this.to = auxA;
        this.to.amount = new BigNumber(0)
        
        this.toChanged.next(this.to);
        this.fromChanged.next(this.from);
    }

    show_inverse: boolean = false;
    togglePrice() {
        this.show_inverse = !this.show_inverse;
    }

    doSwap() {
        console.log("VpePanelSwapComponent.swap()");
        if (!this.summary) {
            this.feed.setError("form", "ERROR: No summary");
            return;
        }

        this.makeSwap.next();
    }


    
}

