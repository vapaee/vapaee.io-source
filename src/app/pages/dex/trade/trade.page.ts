import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { VapaeeDEX, TokenDEX, AssetDEX, TokenOrders, Market, OrderRow, MarketHeader, HistoryTx, CreateOrder, CancelOrder, InOutAssets, SwapSummary, VapaeeDEXSwap } from '@vapaee/dex';
import { Observable, of, Subscriber } from 'rxjs';
import { VpePanelOrderEditorComponent } from 'src/app/components/vpe-panel-order-editor/vpe-panel-order-editor.component';
import { VpePanelWalletComponent } from 'src/app/components/vpe-panel-wallet/vpe-panel-wallet.component';
import { MessageBlock, OrderRowclickEvent, VpeComponentsService } from 'src/app/components/vpe-components.service';
import { TransactionResult } from '@vapaee/wallet';


@Component({
    selector: 'trade-page',
    templateUrl: './trade.page.html',
    styleUrls: ['./trade.page.scss', '../../common.page.scss']
})
export class DexTradePage implements OnInit, OnDestroy {

    market_name: string                                 = "";
    commodity: TokenDEX                                 = new TokenDEX();
    currency: TokenDEX                                  = new TokenDEX();
    _orders:TokenOrders                                 = VpeComponentsService.Utils.emptyTokenOrders();
    timer: NodeJS.Timer                                 = setTimeout(() => {}, 0);
    chartHeight: number                                 = 0;
    _chartData:any[][][]                                = [[]];
    clientid: number                                    = 0;
    private onStateSubscriber: Subscriber<string>       = new Subscriber<string>(this.onStateChange.bind(this));
    private onBlocklistSubscriber: Subscriber<any[][]>  = new Subscriber<any[][]>(this.onBlocklistChange.bind(this));

    public loading: boolean                             = false;
    public error: string                                = "";

    // temporal
    public asset: AssetDEX =  new AssetDEX();

    @ViewChild(VpePanelOrderEditorComponent) orderform_min!:  VpePanelOrderEditorComponent;
    @ViewChild(VpePanelOrderEditorComponent) orderform_full!: VpePanelOrderEditorComponent;
   
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public swap: VapaeeDEXSwap,
        public route: ActivatedRoute,
        public components: VpeComponentsService

    ) {
        console.error("-- DexTradePage.constructor() --");
        this.chartHeight = Math.max(this.app.device.height - 430, 175); 
    }

    redirectToDefault() {
        console.error("DexTradePage.redirectToDefault()");
        if (this.commodity.ok) {
            this.app.navigate('/dex/trade/'+this.commodity.symbol+'/'+this.dex.currency.symbol);
        } else {
            this.app.navigate('/dex/trade/TLOS/DEX');
        }
    }
    
    async updateAll(updateUser:boolean) {
        console.error("DexTradePage.updateAll("+updateUser+")");
        await this.checkParams();
        await this.dex.waitOrderSummary;

        if (this.commodity.ok && this.currency.ok) {
            this.loadMarket(updateUser);
        } else {
            console.error("Invalid market: ", this.commodity, this.currency);
            this.redirectToDefault();
        }
    }

    private loadMarket(updateUser:boolean) {
        if (!this.commodity.ok || !this.currency.ok) {
            console.assert(this.commodity.ok && this.currency.ok, "Invalid market: " + JSON.stringify([this.commodity, this.currency]));
        } else {
            this.dex.initMarket(this.commodity, this.currency);
            if (this.market && this.market.real) {
                this.dex.updateTrade(this.commodity, this.currency, updateUser);
                this.app.setGlobal("lastmarket", this.market_name, true);
                this.assertSwapOrders();
            } else {
                console.error("Invalid market for book-order: " + this.market_name);
                this.redirectToDefault();
            }            
        }  
    }

    private async checkParams() {
        var com:string = this.route.snapshot.paramMap.get('comm') || "";
        var cur:string = this.route.snapshot.paramMap.get('curr') || "";
        this.market_name = com + "/" + cur;
        this.commodity = await this.dex.getToken(com);
        this.currency = await this.dex.getToken(cur);
    }

    async init() {
        console.error("DexTradePage.init() <-- ");
        this.orderform_min ? this.orderform_min.reset() : null;
        this.orderform_full ? this.orderform_full.reset() : null;
        this.commodity = new TokenDEX();
        this.currency  = new TokenDEX();
        this._chartData = [[]];
        
        setTimeout(() => { this.updateAll(true); }, 0);
        // this.timer = setInterval(() => { this.updateAll(false); }, 15000);
        console.error("this.timer = setInterval(() => { this.updateAll(false); }, 15000);");
    }

    async destroy() {
        // console.log("DexTradePage.destroy() <-- ");
        clearInterval(this.timer);
        clearInterval(this.swpo_timer);
    }

    get deposits(): AssetDEX[] {
        // return this.dex.deposits;
        return this.balances;
    }

    get balances(): AssetDEX[] {
        return this.dex.balances;
    }

    get market(): Market | null {
        if (!this.market_name) return null;
        return this.dex.market(this.market_name);
    }

    get history(): HistoryTx[] {
        var market = this.market;
        // console.log("history()",this.table, table.table, table.history);
        return market ? market.history : [];
    }

    get orders(): TokenOrders {
        var market = this.market;
        return market ? market.orders : this._orders;
    }

    get buyorders(): OrderRow[] {
        var market = this.market;
        return market ? market.orders.buy : this._orders.buy;
    }

    get sellorders(): OrderRow[] {
        var market = this.market;
        return market ? market.orders.sell : this._orders.sell;
    }

    get headers(): MarketHeader {
        var market = this.market;
        var header = { 
            sell: {total:new AssetDEX(), orders:0}, 
            buy: {total:new AssetDEX(), orders:0}
        }
        return market ? (market.header ? market.header : header) : header;
    }

    get summary() {
        var market = this.market;
        var _summary = Object.assign({
            percent: 0,
            percent_str: "0%",
            price: this.dex.zero_telos.clone(),
            records: [],
            volume: this.dex.zero_telos.clone()
        }, market ? market.summary : {});
        return _summary;
    }

    get chartData() {
        if (!this._chartData) this.regenerateChartData();
        return this._chartData;
    }

    get tokens() {
        return this.dex.tokens;
    }

    get markets() {
        return this.dex.topmarkets.filter(m => m.real);
    }

    private regenerateChartData() {
        var market = this.market;
        if (market) {
            this._chartData = market.blocklevels;

            if (
                market.blocklist.length == 0 && market.blocks > 0
            ) {
                setTimeout(() => {
                    console.log("CHART this._chartData = [[]];");
                    this._chartData = [[]];
                }, 1200);
            }
        } else {
        }
    }


    ngOnDestroy() {
        this.onStateSubscriber.unsubscribe();
        this.onBlocklistSubscriber.unsubscribe();
        this.destroy();
    }

    ngOnInit() {
        this.init();
        this.app.onStateChange.subscribe(this.onStateSubscriber);
        this.dex.onTradeUpdated.subscribe(this.onBlocklistSubscriber);
    }

    onClickRow(e:{type:string, row:OrderRow}) {
        if (this.orderform_min) {
            this.orderform_min.setPrice(e.row.price.clone());
            this.orderform_min.setAmount(e.row.sum.clone());
            this.orderform_min.wantsTo(e.type == "sell" ? "buy" : "sell");
            this.orderform_min.setSwap(e.row.str == "SWAP");
        }

        if (this.orderform_full) {
            this.orderform_full.setPrice(e.row.price.clone());
            this.orderform_full.setAmount(e.row.sum.clone());
            this.orderform_full.wantsTo(e.type == "sell" ? "buy" : "sell");
            this.orderform_full.setSwap(e.row.str == "SWAP");
        }
    }

    onClickPrice(e: OrderRowclickEvent) {
        this.orderform_min.setPrice(e.row.price.clone());
        this.orderform_full.setPrice(e.row.price.clone());
    }
    
    onStateChange(state:string) {
        console.error("DexTradePage.onStateChange("+state+")");
        if (state == "dex-trade") {
            this.destroy();
            this.init();
        }
    } 
    
    onBlocklistChange(blocks:any[][]) {
        // console.log("DexTradePage.onBlocklistChange()",blocks);
        this.regenerateChartData();
    }

    // wallet actions 
    get withdraw_error(): string {
        return this.dex.feed.error('withdraw') || "";
    }

    get deposit_error(): string {
        return this.dex.feed.error('deposit') || "";
    }    

    onWalletConfirmDeposit(amount: AssetDEX, wallet: VpePanelWalletComponent) {
        this.loading = true;
        this.dex.deposit(amount).then(_ => {
            this.loading = false;
            wallet.closeInputs();
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });
    }

    onWalletConfirmWithdraw(amount: AssetDEX, wallet: VpePanelWalletComponent) {
        this.loading = true;
        this.dex.withdraw(amount, this.clientid).then(_ => {
            this.loading = false;
            wallet.closeInputs();
        }).catch(e => {
            console.error(typeof e, e);
            this.loading = false;
        });        
    }

    gotoAccount() {
        this.app.navigate('/dex/account/' + this.dex.current.name);
    }

    selectMarket(market_name: string) {
        console.log("DexTradePage.selectMarket()", market_name);
        this.app.navigate('/dex/trade/' + market_name);
    }

    tableChange(table: string) {
        console.log("DexTradePage.tableChange()", table);
        this.selectMarket(table);
    }

    switchTokens() {
        this.selectMarket(this.dex.inverseName(this.market_name));
    }

    makeOrder(params: CreateOrder) {
        this.message = [];
                
        console.error("DexTradePage.onMakeOrder()", [params]);
        let use_deposits = false;
        this.dex.createOrder(params.type, params.quantity, params.price, this.clientid, use_deposits).then((trx:TransactionResult) => {
            // success
            console.error("---- buy() success!!", trx);
            
            this.message = this.createSuccess({
                quantity: params.quantity.str,
                price: params.price.str,
                txid: trx.transaction_id,
                ordertype: params.type == "sell" ? this.local.string.sellorder : this.local.string.buyorder,
            });

        }).catch(e => {
            console.error("---- buy() error", e);

            if (typeof e == "string") {
                this.message = this.createError(e);
            } else {
                this.message = this.createError(e.message);
            }

        });
    }

    makeCancel(cancel: CancelOrder) {
        this.message = [];
        this.dex.cancelOrder(cancel.type, cancel.commodity, cancel.currency, cancel.numbers).then((trx:TransactionResult) => {
            // success
            console.error("---- buy() success!!", trx);
            
            this.message = this.createCancelSuccess({
                orderid: cancel.numbers[0],
                market_name: this.market_name,
                txid: trx.transaction_id,
                ordertype: cancel.type == "sell" ? this.local.string.sellorder : this.local.string.buyorder,
            });

        }).catch(e => {
            console.error("---- cancel() error", e);

            if (typeof e == "string") {
                this.message = this.createError(e);
            } else {
                this.message = this.createError(e.message);
            }

        });
    }

    makeSwap(swap: CreateOrder) {
        console.error("DexTradePage.makeSwap()", swap.type, swap.price.str, swap.quantity.str);
        if (swap.type == "sell") {
            this.app.navigate('/dex/swap/' + swap.quantity.token.symbol + '/' + swap.price.token.symbol + '/' + swap.quantity.str.split(" ")[0]);
        } else if (swap.type == "buy") {
            console.error("HAY QUE DETERMINAR LA CANTIDAD");
            console.error("this.orderform.payment.str", this.orderform.payment.str);
            console.error("this.orderform.money.str", this.orderform.money.str);
            console.error("this.orderform.amount.str", this.orderform.amount.str);
            
            this.app.navigate('/dex/swap/' + swap.price.token.symbol + '/' + swap.quantity.token.symbol + '/' + this.orderform.payment.str.split(" ")[0]);
        }
    }

    // messages (ini) ------------------
    public message: MessageBlock[] = [];
    public message_title: string = "";
    public warning_buttons: MessageBlock[] = [];

    createError(message: string): MessageBlock[] {
        this.message_title = this.local.string.error;
        return [{
            class: 'text-danger text-center mt-2',
            text: "ERROR: " + message
        }];
    }

    createSuccess(data:any): MessageBlock[] {
        this.message_title = this.local.string.success;
        
        return [{
            // SWAP Successful !
            class: 'text-md-center text-success text-center',
            text: this.local.merge(this.local.string.order_success_1, data)
        },
        {
            // 123.23534 CNT into 24.35346 DEX
            class: 'title text-center mt-2',
            text: this.local.merge(this.local.string.order_success_2, data)
        },
        {
            // TxHash: 0x1234567890123456789012345678901234567890
            class: 'small text-center mt-2',
            text: this.local.merge(this.local.string.order_success_3, data)
        }];
    }

    createWarning(data:any): MessageBlock[] {
        this.message_title = this.local.string.warning;
        this.warning_buttons = [{
            class: 'btn-danger btn-sm',
            text: this.local.string.cancel.toUpperCase(),
        },{
            class: 'btn-fancy btn-sm',
            text: this.local.string.confirm.toUpperCase(),
        }];

        return [{
            // Warning! slippage too high!
            class: 'text-md-center text-warning text-center',
            text: this.local.merge(this.local.string.swap_warning_1, data)
        },
        {
            // slippage: {{slippage}}%
            class: 'title text-center text-danger',
            text: this.local.merge(this.local.string.swap_warning_2, data)
        },
        {
            // Do you still want to continue?
            class: 'small text-center',
            text: this.local.merge(this.local.string.swap_warning_3, data)
        }];
    }

    closeSuccess() {
        this.message_title = this.local.string.closing;
        setTimeout(() => {
            this.message = [];
        }, 1500);
    }

    createCancelSuccess(data:any): MessageBlock[] {
        this.message_title = this.local.string.success;
        
        return [{
            // Order canceled !
            class: 'text-md-center text-success text-center',
            text: this.local.merge(this.local.string.cancel_success_1, data)
        },
        {
            // orderid: {{orderid}} of market {{market_name}}
            class: 'title text-center mt-2',
            text: this.local.merge(this.local.string.cancel_success_2, data)
        },
        {
            // TxHash: 0x1234567890123456789012345678901234567890
            class: 'small text-center mt-2',
            text: this.local.merge(this.local.string.cancel_success_3, data)
        }];
    }
    // messages (end) ------------------

    // calculate swap summary (ini) --------------------------------------------------
    warning: boolean = false;
    swap_summary: SwapSummary | null = null;
    NORMAL_SLIPPAGE: number = 10;
    from: AssetDEX                     = new AssetDEX();
    to: AssetDEX                       = new AssetDEX();

    calculateSwapSummary(data:InOutAssets): Observable<SwapSummary | null> {
        console.debug("DexSwapPage.calculateSwapSummary() ", data.in.toString(), data.out.toString());
        if (!this.commodity.ok || !this.currency.ok) return of(this.swap_summary);
        if (data.in.toNumber() == 0 && data.out.toNumber() == 0) return of(this.swap_summary);
        this.swap_summary = null;
        return this.calculateSwapSummaryClear(data);
    }

    private calculateSwapSummaryClear(data:InOutAssets): Observable<SwapSummary | null> {
        console.debug("DexSwapPage.calculateSwapSummaryClear() ", data.in.toString(), data.out.toString());
        var observable = new Observable<SwapSummary | null>(observer => {
            this.swap.calculate(data).subscribe((summary: SwapSummary) => {
                console.debug("summary: ", summary.price.str, summary.inverse.str, summary.slippage, summary.outcome.str);
                this.swap_summary = summary;
                /*this.warning = summary.slippage > this.NORMAL_SLIPPAGE;

                if (data.in.amount.toNumber() > 0) {
                    this.from = data.in;
                    this.to = this.swap_summary.outcome;
                } else {
                    this.from = this.swap_summary.outcome;
                    this.to = data.out; 
                }*/
                
                observer.next(summary);
                observer.complete();
            }, (e:any) => {
                console.error(e);
                // this.message = this.createError(e.message);
                this.swap_summary = null;
                observer.next(null);
                observer.complete();
            });
        });

        return observable;
    }
    // calculate swap summary (end) --------------------------------------------------
    get orderform(): VpePanelOrderEditorComponent {
        if (this.orderform_full)
            return this.orderform_full;
        else 
            return this.orderform_min;
    }

    // Swap sync ---------------------------------
    onAmountChange(a:AssetDEX) {
        console.log("DexSwapPage.onAmountChange() ", this.orderform.amount.toString());

        let amount: AssetDEX = new AssetDEX( this.orderform.amount.toNumber() > 0 ? this.orderform.amount: 0, this.orderform.amount.token);
        let price: AssetDEX = new AssetDEX( this.orderform.price.toNumber() > 0 ? this.orderform.price: 0, this.orderform.price.token);
        
        this.createSwapOrders(price, amount);
    }

    swpo_timer_time = 100;
    swpo_timer: NodeJS.Timer = setTimeout(() => {}, 0);

    assertSwapOrders() {
        console.error("DexSwapPage.assertSwapOrders()");
        clearInterval(this.swpo_timer);

        this.swpo_timer = setInterval(() => {
            console.error("-- setInterval --");
           
            if (this.orders.buy.length == 0) return;
            if (this.orders.buy.filter(o => o.str == "SWAP").length > 0) {
                // already exists
                // clearInterval(this.swpo_timer);
                this.swpo_timer_time *= 2;
                this.assertSwapOrders();
                return;
            }
            
            // if not exists, create a new swap orders
            let price: AssetDEX = new AssetDEX(1, this.currency);
            let amount: AssetDEX = new AssetDEX(1, this.commodity);

            // para el caso de que el balance actual es muy alto, los slippage quedan super altos
            // if (this.dex.getBalance(this.commodity).toNumber() > 0) {
            //     amount = this.dex.getBalance(this.commodity);
            // }
            
            this.createSwapOrders(price, amount);
        }, this.swpo_timer_time);
    }

    createSwapOrders(price: AssetDEX, amount: AssetDEX) {
        console.log("DexTradePage.createSwapOrders() ", price.toString(), amount.toString());
        if (price.toNumber() == 0) {
            if (this.orders.buy.length > 0) {
                price = new AssetDEX(this.orders.buy[0].price.toNumber(), this.orders.buy[0].price.token);
                this.orderform.setPrice(price);
            } else {
                console.error("DexSwapPage.onAmountChange() price is 0. NOT IMPLEMENTED");
                price = new AssetDEX(1, this.orderform.price.token);
            }
        }

        this.calculateSwapSummary({
            in: amount,
            out: new AssetDEX(0, this.currency)
        }).subscribe((summary: SwapSummary | null) => {
            if (!summary) return;

            let swapOrder:OrderRow = {
                currency: amount.times(summary.price) as AssetDEX,
                inverse: summary.inverse,
                orders: [],
                owners: {},
                price: summary.price,
                str: "SWAP",
                sum: new AssetDEX(0, this.dex.currency),
                sumcurrency: new AssetDEX(0, this.dex.currency),
                total: amount,
            }
            console.log(swapOrder);

            this.orders.buy = this.orders.buy.filter(o => o.str != "SWAP");
            this.orders.buy.splice(0,0,swapOrder);
            this.orders.buy.sort(function(a:OrderRow, b:OrderRow){
                if(a.price.amount.isLessThan(b.price.amount)) return 1;
                if(a.price.amount.isGreaterThan(b.price.amount)) return -1;
                return 0;
            });
            this.dex.recalculateSumInOrderRows(this.orders.buy);
            
        });

        let values: InOutAssets = {
            in: price.times(amount) as AssetDEX,
            out: new AssetDEX(0, this.commodity)
        }

        this.calculateSwapSummary(values).subscribe((summary: SwapSummary | null) => {
            if (!summary) return;
            values.in = summary.inverse.times(amount) as AssetDEX;

            this.calculateSwapSummary(values).subscribe((summary: SwapSummary | null) => {
                if (!summary) return;
    
                console.log("--------------------------");
                console.log("values.in:", values.in.str);     // 2.7000 DEX
                console.log("inverse:", summary.inverse.str); // 0.3098 DEX
                console.log("price:", summary.price.str);     // 3.2276 CNT
                console.log("outcome:", summary.outcome.str); // 8.7145 CNT
                
    
                let swapOrder:OrderRow = {
                    currency: values.in,
                    inverse: summary.price,
                    orders: [],
                    owners: {},
                    price: summary.inverse,
                    str: "SWAP",
                    sum: new AssetDEX(0, this.dex.currency),
                    sumcurrency: new AssetDEX(0, this.dex.currency),
                    total: amount,
                }
                console.log(swapOrder);
    
                this.orders.sell = this.orders.sell.filter(o => o.str != "SWAP");
                this.orders.sell.splice(0,0,swapOrder);
                this.orders.sell.sort(function(a:OrderRow, b:OrderRow){
                    if(a.price.amount.isLessThan(b.price.amount)) return -1;
                    if(a.price.amount.isGreaterThan(b.price.amount)) return 1;
                    return 0;
                });
                this.dex.recalculateSumInOrderRows(this.orders.sell);            
            });

        });

    }

    onPriceChange(price:AssetDEX) {
    }


}
