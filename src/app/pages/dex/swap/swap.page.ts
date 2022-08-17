import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/common/app.service';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { ActivatedRoute } from '@angular/router';
import { VapaeeDEX, VapaeeDEXSwap, TokenDEX, AssetDEX, TokenOrders, Market, OrderRow, InOutAssets, SwapSummary, ChartBlock } from '@vapaee/dex';
import { Observable, of, Subscriber } from 'rxjs';
import { VpePanelOrderEditorComponent } from 'src/app/components/vpe-panel-order-editor/vpe-panel-order-editor.component';
import { VpePanelWalletComponent } from 'src/app/components/vpe-panel-wallet/vpe-panel-wallet.component';
import { MessageBlock, OrderRowclickEvent, VpeComponentsService } from 'src/app/components/vpe-components.service';
import { Location } from '@angular/common';
import { VpePanelSwapComponent } from 'src/app/components/vpe-panel-swap/vpe-panel-swap.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'swap-page',
    templateUrl: './swap.page.html',
    styleUrls: ['./swap.page.scss', '../../common.page.scss']
})
export class DexSwapPage implements AfterViewInit, OnDestroy {

    _market_name:string = "";
    _orders: TokenOrders = VpeComponentsService.Utils.emptyTokenOrders();
    _chartData:ChartBlock[][] = [[]];
    
    commodity: TokenDEX                                     = new TokenDEX();
    currency: TokenDEX                                      = new TokenDEX();
    timer: NodeJS.Timer                                     = setTimeout(() => {}, 0);
    chartHeight: number                                     = 0;
    clientid: number                                        = 0;
    private onStateSubscriber: Subscriber<string>           = new Subscriber<string>(this.onStateChange.bind(this));
    private onSwapUpdateSubscriber: Subscriber<Market>      = new Subscriber<Market>(this.onSwapMarketUpdated.bind(this));

    public loading: boolean                                 = false;
    // temporal
    public asset: AssetDEX =  new AssetDEX();

    @ViewChild(VpePanelSwapComponent) orderform!:  VpePanelSwapComponent;

   
    constructor(
        public app: AppService,
        public local: LocalStringsService,
        public dex: VapaeeDEX,
        public swap: VapaeeDEXSwap,
        public route: ActivatedRoute,
        public components: VpeComponentsService,
        private location: Location,
        public ngxSmartModalService: NgxSmartModalService
    ) {
        console.debug("-- DexSwapPage.constructor() --");
        this.clientid = 0;
        this.chartHeight = Math.max(this.app.device.height - 430, 175); 

        // TODO: habría que hacer el mismo proceso de Suscribir y desuscribir esto
        // pero teniendo en cuenta que el evento que busco no es cambiar de logging sino
        // que se actualicen los balances (cosa que le falta al DEX)
        this.dex.onBalancesUpdated.subscribe(balances => {
            this._balance_from = new AssetDEX();
            this._balance_to = new AssetDEX();
        });

        this.dex.onMarketUpdated.subscribe(market => {
            this.regenerateChartData();
        });
    }
    
    async initTokens() {
        await this.checkParams();

        if (this.commodity.ok && this.currency.ok) {
            this.from = new AssetDEX(this.from.amount, this.commodity);
            this.to = new AssetDEX(0, this.currency); 
            console.error("DexSwapPage.initTokens() -> ", this.market_name);
            return this.loadMarket();
        } else {
            console.error("Invalid market: ", this.commodity, this.currency);
            this.app.navigate('/dex/swap/TLOS/DEX');
        }        
    }

    private loadMarket() {
        console.debug("DexSwapPage.loadMarket()");
        if (!this.commodity.ok || !this.currency.ok) {
            console.assert(this.commodity && this.currency, "Invalid market: " + JSON.stringify([this.commodity, this.currency]));
        } else {
            let init: boolean = false;
            if (this.market) {
                if (this.market.currency.symbol != this.currency.symbol || this.market.commodity.symbol != this.commodity.symbol) {
                    this._market_name = "";
                    init = true;
                } else if (this.market.blocklist.length == 0) {
                    // init = true;
                    console.error("DexSwapPage.loadMarket() NEW market SKIPPED!!!!", this.market_name);
                }
            } else {
                init = true;
            }

            if (init) {
                console.error("DexSwapPage.loadMarket() NEW market ", this.market_name);
                this.app.setGlobal("lastmarket", this.market_name, true);           
                this.dex.initMarket(this.commodity, this.currency);
                this.dex.rebuildMarketBlocks(this.market_name);
            }

            if (!this.summary) {
                let path = this.swap.createSwapPath(this.from, this.to.tokenDex);
                return this.dex.updateSwap(path);
            } else {
                return this.dex.updateSwap(this.summary.path);
            }
            
        }
        return Promise.resolve();
    }

    private async checkParams() {
        var com:string = this.route.snapshot.paramMap.get('comm') || "";
        var cur:string = this.route.snapshot.paramMap.get('curr') || "";
        var amount:string = this.route.snapshot.paramMap.get('amount') || "";
        this.commodity = await this.dex.getToken(com);
        this.currency = await this.dex.getToken(cur);
        this._market_name = "";

        if (amount) {
            if (this.from.toNumber() == 0) {
                this.from = new AssetDEX(parseFloat(amount), this.commodity);
            }
        }

        console.log("DexSwapPage.checkParams() -> ", this.market_name, this.from.toString());
    }

    get market_name(): string {
        if (this._market_name) return this._market_name;
        if (this.commodity.ok && this.currency.ok) {
            this._market_name = this.commodity.symbol.toUpperCase() + "/" + this.currency.symbol.toUpperCase();
        }
        return this._market_name;
    }

    async init() {
        console.error("DexSwapPage.init() <-- ");
        this.orderform.reset();
        this.commodity = new TokenDEX();
        this.currency  = new TokenDEX();
        this._market_name = "";
        this._chartData = [[]];
        
        setTimeout(() => { this.initTokens(); }, 0);
        // this.timer = setInterval(() => { this.initTokens(false); }, 15000);
        console.error("this.timer = setInterval(() => { this.initTokens(false); }, 15000);");
    }

    async destroy() {
        // console.log("DexSwapPage.destroy() <-- ");
        clearInterval(this.timer);
    }
    
    get chartData() {
        if (!this._chartData) this.regenerateChartData();
        return this._chartData;
    }

    get tokens() {
        return this.dex.tokens;
    }

    get markets() {
        return this.dex.topmarkets;
    }

    get market(): Market | null{
        if (!this.market_name) return null;
        return this.dex.market(this.market_name);
    }

    private regenerateChartData() {
        console.error("DexSwapPage.regenerateChartData() SKIPPED"); if (1>0) return;
        var market = this.market;
        if (market) {
            this._chartData = market.blocklevels;

            console.debug("DexSwapPage.regenerateChartData() ----> ", this._chartData);

            if (
                market.blocklist.length == 0 && market.blocks > 0
            ) {

                console.debug("DexSwapPage.regenerateChartData() ----> market: ", [market.blocklist.length, market.blocks]);

                /*
                setTimeout(() => {
                    console.log("CHART this._chartData = [[]];");
                    this._chartData = [[]];
                }, 1200);
                */
            }
        } else {
        }
    }

    ngOnDestroy() {
        this.onStateSubscriber.unsubscribe();
        this.onSwapUpdateSubscriber.unsubscribe();
        this.destroy();
    }

    ngAfterViewInit() {
        this.init();
        this.app.onStateChange.subscribe(this.onStateSubscriber);
        this.dex.onSwapUpdated.subscribe(this.onSwapUpdateSubscriber);
    }
    
    onStateChange(state:string) {
        console.error("DexSwapPage.onStateChange("+state+")");
        if (state == "dex-swap") {
            this.destroy();
            this.init();
        }
    } 
    
    onSwapMarketUpdated(market: Market) {
        console.log("DexSwapPage.onSwapMarketUpdated() --> ",market.name);
        this.regenerateChartData();
    }

    // wallet actions 

    get withdraw_error(): string {
        return this.dex.feed.error('withdraw') || "";
    }

    get deposit_error(): string {
        return this.dex.feed.error('deposit') || "";
    }   

    gotoAccount() {
        this.app.navigate('/dex/account/' + this.dex.current.name);
    }

    selectMarket(market_name: string) {
        console.error("DexSwapPage.selectMarket()", market_name);
        this.app.navigate('/dex/swap/' + market_name);
    }

    tableChange(market_name: string) {
        console.log("DexSwapPage.market_nameChange()", market_name);
        this.selectMarket(market_name);
    }

    switchTokens() {
        this.selectMarket(this.dex.inverseName(this.market_name));
    }

    // Swap -----------------
    _balance_from: AssetDEX            = new AssetDEX();
    _balance_to:   AssetDEX            = new AssetDEX();
    from: AssetDEX                     = new AssetDEX();
    to: AssetDEX                       = new AssetDEX();
    get balance_from(): AssetDEX {
        if (this._balance_from.ok) return this._balance_from;
        if (this.commodity.ok) {
            this._balance_from = this.dex.getBalance(this.commodity);
            this.updateSummary();
            return this._balance_from;
        }
        return this._balance_from;
    }

    get balance_to(): AssetDEX {
        if (this._balance_to.ok) return this._balance_to;
        if (this.currency.ok) {
            this._balance_to = this.dex.getBalance(this.currency);
            this.updateSummary();
            return this._balance_to;
        }
        return this._balance_to;
    }

    onToChanged(to: AssetDEX) {
        console.log("DexSwapPage.onToChanged()", to.token.toString());
        this._balance_to = new AssetDEX();
        this.currency = to.tokenDex;
        this.to = to;

        // cancel if this is a switch
        if (this.currency == this.commodity) return;

        this.recalculate();
        setTimeout(() => { 
            this._market_name = "";
            this.location.go('/dex/swap/' + this.market_name);
        }, 0);
    }

    onFromChanged(from: AssetDEX) {
        console.log("DexSwapPage.onFromChanged()", from.token.toString());
        this._balance_from = new AssetDEX();
        this.commodity = from.tokenDex;
        this.from = from;
        this.recalculate();
        setTimeout(() => { 
            this._market_name = "";
            this.location.go('/dex/swap/' + this.market_name);
        }, 0);
    }

    updateSummary(values:InOutAssets | null = null) {
        let _values:InOutAssets = { in: this.from, out: new AssetDEX(0, this.currency) };
        if (values) { _values = values; }
        this.calculateSwapSummary(_values).subscribe((result: SwapSummary | null) => {
            console.log("DexSwapPage.onValueChanged() result", result);
            this.regenerateChartData();
        });
    }

    onValueChanged(values:InOutAssets) {
        console.log("DexSwapPage.onValueChanged()", values.in.toString(), values.out.toString());
        // values.in.toString(); --> "1.0000 CNT"
        // values.out.toString(); --> "0.0000 DEX"

        // esto es simulado
        // setTimeout(() => {
        //     this.from = new AssetDEX(values.in.toString());
        //     this.to = new AssetDEX(values.in.amount, this.currency);
        // }, 100);

        this.clear();
        this.updateSummary(values);                
    }

    recalculate() {
        console.log("DexSwapPage.recalculate()");
        let values:InOutAssets = { in: this.from, out: new AssetDEX(0, this.currency) };
        
        this.calculateSwapSummary(values).subscribe((result: SwapSummary | null) => {
            this.loadMarket().then(() => {
                this.regenerateChartData();
            });
        });
    }

    clear() {
        this.summary = null;
        this.warning = false;
        this.message = [];
    }

    // calculate swap summary (ini) --------------------------------------------------
    warning: boolean = false;
    summary: SwapSummary | null = null;
    NORMAL_SLIPPAGE: number = 10;

    calculateSwapSummary(data:InOutAssets): Observable<SwapSummary | null> {
        console.debug("DexSwapPage.calculateSwapSummary() ", data.in.toString(), data.out.toString());
        if (!this.commodity.ok || !this.currency.ok) return of(this.summary);
        if (data.in.toNumber() == 0 && data.out.toNumber() == 0) return of(this.summary);
        this.summary = null;
        return this.calculateSwapSummaryClear(data);
    }

    private calculateSwapSummaryClear(data:InOutAssets): Observable<SwapSummary | null> {
        console.debug("DexSwapPage.calculateSwapSummaryClear() ", data.in.toString(), data.out.toString());
        var observable = new Observable<SwapSummary | null>(observer => {
            this.swap.calculate(data).subscribe((summary: SwapSummary) => {
                console.debug("summary: ", summary.price.str, summary.inverse.str, summary.slippage, summary.outcome.str);
                this.summary = summary;
                this.warning = summary.slippage > this.NORMAL_SLIPPAGE;

                if (data.in.amount.toNumber() > 0) {
                    this.from = data.in;
                    this.to = this.summary.outcome;
                } else {
                    this.from = this.summary.outcome;
                    this.to = data.out; 
                }
                
                observer.next(summary);
                observer.complete();
            }, (e:any) => {
                console.error(e);
                this.message = this.createError(e.message);
                this.summary = null;
                observer.next(null);
                observer.complete();
            });
        });

        return observable;
    }
    // calculate swap summary (end) --------------------------------------------------

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
            text: this.local.merge(this.local.string.swap_success_1, data)
        },
        {
            // 123.23534 CNT into 24.35346 DEX
            class: 'title text-center mt-2',
            text: this.local.merge(this.local.string.swap_success_2, data)
        },
        {
            // TxHash: 0x1234567890123456789012345678901234567890
            class: 'tiny text-center mt-2',
            text: this.local.merge(this.local.string.swap_success_3, data)
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
    // messages (end) ------------------

    makeSwap() {
        if (!this.commodity.ok || !this.currency.ok) return;
        if (this.summary == null) return;


        if (this.from.toNumber() > this.balance_from.toNumber()) {
            this.message = this.createError(this.local.string.insuff_balance);
            return;
        }

        
        if (this.summary.slippage > this.NORMAL_SLIPPAGE) {
            this.message = this.createWarning(this.summary);
            this.ngxSmartModalService.getModal('swapWarning').open();
        } else {
            this.confirmSwap();
        }
    }

    onWarningBtn(btn: MessageBlock) {
        console.debug("DexSwapPage.onWarningBtn() invalid assets. Cannot swap.");
        if (btn.text == this.local.string.confirm.toUpperCase()) {
            this.confirmSwap();
        } else {
            


        }

        this.message = []
        this.ngxSmartModalService.getModal('swapWarning').close();

    }

    confirmSwap() {
        if (!this.commodity.ok || !this.currency.ok) {
            console.debug("DexSwapPage.confirmSwap() invalid assets. Cannot swap.");
            return;
        }
        if (this.summary == null) {
            console.debug("DexSwapPage.confirmSwap() invalid summary. Cannot swap.");
            return;
        }

        this.message = [];

        let one: BigNumber= new BigNumber(1);
        this.summary.outcome.amount = new BigNumber(this.summary.outcome.amount.minus(one).toFixed(0));

        this.swap.convert(this.from, this.summary).then(result => {
            console.debug("----------------------------------");
            console.debug("VpePanelSwapComponent.swap()", result);
            console.debug("----------------------------------");            
            
            this.recalculate();
            this.swap.updateSwapState();

            this.message = this.createSuccess({
                in: this.from.toString(),
                out: result.outcome.str,
                txid: result.txid
            });

            console.debug("VpePanelSwapComponent.swap() this.message", this.message);
            
        }).catch(e => {
            console.debug("----------------------------------");
            console.debug("VpePanelSwapComponent.swap()", e);
            console.debug("----------------------------------");

            if (typeof e == "string") {
                this.message = this.createError(e);
            } else {
                this.message = this.createError(e.message);
            }
            console.debug("VpePanelSwapComponent.swap() this.message", this.message);
        });
    }

    
    
}
